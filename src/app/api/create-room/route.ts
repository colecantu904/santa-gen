import { supabaseAdmin } from "@/lib/supabase";
import { NextRequest } from "next/server";
import { Resend } from "resend";
import { CreateEmailTemplate } from "@/components/create-email-template";
import React from "react";

const resend = new Resend(process.env.RESEND_API_KEY);

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
      preferences,
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
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("SantaGenUsers")
      .insert([
        {
          room_code: roomCode,
          room_secret: roomSecret,
          room_pass: roomPass,
          first_name: firstName,
          last_name: lastName,
          email: email,
          preferences: preferences,
        },
      ])
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    // Send confirmation email
    try {
      await resend.emails.send({
        from: "Santa Gen <onboarding@resend.dev>",
        to: email,
        subject: "Welcome to Secret Santa - Room Created!",
        react: React.createElement(CreateEmailTemplate, {
          firstName,
          roomCode,
          roomPass,
        }),
      });
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      // Don't fail the request if email fails, but log it
    }

    return Response.json({ success: true, user: data[0] }, { status: 201 });
  } catch (error) {
    console.error("Server error:", error);
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
