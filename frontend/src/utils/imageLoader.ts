/**
 * Image loader utility to dynamically load images from folders
 * This creates a list of all images in each folder for dynamic rendering
 */

// Hashira images - dynamically loaded from assets/img/hashiras/
export const hashiraImages = [
  'assets/img/hashiras/Akaza-vs-Rengoku.webp',
  'assets/img/hashiras/demon-slayer-4.jpg',
  'assets/img/hashiras/demon-slayer-5.jpg',
  'assets/img/hashiras/obanai-iguro.jpg',
  'assets/img/hashiras/rengoku-kyojiro.jpg',
  'assets/img/hashiras/sanemi-shinazugawa.jpg',
  'assets/img/hashiras/shinobu-kocho.jpg',
  'assets/img/hashiras/tengen-uzu.jpg'
];

// Demon images - dynamically loaded from assets/img/demons/
export const demonImages = [
  'assets/img/demons/Akaza_and_Kyojuro_exchanging_blows_at_blinding_speeds.webp',
  'assets/img/demons/Akaza-eye-image.jpg',
  'assets/img/demons/Akaza-eye.gif',
  'assets/img/demons/demon-slayer-8.jpg'
];

// Character images - dynamically loaded from assets/img/characters/
// Using absolute paths (starting with /) to work correctly from nested routes like /characters/tanjiro
export const characterImages = [
  '/assets/img/characters/inoske.jpg',
  '/assets/img/characters/nezuko-and-tanjio.jpg',
  '/assets/img/characters/tanjiro-and-nezuko.jpg',
  '/assets/img/characters/tanjiro-infinitycastle.jpg',
  '/assets/img/characters/tanjiro-kamado-and-Love.jpg',
  '/assets/img/characters/tanjiro-kamado-angry.jpg',
  '/assets/img/characters/zenetsu-asthetic.jpg',
  '/assets/img/characters/zenitsu-agatsuma-.jpg',
  '/assets/img/characters/zenitsu-agatsuma-swag.png'
];

// Character information database
export interface CharacterInfo {
  name: string;
  title: string;
  description: string;
  breathingTechnique?: string;
  role?: string;
}

export const characterInfoMap: Record<string, CharacterInfo> = {
  'inoske': {
    name: 'Inosuke Hashibira',
    title: 'Beast Breathing Demon Slayer',
    description: 'A wild and aggressive demon slayer who wears a boar mask. He uses Beast Breathing and dual-wields serrated swords. Despite his rough exterior, he is fiercely loyal to his friends.',
    breathingTechnique: 'Beast Breathing',
    role: 'Demon Slayer Corps Member'
  },
  'nezuko-and-tanjio': {
    name: 'Nezuko & Tanjiro',
    title: 'Kamado Siblings',
    description: 'The inseparable Kamado siblings. Tanjiro fights to turn his demon sister Nezuko back into a human, while Nezuko protects humans despite being a demon herself.',
    breathingTechnique: 'Water Breathing (Tanjiro)',
    role: 'Demon Slayer & Demon'
  },
  'tanjiro-and-nezuko': {
    name: 'Tanjiro & Nezuko',
    title: 'Kamado Siblings',
    description: 'Brother and sister bound by love and determination. Tanjiro\'s unwavering resolve to save Nezuko drives him to become one of the strongest demon slayers.',
    breathingTechnique: 'Water Breathing, Sun Breathing (Tanjiro)',
    role: 'Demon Slayer & Demon'
  },
  'tanjiro-infinitycastle': {
    name: 'Tanjiro Kamado',
    title: 'Water Breathing Master',
    description: 'The main protagonist who fights with incredible determination and compassion. He mastered Water Breathing and later learned Sun Breathing, the original breathing technique.',
    breathingTechnique: 'Water Breathing, Sun Breathing',
    role: 'Demon Slayer Corps Member'
  },
  'tanjiro-kamado-and-love': {
    name: 'Tanjiro Kamado',
    title: 'Compassionate Demon Slayer',
    description: 'Tanjiro\'s kind heart and love for his family drives him to protect both humans and demons. His unique ability to sense emotions makes him a formidable opponent.',
    breathingTechnique: 'Water Breathing, Sun Breathing',
    role: 'Demon Slayer Corps Member'
  },
  'tanjiro-kamado-angry': {
    name: 'Tanjiro Kamado',
    title: 'Fierce Demon Slayer',
    description: 'When his loved ones are threatened, Tanjiro\'s rage knows no bounds. His anger fuels his determination to defeat even the strongest demons.',
    breathingTechnique: 'Water Breathing, Sun Breathing',
    role: 'Demon Slayer Corps Member'
  },
  'zenetsu-asthetic': {
    name: 'Zenitsu Agatsuma',
    title: 'Thunder Breathing User',
    description: 'A cowardly demon slayer who becomes incredibly powerful when unconscious. He masters Thunder Breathing and can move at lightning speed.',
    breathingTechnique: 'Thunder Breathing',
    role: 'Demon Slayer Corps Member'
  },
  'zenitsu-agatsuma': {
    name: 'Zenitsu Agatsuma',
    title: 'Thunder Breathing Master',
    description: 'Despite his constant fear and crying, Zenitsu is one of the most skilled demon slayers. His Thunder Breathing technique is devastatingly fast and powerful.',
    breathingTechnique: 'Thunder Breathing',
    role: 'Demon Slayer Corps Member'
  },
  'zenitsu-agatsuma-swag': {
    name: 'Zenitsu Agatsuma',
    title: 'Thunder Breathing Demon Slayer',
    description: 'Zenitsu\'s true power emerges when he\'s unconscious, allowing him to execute perfect Thunder Breathing forms with incredible speed and precision.',
    breathingTechnique: 'Thunder Breathing',
    role: 'Demon Slayer Corps Member'
  }
};

