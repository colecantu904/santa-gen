import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roomCode, roomSecret } = body;

    if (!roomCode || !roomSecret) {
      return Response.json(
        { error: 'Room code and secret are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('SantaGenUsers')
      .select('*')
      .eq('room_code', roomCode)
      .eq('room_secret', roomSecret);

    if (error) {
      console.error('Supabase error:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return Response.json(
        { error: 'Invalid room code or secret' },
        { status: 404 }
      );
    }

    return Response.json({ valid: true, users: data }, { status: 200 });
  } catch (error) {
    console.error('Server error:', error);
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
