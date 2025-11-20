import Link from 'next/link';

export default function Home() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center px-4'>
      <div className='text-center space-y-8 max-w-3xl'>
        <div className='space-y-4'>
          <h1 className='text-5xl sm:text-6xl font-bold text-red-600'>
            🎄 Santa Gen
          </h1>
          <p className='text-xl sm:text-2xl text-gray-600 dark:text-gray-400'>
            Organize your perfect Secret Santa gift exchange
          </p>
        </div>

        <div className='flex flex-col sm:flex-row gap-4 justify-center pt-8'>
          <div className='text-center space-y-2'>
            <p className='text-sm text-gray-500 dark:text-gray-500'>
              Start a new group
            </p>
            <Link
              href='/create'
              className='block px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl'
            >
              Create Group
            </Link>
          </div>

          <div className='text-center space-y-2'>
            <p className='text-sm text-gray-500 dark:text-gray-500'>
              Have a room code?
            </p>
            <Link
              href='/join'
              className='block px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl'
            >
              Join Group
            </Link>
          </div>

          <div className='text-center space-y-2'>
            <p className='text-sm text-gray-500 dark:text-gray-500'>
              Admin access
            </p>
            <Link
              href='/manage'
              className='block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl'
            >
              Manage Group
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
