'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  ArrowLeft,
  Heart,
  MapPin,
  Calendar,
  Ruler,
  Zap,
  Users,
  PawPrint,
  Mail,
  Phone,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatAge, capitalize } from '@/lib/utils';

// Demo pet data (replace with real data from Supabase)
const demoPets = {
  '1': {
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
    description:
      'Meet Buddy! This friendly and playful Golden Retriever is looking for an active family to call his own. Buddy loves playing fetch, going on long walks, and cuddling on the couch after a fun day. He is well-trained and knows basic commands. Buddy would thrive in a home with a yard where he can run and play.',
    city: 'Vancouver',
    province: 'BC',
    photos: [
      'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=800&h=600&fit=crop',
    ],
    updated_at: new Date().toISOString(),
    shelter: {
      id: 's1',
      owner_user_id: 'u1',
      name: 'Vancouver Animal Rescue',
      email: 'adopt@vanrescue.ca',
      phone: '(604) 555-0123',
      address: '123 Main Street',
      city: 'Vancouver',
      province: 'BC',
      website_url: 'https://vanrescue.ca',
    },
  },
  '2': {
    id: '2',
    shelter_id: 's1',
    name: 'Luna',
    species: 'cat',
    breed: 'Domestic Shorthair',
    age_years: 1,
    size: 'small',
    sex: 'female',
    energy_level: 'medium',
    good_with_kids: true,
    good_with_pets: false,
    description:
      'Luna is a sweet and affectionate cat who loves sunny windowsills and gentle pets. She would do best as the only pet in the home where she can be the center of attention.',
    city: 'Surrey',
    province: 'BC',
    photos: [
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&h=600&fit=crop',
    ],
    updated_at: new Date().toISOString(),
    shelter: {
      id: 's1',
      owner_user_id: 'u1',
      name: 'Vancouver Animal Rescue',
      email: 'adopt@vanrescue.ca',
      phone: '(604) 555-0123',
      address: '123 Main Street',
      city: 'Vancouver',
      province: 'BC',
      website_url: 'https://vanrescue.ca',
    },
  },
  '3': {
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
    description:
      'Max is a calm and well-trained lab mix who gets along with everyone. He is perfect for families or first-time dog owners.',
    city: 'Burnaby',
    province: 'BC',
    photos: [
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=600&fit=crop',
    ],
    updated_at: new Date().toISOString(),
    shelter: {
      id: 's2',
      owner_user_id: 'u2',
      name: 'Burnaby SPCA',
      email: 'info@burnabypca.ca',
      phone: '(604) 555-0456',
      address: '456 Oak Avenue',
      city: 'Burnaby',
      province: 'BC',
    },
  },
};

export default function PetDetailPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const pet = demoPets[id];

  if (!pet) {
    return (
      <main className="flex min-h-dvh items-center justify-center">
        <div className="text-center">
          <h1 className="mb-2 text-xl font-bold">Pet not found</h1>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </main>
    );
  }

  const handleInquire = () => {
    // TODO: Open inquiry form or send to Supabase
    window.location.href = `mailto:${pet.shelter.email}?subject=Adoption Inquiry for ${pet.name}&body=Hi, I am interested in adopting ${pet.name}. Please let me know the next steps.`;
  };

  return (
    <main className="min-h-dvh pb-24">
      {/* Image Gallery */}
      <div className="relative">
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={pet.photos[0]}
            alt={pet.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="absolute left-4 top-4 rounded-full bg-white/80 p-2 backdrop-blur-sm transition hover:bg-white"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        {/* Favorite button */}
        <button
          className="absolute right-4 top-4 rounded-full bg-white/80 p-2 backdrop-blur-sm transition hover:bg-white"
          aria-label="Add to favorites"
        >
          <Heart className="h-5 w-5" />
        </button>
      </div>

      {/* Pet Info */}
      <div className="px-4 py-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{pet.name}</h1>
            <p className="text-gray-600">{pet.breed}</p>
          </div>
          <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700">
            {capitalize(pet.species)}
          </span>
        </div>

        {/* Location */}
        <div className="mb-4 flex items-center text-gray-600">
          <MapPin className="mr-2 h-4 w-4" />
          <span>
            {pet.city}, {pet.province}
          </span>
        </div>

        {/* Quick Info Grid */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
            <Calendar className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-xs text-gray-500">Age</p>
              <p className="font-medium">{formatAge(pet.age_years)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
            <Ruler className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-xs text-gray-500">Size</p>
              <p className="font-medium">{capitalize(pet.size)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
            <Zap className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-xs text-gray-500">Energy</p>
              <p className="font-medium">{capitalize(pet.energy_level)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
            <PawPrint className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-xs text-gray-500">Sex</p>
              <p className="font-medium">{capitalize(pet.sex)}</p>
            </div>
          </div>
        </div>

        {/* Compatibility */}
        <div className="mb-6">
          <h2 className="mb-3 font-semibold text-gray-900">Compatibility</h2>
          <div className="flex flex-wrap gap-2">
            <span
              className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm ${
                pet.good_with_kids
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              <Users className="h-4 w-4" />
              {pet.good_with_kids ? 'Good with kids' : 'Not ideal with kids'}
            </span>
            <span
              className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm ${
                pet.good_with_pets
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              <PawPrint className="h-4 w-4" />
              {pet.good_with_pets ? 'Good with pets' : 'Prefers to be only pet'}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h2 className="mb-3 font-semibold text-gray-900">About {pet.name}</h2>
          <p className="leading-relaxed text-gray-600">{pet.description}</p>
        </div>

        {/* Shelter Info */}
        <div className="rounded-xl bg-gray-50 p-4">
          <h2 className="mb-3 font-semibold text-gray-900">Shelter Information</h2>
          <p className="mb-2 font-medium">{pet.shelter.name}</p>
          <p className="mb-1 text-sm text-gray-600">
            {pet.shelter.address}, {pet.shelter.city}, {pet.shelter.province}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href={`mailto:${pet.shelter.email}`}
              className="flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm text-gray-700 shadow-sm"
            >
              <Mail className="h-4 w-4" />
              Email
            </a>
            <a
              href={`tel:${pet.shelter.phone}`}
              className="flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm text-gray-700 shadow-sm"
            >
              <Phone className="h-4 w-4" />
              Call
            </a>
            {pet.shelter.website_url && (
              <a
                href={pet.shelter.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm text-gray-700 shadow-sm"
              >
                <ExternalLink className="h-4 w-4" />
                Website
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-4 pb-safe">
        <Button onClick={handleInquire} className="w-full" size="lg">
          <Mail className="mr-2 h-5 w-5" />
          Inquire About {pet.name}
        </Button>
      </div>
    </main>
  );
}
