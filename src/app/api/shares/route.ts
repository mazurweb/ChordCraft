import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const schema = z.object({ progression_id: z.string().uuid() });

function genShareId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let out = '';
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new NextResponse('Unauthorized', { status: 401 });

  const body = schema.safeParse(await req.json());
  if (!body.success) return new NextResponse(body.error.message, { status: 400 });

  // Verify ownership and mark public.
  const { data: prog, error: getErr } = await supabase
    .from('progressions')
    .select('id, user_id')
    .eq('id', body.data.progression_id)
    .single();
  if (getErr || !prog || prog.user_id !== user.id) {
    return new NextResponse('Not found', { status: 404 });
  }
  await supabase.from('progressions').update({ is_public: true }).eq('id', prog.id);

  const share_id = genShareId();
  const { data, error } = await supabase
    .from('shares')
    .insert({ progression_id: prog.id, share_id })
    .select()
    .single();
  if (error) return new NextResponse(error.message, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
