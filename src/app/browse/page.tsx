'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, RotateCcw, Info, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BottomNav } from '@/components/layout/bottom-nav';
import { Pet } from '@/types/database';
import { formatAge, capitalize, getMatchReasons } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

// Demo user preferences (replace with real data)
const userPreferences = {
  activity_level: 'medium' as const,
  has_children: true,
  has_other_pets: false,
  preferred_pet_types: ['dog', 'cat'] as const,
};

export default function BrowsePage() {
  const router = useRouter();
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch pets from Supabase
  useEffect(() => {
    async function fetchPets() {
      const supabase = createClient();

      const { data, error: fetchError } = await supabase
        .from('pets')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching pets:', fetchError);
        setError(fetchError.message);
      } else {
        console.log('Fetched pets:', data?.length || 0);
        setPets(data || []);
      }
      setIsLoading(false);
    }

    fetchPets();
  }, []);
  const [lastSwipedPet, setLastSwipedPet] = useState<Pet | null>(null);
  const [likedCount, setLikedCount] = useState(0);
  const [passedCount, setPassedCount] = useState(0);

  const currentPet = pets[currentIndex];

  const handleSwipe = useCallback(
    (direction: 'left' | 'right') => {
      if (!currentPet) return;

      if (direction === 'right') {
        setLikedCount((prev) => prev + 1);
        // TODO: Save to Supabase as favourite
      } else {
        setPassedCount((prev) => prev + 1);
        // TODO: Save to Supabase as skip
      }

      setLastSwipedPet(currentPet);
      setCurrentIndex((prev) => prev + 1);
    },
    [currentPet]
  );

  const handleUndo = useCallback(() => {
    if (currentIndex > 0 && lastSwipedPet) {
      setCurrentIndex((prev) => prev - 1);
      setLastSwipedPet(null);
      // Adjust counts
      if (likedCount > 0) setLikedCount((prev) => prev - 1);
      else if (passedCount > 0) setPassedCount((prev) => prev - 1);
    }
  }, [currentIndex, lastSwipedPet, likedCount, passedCount]);

  const handleViewDetails = useCallback(() => {
    if (currentPet) {
      router.push(`/pet/${currentPet.id}`);
    }
  }, [currentPet, router]);

  const matchReasons = currentPet
    ? getMatchReasons(currentPet, userPreferences)
    : [];

  return (
    <main className="flex min-h-dvh flex-col pb-20">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3">
        <div className="text-sm">
          <span className="rounded-full bg-green-100 px-3 py-1 text-green-700">
            Liked: {likedCount}
          </span>
        </div>
        <h1 className="text-xl font-bold">
          pet<span className="text-orange-500">Matcher</span>
        </h1>
        <div className="text-sm">
          <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-600">
            Passed: {passedCount}
          </span>
        </div>
      </header>

      {/* Swipe Area */}
      <div className="relative flex flex-1 items-center justify-center px-4">
        {isLoading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            <p className="text-gray-600">Loading pets...</p>
          </div>
        ) : (
        <AnimatePresence mode="popLayout">
          {currentPet ? (
            <motion.div
              key={currentPet.id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm"
            >
              {/* Pet Card */}
              <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
                {/* Pet Image */}
                <div
                  className="relative aspect-[3/4] w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${currentPet.photos[0]})` }}
                >
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                  {/* Info button */}
                  <button
                    onClick={handleViewDetails}
                    className="absolute right-4 top-4 rounded-full bg-white/20 p-2 backdrop-blur-sm transition hover:bg-white/30"
                    aria-label="View pet details"
                  >
                    <Info className="h-5 w-5 text-white" />
                  </button>

                  {/* Pet info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h2 className="text-2xl font-bold">{currentPet.name}</h2>
                    <p className="text-sm opacity-90">
                      {currentPet.breed} · {formatAge(currentPet.age_years)} ·{' '}
                      {capitalize(currentPet.size)}
                    </p>
                    <p className="mt-1 text-sm opacity-80">
                      📍 {currentPet.city}, {currentPet.province}
                    </p>
                  </div>
                </div>

                {/* Match reasons */}
                {matchReasons.length > 0 && (
                  <div className="flex flex-wrap gap-2 px-4 py-3">
                    {matchReasons.map((reason) => (
                      <span
                        key={reason}
                        className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700"
                      >
                        {reason}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="text-center">
              {error ? (
                <>
                  <div className="mb-4 text-6xl">⚠️</div>
                  <h2 className="mb-2 text-xl font-bold">Error loading pets</h2>
                  <p className="mb-4 text-gray-600">{error}</p>
                  <Button onClick={() => window.location.reload()}>Try Again</Button>
                </>
              ) : pets.length === 0 ? (
                <>
                  <div className="mb-4 text-6xl">🐾</div>
                  <h2 className="mb-2 text-xl font-bold">No pets available</h2>
                  <p className="mb-4 text-gray-600">
                    There are no pets listed yet. Check back soon!
                  </p>
                </>
              ) : (
                <>
                  <div className="mb-4 text-6xl">🎉</div>
                  <h2 className="mb-2 text-xl font-bold">You&apos;ve seen all pets!</h2>
                  <p className="mb-4 text-gray-600">
                    Check back later for new arrivals.
                  </p>
                  <Button onClick={() => setCurrentIndex(0)}>Start Over</Button>
                </>
              )}
            </div>
          )}
        </AnimatePresence>
        )}
      </div>

      {/* Action Buttons */}
      {currentPet && (
        <div className="flex items-center justify-center gap-4 py-4">
          {/* Undo */}
          <button
            onClick={handleUndo}
            disabled={currentIndex === 0}
            className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-gray-300 text-gray-400 transition hover:border-gray-400 hover:text-gray-500 disabled:opacity-30"
            aria-label="Undo last swipe"
          >
            <RotateCcw className="h-5 w-5" />
          </button>

          {/* Pass */}
          <button
            onClick={() => handleSwipe('left')}
            className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-red-400 text-red-400 transition hover:bg-red-50"
            aria-label="Pass on this pet"
          >
            <X className="h-8 w-8" />
          </button>

          {/* Like */}
          <button
            onClick={() => handleSwipe('right')}
            className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-green-400 text-green-400 transition hover:bg-green-50"
            aria-label="Like this pet"
          >
            <Heart className="h-8 w-8" />
          </button>

          {/* Info */}
          <button
            onClick={handleViewDetails}
            className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-blue-300 text-blue-400 transition hover:border-blue-400 hover:text-blue-500"
            aria-label="View pet details"
          >
            <Info className="h-5 w-5" />
          </button>
        </div>
      )}

      <BottomNav />
    </main>
  );
}
