'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Create() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    roomSecret: '',
    roomPass: '',
    email: '',
    preferences: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchRoomCode() {
      try {
        const response = await fetch('/api/generate-room-code');
        const data = await response.json();
        if (response.ok) {
          setRoomCode(data.roomCode);
        } else {
          console.error('Error:', data.error);
        }
      } catch (error) {
        console.error('Error fetching room code:', error);
      }
    }
    fetchRoomCode();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/create-room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          roomCode,
          roomSecret: formData.roomSecret,
          roomPass: formData.roomPass,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          preferences: formData.preferences
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Room created successfully!');
        router.push('/');
      } else {
        alert('Failed to create room: ' + data.error);
      }
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Error creating room');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex w-full justify-center items-center flex-col p-4'>
      <div className='flex w-full justify-center items-center flex-col mt-10'>
        <h1 className='text-2xl font-bold'>Room Code:</h1>
        <h1 className='text-3xl font-mono'>{roomCode || 'Loading...'}</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className='flex w-full max-w-md justify-center items-center flex-col gap-4 mt-10'
      >
        <div className='w-full'>
          <label className='block mb-1'>First Name</label>
          <input
            type='text'
            name='firstName'
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder='Enter first name'
            className='border border-white text-white bg-transparent p-2 w-full'
            required
          />
        </div>

        <div className='w-full'>
          <label className='block mb-1'>Last Name</label>
          <input
            type='text'
            name='lastName'
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder='Enter last name'
            className='border border-white text-white bg-transparent p-2 w-full'
            required
          />
        </div>

        <div className='w-full'>
          <label className='block mb-1'>Email</label>
          <input
            type='email'
            name='email'
            value={formData.email}
            onChange={handleInputChange}
            placeholder='Enter email'
            className='border border-white text-white bg-transparent p-2 w-full'
            required
          />
        </div>

        <div className='w-full'>
          <label className='block mb-1'>
            Room Secret (Remember this to manage your room; keep it safe)
          </label>
          <input
            type='text'
            name='roomSecret'
            value={formData.roomSecret}
            onChange={handleInputChange}
            placeholder='Enter room secret'
            className='border border-white text-white bg-transparent p-2 w-full'
            required
          />
        </div>

        <div className='w-full'>
          <label className='block mb-1'>
            Room Password (Share this with your friends)
          </label>
          <input
            type='text'
            name='roomPass'
            value={formData.roomPass}
            onChange={handleInputChange}
            placeholder='Enter room password'
            className='border border-white text-white bg-transparent p-2 w-full'
            required
          />
        </div>

        <div className='w-full'>
          <label className='block mb-1'>
            Preferences (These will be sent to your secret Santa)
          </label>
          <textarea
            name='preferences'
            value={formData.preferences}
            onChange={handleInputChange}
            placeholder='Enter your preferences'
            className='border border-white text-white bg-transparent p-2 w-full h-24'
            required
          />
        </div>

        <button
          type='submit'
          disabled={isSubmitting || !roomCode}
          className='bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg mt-4 w-full'
        >
          {isSubmitting ? 'Creating Room...' : 'Create Room'}
        </button>
      </form>
    </div>
  );
}
