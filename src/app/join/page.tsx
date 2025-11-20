'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Join() {
  const router = useRouter();
  const [step, setStep] = useState<'validate' | 'form'>('validate');
  const [roomCode, setRoomCode] = useState('');
  const [roomPass, setRoomPass] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    preferences: ''
  });
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleValidateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsValidating(true);

    try {
      const response = await fetch('/api/validate-room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          roomCode,
          roomPass
        })
      });

      const data = await response.json();

      if (response.ok) {
        setStep('form');
      } else {
        alert('Invalid room code or password: ' + data.error);
      }
    } catch (error) {
      console.error('Error validating room:', error);
      alert('Error validating room');
    } finally {
      setIsValidating(false);
    }
  };

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
      const response = await fetch('/api/join-room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          roomCode,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          preferences: formData.preferences
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Successfully joined room!');
        router.push('/');
      } else {
        alert('Failed to join room: ' + data.error);
      }
    } catch (error) {
      console.error('Error joining room:', error);
      alert('Error joining room');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 'validate') {
    return (
      <div className='flex w-full justify-center items-center flex-col p-4 min-h-screen'>
        <div className='flex w-full max-w-md justify-center items-center flex-col mt-10'>
          <h1 className='text-3xl font-bold mb-8'>Join Room</h1>

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
              <label className='block mb-1'>Room Password</label>
              <input
                type='password'
                value={roomPass}
                onChange={(e) => setRoomPass(e.target.value)}
                placeholder='Enter room password'
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
    <div className='flex w-full justify-center items-center flex-col p-4'>
      <div className='flex w-full justify-center items-center flex-col mt-10'>
        <h1 className='text-2xl font-bold'>Joining Room:</h1>
        <h1 className='text-3xl font-mono'>{roomCode}</h1>
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
          <label className='block mb-1'>Preferences</label>
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
          disabled={isSubmitting}
          className='bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg mt-4 w-full'
        >
          {isSubmitting ? 'Joining Room...' : 'Join Room'}
        </button>
      </form>
    </div>
  );
}