export function getCharacterInfo(filename: string): CharacterInfo {
  const key = filename
    .split('/')
    .pop()
    ?.replace(/\.(jpg|jpeg|png|webp|gif)$/i, '')
    .toLowerCase() || '';
  
  // Try exact match first (case-insensitive)
  if (characterInfoMap[key]) {
    return characterInfoMap[key];
  }
  
  // Try matching with case-insensitive lookup
  const normalizedKey = key.replace(/-love$/i, '-love');
  if (characterInfoMap[normalizedKey]) {
    return characterInfoMap[normalizedKey];
  }
  
  // Try partial matches
  if (key.includes('tanjiro')) {
    if (key.includes('nezuko') || key.includes('tanjio')) {
      return characterInfoMap['tanjiro-and-nezuko'] || characterInfoMap['nezuko-and-tanjio'];
    }
    if (key.includes('love')) {
      return characterInfoMap['tanjiro-kamado-and-love'];
    }
    return characterInfoMap['tanjiro-infinitycastle'];
  }
  
  if (key.includes('zenitsu') || key.includes('zenetsu')) {
    return characterInfoMap['zenitsu-agatsuma'];
  }
  
  if (key.includes('inoske') || key.includes('inosuke')) {
    return characterInfoMap['inoske'];
  }
  
  // Default fallback
  const name = extractNameFromFilename(filename);
  return {
    name: name,
    title: 'Demon Slayer',
    description: 'A member of the Demon Slayer Corps who fights alongside Tanjiro and friends to protect humanity from demons.',
    role: 'Demon Slayer Corps Member'
  };
}

// Gallery images from home page
export const galleryImages = [
  'assets/img/demon-slayer-1.jpg',
  'assets/img/demon-slayer-2.jpg',
  'assets/img/demon-slayer-3.jpg',
  'assets/img/demon-slayer-4.jpg',
  'assets/img/demon-slayer-5.jpg',
  'assets/img/demon-slayer-6.jpg',
  'assets/img/demon-slayer-7.jpg',
  'assets/img/demon-slayer-8.jpg'
];

/**
 * Extract character name from filename
 * Examples:
 * - "rengoku-kyojiro.jpg" -> "Rengoku Kyojiro"
 * - "tanjiro-kamado-angry.jpg" -> "Tanjiro Kamado"
 * - "zenitsu-agatsuma-swag.png" -> "Zenitsu Agatsuma"
 */
export function extractNameFromFilename(filename: string): string {
  // Remove path and extension
  const name = filename
    .split('/')
    .pop()
    ?.replace(/\.(jpg|jpeg|png|webp|gif)$/i, '') || '';
  
  // Replace hyphens and underscores with spaces, then capitalize words
  return name
    .replace(/[-_]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .replace(/\b\d+\b/g, '') // Remove numbers
    .trim();
}

