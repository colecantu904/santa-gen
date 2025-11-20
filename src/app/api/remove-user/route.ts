import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest } from 'next/server';

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, roomCode, roomSecret } = body;

    if (!userId || !roomCode || !roomSecret) {
      return Response.json(
        { error: 'User ID, room code, and secret are required' },
        { status: 400 }
      );
    }

    const { data: verifyData, error: verifyError } = await supabaseAdmin
      .from('SantaGenUsers')
      .select('id')
      .eq('room_code', roomCode)
      .eq('room_secret', roomSecret)
      .limit(1);

    if (verifyError || !verifyData || verifyData.length === 0) {
      return Response.json(
        { error: 'Invalid room code or secret' },
        { status: 403 }
      );
    }

    const { error } = await supabaseAdmin
      .from('SantaGenUsers')
      .delete()
      .eq('id', userId)
      .eq('room_code', roomCode);

    if (error) {
      console.error('Supabase error:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Server error:', error);
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
