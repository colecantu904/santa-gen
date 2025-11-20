import { supabaseAdmin } from '@/lib/supabase';
import { Resend } from 'resend';
import { EmailTemplate } from '@/components/email-template';
import React from 'react';
import { NextRequest } from 'next/server';

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
        { error: 'Room code and secret are required' },
        { status: 400 }
      );
    }

    const { data: users, error } = await supabaseAdmin
      .from('SantaGenUsers')
      .select('*')
      .eq('room_code', roomCode)
      .eq('room_secret', roomSecret);

    if (error) {
      console.error('Supabase error:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    if (!users || users.length === 0) {
      return Response.json(
        { error: 'Invalid room code or secret' },
        { status: 404 }
      );
    }

    if (users.length < 2) {
      return Response.json(
        { error: 'Need at least 2 people to create Secret Santa pairings' },
        { status: 400 }
      );
    }

    const pairings = createSecretSantaPairings(users);

    const emailPromises: Promise<any>[] = [];

    pairings.forEach((receiver, giver) => {
      const emailPromise = resend.emails.send({
        from: 'Secret Santa <onboarding@resend.dev>',
        to: [giver.email],
        subject: `🎅 Your Secret Santa Assignment!`,
        react: React.createElement(
          'div',
          {
            style: {
              fontFamily: 'Arial, sans-serif',
              maxWidth: '600px',
              margin: '0 auto',
              padding: '40px 20px',
              backgroundColor: '#f8f9fa'
            }
          },
          [
            React.createElement(
              'div',
              {
                key: 'container',
                style: {
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  padding: '40px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }
              },
              [
                React.createElement(
                  'h1',
                  {
                    key: 'greeting',
                    style: {
                      color: '#c41e3a',
                      fontSize: '32px',
                      marginBottom: '20px',
                      textAlign: 'center'
                    }
                  },
                  `🎄 Ho Ho Ho, ${giver.first_name}! 🎄`
                ),
                React.createElement(
                  'p',
                  {
                    key: 'intro',
                    style: {
                      fontSize: '18px',
                      color: '#333',
                      textAlign: 'center',
                      marginBottom: '30px'
                    }
                  },
                  `You've been selected as the Secret Santa for:`
                ),
                React.createElement(
                  'div',
                  {
                    key: 'name-box',
                    style: {
                      backgroundColor: '#165e3f',
                      color: '#ffffff',
                      padding: '25px',
                      borderRadius: '8px',
                      textAlign: 'center',
                      marginBottom: '30px'
                    }
                  },
                  React.createElement(
                    'h2',
                    {
                      style: {
                        fontSize: '28px',
                        margin: '0',
                        fontWeight: 'bold'
                      }
                    },
                    `${receiver.first_name} ${receiver.last_name}`
                  )
                ),
                React.createElement(
                  'div',
                  {
                    key: 'preferences-section',
                    style: {
                      backgroundColor: '#fff9e6',
                      border: '2px dashed #c41e3a',
                      borderRadius: '8px',
                      padding: '20px',
                      marginBottom: '30px'
                    }
                  },
                  [
                    React.createElement(
                      'h3',
                      {
                        key: 'pref-title',
                        style: {
                          color: '#c41e3a',
                          fontSize: '20px',
                          marginTop: '0',
                          marginBottom: '15px'
                        }
                      },
                      '🎁 Their Wish List:'
                    ),
                    React.createElement(
                      'p',
                      {
                        key: 'preferences',
                        style: {
                          fontSize: '16px',
                          color: '#333',
                          lineHeight: '1.6',
                          margin: '0'
                        }
                      },
                      receiver.preferences
                    )
                  ]
                ),
                React.createElement(
                  'div',
                  {
                    key: 'reminder',
                    style: {
                      backgroundColor: '#f0f0f0',
                      borderLeft: '4px solid #c41e3a',
                      padding: '15px 20px',
                      marginTop: '25px',
                      borderRadius: '4px'
                    }
                  },
                  React.createElement(
                    'p',
                    {
                      style: {
                        margin: '0',
                        fontSize: '14px',
                        color: '#666',
                        fontStyle: 'italic'
                      }
                    },
                    '🤫 Remember: This is a secret! Keep your assignment confidential and spread the holiday cheer!'
                  )
                )
              ]
            )
          ]
        )
      });
      emailPromises.push(emailPromise);
    });

    const results = await Promise.allSettled(emailPromises);

    const failed = results.filter((r) => r.status === 'rejected');
    const succeeded = results.filter((r) => r.status === 'fulfilled');

    if (failed.length > 0) {
      console.error('Some emails failed to send:', failed);
    }

    return Response.json(
      {
        success: true,
        message: `Secret Santa assignments sent! ${
          succeeded.length
        } emails sent successfully${
          failed.length > 0 ? `, ${failed.length} failed` : ''
        }.`,
        stats: {
          total: users.length,
          sent: succeeded.length,
          failed: failed.length
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Server error:', error);
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
