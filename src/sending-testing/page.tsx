'use client';

import Image from 'next/image';

export default function Home() {
  const handleSendEmail = async () => {
    try {
      const response = await fetch('/api/send', {
        method: 'POST'
      });
      const data = await response.json();
      console.log('Response:', data);
      if (response.ok) {
        alert('Email sent successfully!');
      } else {
        alert('Failed to send email: ' + JSON.stringify(data.error));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error sending email');
    }
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black'>
      <p>Hello, this is gonna be santa-gen in a bit!</p>
      <button
        className='bg-gray-500 p-4 m-2 rounded-lg'
        onClick={handleSendEmail}
      >
        Click me
      </button>
    </div>
  );
}
