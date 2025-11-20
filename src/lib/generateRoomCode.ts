import { supabase } from './supabase';

/**
 * Generates a unique 6-character room code (A-Z, 0-9)
 * Ensures the code doesn't already exist in the database
 */
export async function generateUniqueRoomCode(): Promise<string> {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const codeLength = 6;
  let roomCode = '';
  let isUnique = false;

  while (!isUnique) {
    roomCode = '';
    for (let i = 0; i < codeLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      roomCode += characters[randomIndex];
    }

    const { data, error } = await supabase
      .from('SantaGenUsers')
      .select('room_code')
      .eq('room_code', roomCode)
      .limit(1);

    if (error) {
      throw new Error(`Failed to check room code: ${error.message}`);
    }

    isUnique = !data || data.length === 0;
  }

  return roomCode;
}
