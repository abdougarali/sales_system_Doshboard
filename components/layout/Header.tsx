'use client';

import { useRouter } from 'next/navigation';
import { Bars3Icon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import Button from '@/components/ui/Button';

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        {/* Left side */}
        <div className="flex items-center">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 -ml-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
          
          <h1 className="ml-2 md:ml-0 text-lg font-semibold text-gray-900">
            Admin Dashboard
          </h1>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleLogout}
            className="hidden sm:flex"
          >
            <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
            Logout
          </Button>
          
          {/* Mobile logout button */}
          <button
            onClick={handleLogout}
            className="sm:hidden p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
