import { supabase } from '@/lib/supabase';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const roomCode = searchParams.get('room_code');

    let query = supabase.from('SantaGenUsers').select('*');

    if (roomCode) {
      query = query.eq('room_code', roomCode);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ users: data }, { status: 200 });
  } catch (error) {
    console.error('Server error:', error);
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
