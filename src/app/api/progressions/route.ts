import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const FREE_LIMIT = 3;

const upsertSchema = z.object({
  name: z.string().min(1).max(100),
  genre: z.string().min(1).max(40),
  key: z.string().min(1).max(4),
  scale: z.string().min(1).max(40),
  bpm: z.number().int().min(40).max(240),
  chords: z.array(z.string()).min(1).max(32),
  roman: z.array(z.string()).optional(),
  is_public: z.boolean().optional(),
});

export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new NextResponse('Unauthorized', { status: 401 });

  const { data, error } = await supabase
    .from('progressions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  if (error) return new NextResponse(error.message, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new NextResponse('Unauthorized', { status: 401 });

  const body = upsertSchema.safeParse(await req.json());
  if (!body.success) return new NextResponse(body.error.message, { status: 400 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single();

  if (!profile || profile.plan === 'free') {
    const { count } = await supabase
      .from('progressions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id);
    if ((count ?? 0) >= FREE_LIMIT) {
      return new NextResponse('Free plan is limited to 3 saved progressions. Upgrade to Pro for unlimited.', {
        status: 402,
      });
    }
  }

  const { name, genre, key, scale, bpm, chords, roman, is_public } = body.data;
  const { data, error } = await supabase
    .from('progressions')
    .insert({
      user_id: user.id,
      name,
      genre,
      key,
      scale,
      bpm,
      chords: { chords, roman },
      is_public: !!is_public,
    })
    .select()
    .single();

  if (error) return new NextResponse(error.message, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
