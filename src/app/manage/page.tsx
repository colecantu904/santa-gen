'use client';

import React, { useState } from 'react';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export default function Manage() {
  const [step, setStep] = useState<'validate' | 'manage'>('validate');
  const [roomCode, setRoomCode] = useState('');
  const [roomSecret, setRoomSecret] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [isRemoving, setIsRemoving] = useState<number | null>(null);
  const [isSendingEmails, setIsSendingEmails] = useState(false);

  const handleValidateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsValidating(true);

    try {
      const response = await fetch('/api/validate-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          roomCode,
          roomSecret
        })
      });

      const data = await response.json();

      if (response.ok) {
        setUsers(data.users);
        setStep('manage');
      } else {
        alert('Invalid room code or secret: ' + data.error);
      }
    } catch (error) {
      console.error('Error validating room:', error);
      alert('Error validating room');
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveUser = async (userId: number) => {
    if (!confirm('Are you sure you want to remove this user?')) {
      return;
    }

    setIsRemoving(userId);

    try {
      const response = await fetch('/api/remove-user', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          roomCode,
          roomSecret
        })
      });

      const data = await response.json();

      if (response.ok) {
        setUsers(users.filter((user) => user.id !== userId));
        alert('User removed successfully');
      } else {
        alert('Failed to remove user: ' + data.error);
      }
    } catch (error) {
      console.error('Error removing user:', error);
      alert('Error removing user');
    } finally {
      setIsRemoving(null);
    }
  };

  const handleSendSecretSanta = async () => {
    if (
      !confirm(
        `Are you sure you want to send Secret Santa assignments to all ${users.length} members? This will send emails to everyone!`
      )
    ) {
      return;
    }

    setIsSendingEmails(true);

    try {
      const response = await fetch('/api/send-secret-santa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          roomCode,
          roomSecret
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
      } else {
        alert('Failed to send Secret Santa assignments: ' + data.error);
      }
    } catch (error) {
      console.error('Error sending Secret Santa:', error);
      alert('Error sending Secret Santa assignments');
    } finally {
      setIsSendingEmails(false);
    }
  };

  if (step === 'validate') {
    return (
      <div className='flex w-full justify-center items-center flex-col p-4 min-h-screen'>
        <div className='flex w-full max-w-md justify-center items-center flex-col mt-10'>
          <h1 className='text-3xl font-bold mb-8'>Manage Room</h1>

          <form
            onSubmit={handleValidateRoom}
            className='flex w-full justify-center items-center flex-col gap-4'
          >
            <div className='w-full'>
              <label className='block mb-1'>Room Code</label>
              <input
                type='text'
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder='Enter room code'
                className='border border-white text-white bg-transparent p-2 w-full uppercase'
                maxLength={6}
                required
              />
            </div>

            <div className='w-full'>
              <label className='block mb-1'>Room Secret</label>
              <input
                type='password'
                value={roomSecret}
                onChange={(e) => setRoomSecret(e.target.value)}
                placeholder='Enter room secret'
                className='border border-white text-white bg-transparent p-2 w-full'
                required
              />
            </div>

            <button
              type='submit'
              disabled={isValidating}
              className='bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg mt-4 w-full'
            >
              {isValidating ? 'Validating...' : 'Continue'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className='flex w-full justify-center items-center flex-col p-4 min-h-screen'>
      <div className='flex w-full max-w-4xl justify-center items-center flex-col mt-10'>
        <h1 className='text-3xl font-bold mb-2'>Managing Room</h1>
        <h2 className='text-xl font-mono mb-8'>{roomCode}</h2>

        <div className='w-full'>
          <h3 className='text-xl font-semibold mb-4'>
            Room Members ({users.length})
          </h3>

          {users.length === 0 ? (
            <p className='text-gray-400'>No members in this room yet.</p>
          ) : (
            <div className='space-y-3'>
              {users.map((user) => (
                <div
                  key={user.id}
                  className='border border-white p-4 rounded-lg flex justify-between items-center'
                >
                  <div>
                    <p className='font-semibold'>
                      {user.first_name} {user.last_name}
                    </p>
                    <p className='text-gray-400 text-sm'>{user.email}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveUser(user.id)}
                    disabled={isRemoving === user.id}
                    className='bg-red-500 hover:bg-red-600 disabled:bg-gray-500 text-white font-bold py-2 px-4 rounded'
                  >
                    {isRemoving === user.id ? 'Removing...' : 'Remove'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleSendSecretSanta}
          disabled={isSendingEmails || users.length < 2}
          className='bg-green-500 hover:bg-green-600 disabled:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg mt-8 w-full max-w-md'
        >
          {isSendingEmails ? 'Sending Emails...' : 'Send Out Secret Santas 🎅'}
        </button>

        {users.length < 2 && (
          <p className='text-yellow-500 text-sm mt-2'>
            Need at least 2 members to send Secret Santa assignments
          </p>
        )}

        <button
          onClick={() => {
            setStep('validate');
            setUsers([]);
            setRoomCode('');
            setRoomSecret('');
          }}
          className='bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded mt-8'
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}
