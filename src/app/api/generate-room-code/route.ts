import { generateUniqueRoomCode } from '@/lib/generateRoomCode';

export async function GET() {
  try {
    const roomCode = await generateUniqueRoomCode();
    return Response.json({ roomCode }, { status: 200 });
  } catch (error) {
    console.error('Error generating room code:', error);
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
