'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className='fixed top-0 left-0 right-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          <Link
            href='/'
            className='text-xl font-bold text-red-600 hover:text-red-700 transition-colors'
          >
            🎅 Santa Gen
          </Link>

          <div className='flex items-center gap-2 sm:gap-6'>
            <Link
              href='/create'
              className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/create')
                  ? 'bg-red-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Create
            </Link>
            <Link
              href='/join'
              className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/join')
                  ? 'bg-red-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Join
            </Link>
            <Link
              href='/manage'
              className={`px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/manage')
                  ? 'bg-red-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Manage
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
