import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roomCode, roomPass } = body;

    console.log('Validating room:', { roomCode, roomPass });

    if (!roomCode || !roomPass) {
      return Response.json(
        { error: 'Room code and password are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('SantaGenUsers')
      .select('room_code, room_pass')
      .eq('room_code', roomCode)
      .eq('room_pass', roomPass)
      .limit(1);

    console.log('Query result:', { data, error });

    if (error) {
      console.error('Supabase error:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return Response.json(
        { error: 'Invalid room code or password' },
        { status: 404 }
      );
    }

    return Response.json({ valid: true }, { status: 200 });
  } catch (error) {
    console.error('Server error:', error);
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
