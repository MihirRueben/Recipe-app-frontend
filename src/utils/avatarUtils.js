/**
 * Avatar utility functions using DiceBear API
 */

/**
 * Generates a DiceBear avatar URL based on a seed
 * @param {string} seed - The seed for generating unique avatars
 * @param {string} style - The DiceBear style (default: 'adventurer')
 * @returns {string} The avatar URL
 */
export const generateAvatarUrl = (seed, style = 'adventurer') => {
  if (!seed) {
    // Generate a random seed if none provided
    seed = Math.random().toString(36).substring(2, 15);
  }
  
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}`;
};

/**
 * Generates a consistent avatar for a user based on their username or email
 * @param {Object} user - User object with username or email
 * @param {string} style - The DiceBear style
 * @returns {string} The avatar URL
 */
export const getUserAvatarUrl = (user, style = 'adventurer') => {
  if (!user) return generateAvatarUrl('default');
  
  // Use username as primary seed, fallback to email, then to random
  const seed = user.username || user.email || Math.random().toString(36).substring(2, 15);
  return generateAvatarUrl(seed, style);
};

/**
 * Available DiceBear styles for variety
 */
export const AVATAR_STYLES = [
  'adventurer',
  'adventurer-neutral',
  'avataaars',
  'big-ears',
  'big-ears-neutral',
  'bottts',
  'croodles',
  'croodles-neutral',
  'fun-emoji',
  'icons',
  'identicon',
  'initials',
  'lorelei',
  'micah',
  'miniavs',
  'notionists',
  'notionists-neutral',
  'open-peeps',
  'personas',
  'pixel-art',
  'pixel-art-neutral',
  'shapes'
];

/**
 * Gets a random style from the available styles
 * @returns {string} A random DiceBear style
 */
export const getRandomAvatarStyle = () => {
  return AVATAR_STYLES[Math.floor(Math.random() * AVATAR_STYLES.length)];
};
