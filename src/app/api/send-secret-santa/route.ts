import { supabaseAdmin } from "@/lib/supabase";
import { Resend } from "resend";
import { SendEmailTemplate } from "@/components/send-email-template";
import React from "react";
import { NextRequest } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  preferences: string;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function createSecretSantaPairings(users: User[]): Map<User, User> {
  const shuffled = shuffleArray(users);
  const pairings = new Map<User, User>();

  for (let i = 0; i < shuffled.length; i++) {
    const giver = shuffled[i];
    const receiver = shuffled[(i + 1) % shuffled.length];
    pairings.set(giver, receiver);
  }

  return pairings;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roomCode, roomSecret } = body;

    if (!roomCode || !roomSecret) {
      return Response.json(
        { error: "Room code and secret are required" },
        { status: 400 }
      );
    }

    const { data: users, error } = await supabaseAdmin
      .from("SantaGenUsers")
      .select("*")
      .eq("room_code", roomCode)
      .eq("room_secret", roomSecret);

    if (error) {
      console.error("Supabase error:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    if (!users || users.length === 0) {
      return Response.json(
        { error: "Invalid room code or secret" },
        { status: 404 }
      );
    }

    if (users.length < 2) {
      return Response.json(
        { error: "Need at least 2 people to create Secret Santa pairings" },
        { status: 400 }
      );
    }

    const pairings = createSecretSantaPairings(users);

    const emailPromises: Promise<any>[] = [];

    pairings.forEach((receiver, giver) => {
      const emailPromise = resend.emails.send({
        from: "Secret Santa <onboarding@resend.dev>",
        to: [giver.email],
        subject: `🎅 Your Secret Santa Assignment!`,
        react: React.createElement(SendEmailTemplate, {
          giverFirstName: giver.first_name,
          receiverFirstName: receiver.first_name,
          receiverLastName: receiver.last_name,
          preferences: receiver.preferences,
        }),
      });
      emailPromises.push(emailPromise);
    });

    const results = await Promise.allSettled(emailPromises);

    const failed = results.filter((r) => r.status === "rejected");
    const succeeded = results.filter((r) => r.status === "fulfilled");

    if (failed.length > 0) {
      console.error("Some emails failed to send:", failed);
    }

    return Response.json(
      {
        success: true,
        message: `Secret Santa assignments sent! ${
          succeeded.length
        } emails sent successfully${
          failed.length > 0 ? `, ${failed.length} failed` : ""
        }.`,
        stats: {
          total: users.length,
          sent: succeeded.length,
          failed: failed.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Server error:", error);
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
