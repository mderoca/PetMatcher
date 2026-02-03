'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Trash2, MapPin } from 'lucide-react';
import { BottomNav } from '@/components/layout/bottom-nav';
import { Button } from '@/components/ui/button';
import { Pet } from '@/types/database';
import { formatAge, capitalize } from '@/lib/utils';

// Demo favorites (replace with real data from Supabase)
const demoFavorites: Pet[] = [
  {
    id: '1',
    shelter_id: 's1',
    name: 'Buddy',
    species: 'dog',
    breed: 'Golden Retriever',
    age_years: 2,
    size: 'large',
    sex: 'male',
    energy_level: 'high',
    good_with_kids: true,
    good_with_pets: true,
    description: 'Friendly and playful golden retriever.',
    city: 'Vancouver',
    province: 'BC',
    photos: ['https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=600&fit=crop'],
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    shelter_id: 's2',
    name: 'Max',
    species: 'dog',
    breed: 'Labrador Mix',
    age_years: 3,
    size: 'medium',
    sex: 'male',
    energy_level: 'medium',
    good_with_kids: true,
    good_with_pets: true,
    description: 'Calm and well-trained lab mix.',
    city: 'Burnaby',
    province: 'BC',
    photos: ['https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=600&fit=crop'],
    updated_at: new Date().toISOString(),
  },
];

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Pet[]>(demoFavorites);

  const handleRemove = (petId: string) => {
    setFavorites((prev) => prev.filter((p) => p.id !== petId));
    // TODO: Remove from Supabase
  };

  return (
    <main className="min-h-dvh pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white px-4 py-3">
        <h1 className="text-xl font-bold">
          <Heart className="mr-2 inline-block h-5 w-5 text-orange-500" fill="currentColor" />
          Favorites
        </h1>
        <p className="text-sm text-gray-500">{favorites.length} pets saved</p>
      </header>

      {/* Favorites List */}
      <div className="p-4">
        {favorites.length === 0 ? (
          <div className="py-12 text-center">
            <Heart className="mx-auto mb-4 h-16 w-16 text-gray-300" />
            <h2 className="mb-2 text-lg font-semibold text-gray-700">
              No favorites yet
            </h2>
            <p className="mb-4 text-gray-500">
              Start swiping to find pets you love!
            </p>
            <Link href="/browse">
              <Button>Browse Pets</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {favorites.map((pet) => (
              <div
                key={pet.id}
                className="flex overflow-hidden rounded-xl bg-white shadow-md"
              >
                {/* Pet Image */}
                <Link href={`/pet/${pet.id}`} className="relative h-32 w-32 flex-shrink-0">
                  <Image
                    src={pet.photos[0]}
                    alt={pet.name}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </Link>

                {/* Pet Info */}
                <div className="flex flex-1 flex-col justify-between p-3">
                  <div>
                    <Link href={`/pet/${pet.id}`}>
                      <h3 className="font-semibold text-gray-900 hover:text-orange-500">
                        {pet.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-600">
                      {pet.breed} · {formatAge(pet.age_years)} · {capitalize(pet.size)}
                    </p>
                    <p className="mt-1 flex items-center text-xs text-gray-500">
                      <MapPin className="mr-1 h-3 w-3" />
                      {pet.city}, {pet.province}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link href={`/pet/${pet.id}`} className="flex-1">
                      <Button variant="secondary" size="sm" className="w-full">
                        View Details
                      </Button>
                    </Link>
                    <button
                      onClick={() => handleRemove(pet.id)}
                      className="rounded-lg border border-red-200 p-2 text-red-400 transition hover:bg-red-50 hover:text-red-500"
                      aria-label="Remove from favorites"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  );
}
