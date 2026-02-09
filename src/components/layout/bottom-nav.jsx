'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Heart, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/browse', icon: Home, label: 'Browse' },
  { href: '/favorites', icon: Heart, label: 'Favorites' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white pb-safe">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-1 px-4 py-2 transition-colors',
                isActive
                  ? 'text-orange-500'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
