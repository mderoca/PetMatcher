'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Settings, LogOut, ChevronRight, Heart, Bell } from 'lucide-react';
import { BottomNav } from '@/components/layout/bottom-nav';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (authUser) {
        setUser({
          email: authUser.email || '',
          name: authUser.user_metadata?.name || 'Pet Lover',
        });
      }
      setLoading(false);
    };

    getUser();
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const menuItems = [
    {
      icon: User,
      label: 'Edit Profile',
      href: '/profile/edit',
      description: 'Update your personal information',
    },
    {
      icon: Heart,
      label: 'Preferences',
      href: '/profile/preferences',
      description: 'Manage your pet preferences',
    },
    {
      icon: Bell,
      label: 'Notifications',
      href: '/profile/notifications',
      description: 'Configure notification settings',
    },
    {
      icon: Settings,
      label: 'Settings',
      href: '/profile/settings',
      description: 'App settings and preferences',
    },
  ];

  if (loading) {
    return (
      <main className="flex min-h-dvh items-center justify-center pb-20">
        <div className="animate-pulse text-gray-400">Loading...</div>
        <BottomNav />
      </main>
    );
  }

  return (
    <main className="min-h-dvh pb-20">
      {/* Header */}
      <header className="bg-gradient-to-br from-orange-400 to-orange-500 px-4 pb-8 pt-6 text-white">
        <h1 className="mb-4 text-xl font-bold">Profile</h1>

        {/* User Info */}
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
            <User className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">{user?.name || 'Guest'}</h2>
            <p className="text-sm opacity-90">{user?.email || 'Not logged in'}</p>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="-mt-4 mx-4 grid grid-cols-3 gap-3 rounded-xl bg-white p-4 shadow-md">
        <div className="text-center">
          <p className="text-2xl font-bold text-orange-500">24</p>
          <p className="text-xs text-gray-500">Pets Viewed</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-500">8</p>
          <p className="text-xs text-gray-500">Favorites</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-500">2</p>
          <p className="text-xs text-gray-500">Inquiries</p>
        </div>
      </div>

      {/* Menu Items */}
      <div className="mt-6 px-4">
        <div className="overflow-hidden rounded-xl bg-white shadow-md">
          {menuItems.map((item, index) => (
            <button
              key={item.label}
              onClick={() => router.push(item.href)}
              className={`flex w-full items-center gap-4 px-4 py-3 text-left transition hover:bg-gray-50 ${
                index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                <item.icon className="h-5 w-5 text-orange-500" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Logout Button */}
      {user && (
        <div className="mt-6 px-4">
          <Button
            variant="outline"
            className="w-full border-red-200 text-red-500 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
        </div>
      )}

      {/* Version */}
      <p className="mt-6 text-center text-xs text-gray-400">
        PetMatcher v1.0.0
      </p>

      <BottomNav />
    </main>
  );
}
