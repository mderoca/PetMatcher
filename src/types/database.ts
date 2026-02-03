// Database types matching the PetMatcher data model from the report

export type UserRole = 'adopter' | 'shelter';

export type ActivityLevel = 'low' | 'medium' | 'high';

export type PetSize = 'small' | 'medium' | 'large';

export type PetSpecies = 'dog' | 'cat' | 'rabbit' | 'other';

export type InteractionType = 'like' | 'skip' | 'favourite';

export type InquiryStatus = 'pending' | 'read' | 'responded';

// User/Profile entity
export interface Profile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  has_children: boolean;
  has_other_pets: boolean;
  activity_level: ActivityLevel;
  preferred_distance_km: number;
  preferred_pet_types: PetSpecies[];
  created_at: string;
}

// Shelter entity
export interface Shelter {
  id: string;
  owner_user_id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  website_url?: string;
}

// Pet entity
export interface Pet {
  id: string;
  shelter_id: string;
  name: string;
  species: PetSpecies;
  breed: string;
  age_years: number;
  size: PetSize;
  sex: 'male' | 'female';
  energy_level: ActivityLevel;
  good_with_kids: boolean;
  good_with_pets: boolean;
  description: string;
  city: string;
  province: string;
  photos: string[];
  updated_at: string;
}

// Pet with shelter info for display
export interface PetWithShelter extends Pet {
  shelter: Shelter;
}

// Interaction entity
export interface Interaction {
  id: string;
  user_id: string;
  pet_id: string;
  type: InteractionType;
  created_at: string;
}

// Inquiry entity
export interface Inquiry {
  id: string;
  user_id: string;
  pet_id: string;
  shelter_id: string;
  message?: string;
  status: InquiryStatus;
  created_at: string;
}

// Form types for user input
export interface PreferencesFormData {
  has_children: boolean;
  has_other_pets: boolean;
  activity_level: ActivityLevel;
  preferred_distance_km: number;
  preferred_pet_types: PetSpecies[];
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
}
