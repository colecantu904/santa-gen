import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const roomCode = searchParams.get('room_code');
    const email = searchParams.get('email');

    if (!roomCode || !email) {
      return Response.json(
        { error: 'Both room_code and email are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('SantaGenUsers')
      .select('*')
      .eq('room_code', roomCode)
      .eq('email', email)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    return Response.json({ user: data }, { status: 200 });
  } catch (error) {
    console.error('Server error:', error);
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
