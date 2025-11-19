import { Resend } from 'resend';
import { EmailTemplate } from '@/components/email-template';
import React from 'react';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ['kolbe.mosher@gmail.com'],
      subject: 'Hello world',
      react: React.createElement(EmailTemplate, { firstName: 'Kolbe' })
    });

    if (error) {
      console.error('Resend API error:', error);
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    console.error('Server error:', error);
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
