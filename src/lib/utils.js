import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility function for merging Tailwind CSS classes
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Format pet age for display
export function formatAge(years) {
  if (years < 1) {
    const months = Math.round(years * 12);
    return `${months} month${months !== 1 ? 's' : ''}`;
  }
  return `${years} year${years !== 1 ? 's' : ''}`;
}

// Capitalize first letter
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Calculate match score based on user preferences and pet attributes
export function calculateMatchScore(pet, preferences) {
  let score = 0;
  const maxScore = 100;

  // Species match (30 points)
  if (preferences.preferred_pet_types.length === 0 ||
      preferences.preferred_pet_types.includes(pet.species)) {
    score += 30;
  }

  // Energy level match (25 points)
  if (pet.energy_level === preferences.activity_level) {
    score += 25;
  } else if (
    (pet.energy_level === 'medium') ||
    (preferences.activity_level === 'medium')
  ) {
    score += 15; // Partial match for medium
  }

  // Good with kids compatibility (25 points)
  if (preferences.has_children) {
    if (pet.good_with_kids) {
      score += 25;
    }
  } else {
    score += 25; // No kids, so this doesn't matter
  }

  // Good with pets compatibility (20 points)
  if (preferences.has_other_pets) {
    if (pet.good_with_pets) {
      score += 20;
    }
  } else {
    score += 20; // No other pets, so this doesn't matter
  }

  return Math.round((score / maxScore) * 100);
}

// Get match reasons for "Why this match?" feature
export function getMatchReasons(pet, preferences) {
  const reasons = [];

  if (pet.energy_level === preferences.activity_level) {
    reasons.push(`${capitalize(pet.energy_level)} energy`);
  }

  if (preferences.has_children && pet.good_with_kids) {
    reasons.push('Good with kids');
  }

  if (preferences.has_other_pets && pet.good_with_pets) {
    reasons.push('Good with other pets');
  }

  return reasons;
}
