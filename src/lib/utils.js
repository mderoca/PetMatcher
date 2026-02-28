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
export function getMatchReasons(pet, preferences, userInteractions, likeCounts) {
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

  // Behavioral tag — only if enough data
  if (userInteractions && userInteractions.length >= 5 && pet._behavioralBonus > 10) {
    reasons.push('Matches your taste');
  }

  // Recency tag
  if (pet._recencyBoost > 5) {
    reasons.push('New arrival');
  }

  // Popularity tag
  if (likeCounts && pet._popularityBoost > 5) {
    reasons.push('Popular pick');
  }

  return reasons;
}

// Calculate behavioral bonus (0-30) based on user's past swipe patterns
export function calculateBehavioralBonus(pet, userInteractions, allPets) {
  if (!userInteractions || userInteractions.length < 5) return 0;

  // Build a map of pet_id -> pet data for liked pets
  const petMap = {};
  for (const p of allPets) {
    petMap[p.id] = p;
  }

  // Count likes per attribute value
  const attrCounts = { species: {}, size: {}, energy_level: {} };
  let totalLikes = 0;

  for (const interaction of userInteractions) {
    if (interaction.type !== 'like') continue;
    const likedPet = petMap[interaction.pet_id];
    if (!likedPet) continue;
    totalLikes++;
    for (const attr of ['species', 'size', 'energy_level']) {
      const val = likedPet[attr];
      attrCounts[attr][val] = (attrCounts[attr][val] || 0) + 1;
    }
  }

  if (totalLikes === 0) return 0;

  // Score this pet: for each attribute, add up to 10 points based on like-rate
  let bonus = 0;
  for (const attr of ['species', 'size', 'energy_level']) {
    const val = pet[attr];
    const count = attrCounts[attr][val] || 0;
    bonus += (count / totalLikes) * 10;
  }

  return Math.min(30, Math.round(bonus * 10) / 10);
}

// Calculate recency boost (0-10): pets listed within 7 days get a linearly decaying bonus
export function calculateRecencyBoost(pet) {
  const now = Date.now();
  const created = new Date(pet.created_at).getTime();
  const ageMs = now - created;
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

  if (ageMs >= sevenDaysMs) return 0;
  return Math.round(((sevenDaysMs - ageMs) / sevenDaysMs) * 10 * 10) / 10;
}

// Calculate popularity boost (0-10): normalized by most-liked pet
export function calculatePopularityBoost(petId, likeCounts, maxLikes) {
  if (!likeCounts || maxLikes === 0) return 0;
  const count = likeCounts[petId] || 0;
  return Math.round((count / maxLikes) * 10 * 10) / 10;
}

// Combine all scoring signals, attach _score metadata, sort descending
export function scoreAndSortPets(pets, preferences, userInteractions, allPets, likeCounts) {
  const maxLikes = likeCounts
    ? Math.max(0, ...Object.values(likeCounts))
    : 0;

  const scored = pets.map((pet) => {
    const baseScore = calculateMatchScore(pet, preferences);
    const behavioralBonus = calculateBehavioralBonus(pet, userInteractions, allPets);
    const recencyBoost = calculateRecencyBoost(pet);
    const popularityBoost = calculatePopularityBoost(pet.id, likeCounts, maxLikes);

    return {
      ...pet,
      _score: baseScore + behavioralBonus + recencyBoost + popularityBoost,
      _baseScore: baseScore,
      _behavioralBonus: behavioralBonus,
      _recencyBoost: recencyBoost,
      _popularityBoost: popularityBoost,
    };
  });

  // Sort descending by score, ties broken by recency (newest first)
  scored.sort((a, b) => {
    if (b._score !== a._score) return b._score - a._score;
    return new Date(b.created_at) - new Date(a.created_at);
  });

  return scored;
}
