import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new NextResponse('Unauthorized', { status: 401 });
  const body = await req.json();
  const { data, error } = await supabase
    .from('progressions')
    .update(body)
    .eq('id', params.id)
    .eq('user_id', user.id)
    .select()
    .single();
  if (error) return new NextResponse(error.message, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new NextResponse('Unauthorized', { status: 401 });
  const { error } = await supabase
    .from('progressions')
    .delete()
    .eq('id', params.id)
    .eq('user_id', user.id);
  if (error) return new NextResponse(error.message, { status: 500 });
  return new NextResponse(null, { status: 204 });
}
