import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      roomCode,
      roomSecret,
      roomPass,
      firstName,
      lastName,
      email,
      preferences
    } = body;

    // Validate required fields
    if (
      !roomCode ||
      !roomSecret ||
      !roomPass ||
      !firstName ||
      !lastName ||
      !email ||
      !preferences
    ) {
      return Response.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('SantaGenUsers')
      .insert([
        {
          room_code: roomCode,
          room_secret: roomSecret,
          room_pass: roomPass,
          first_name: firstName,
          last_name: lastName,
          email: email,
          preferences: preferences
        }
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true, user: data[0] }, { status: 201 });
  } catch (error) {
    console.error('Server error:', error);
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
