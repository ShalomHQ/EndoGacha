
import { Rarity, Character } from './types';

export const CHARACTERS: Character[] = [
  // 4 Stars
  { id: '4-1', name: 'Catcher', rarity: Rarity.FOUR_STAR },
  { id: '4-2', name: 'Estella', rarity: Rarity.FOUR_STAR },
  { id: '4-3', name: 'Akekuri', rarity: Rarity.FOUR_STAR },
  { id: '4-4', name: 'Fluorite', rarity: Rarity.FOUR_STAR },
  { id: '4-5', name: 'Antal', rarity: Rarity.FOUR_STAR },

  // 5 Stars
  { id: '5-1', name: 'Da Pan', rarity: Rarity.FIVE_STAR },
  { id: '5-2', name: 'Avywenna', rarity: Rarity.FIVE_STAR },
  { id: '5-3', name: 'Arclight', rarity: Rarity.FIVE_STAR },
  { id: '5-4', name: 'Wulfgard', rarity: Rarity.FIVE_STAR },
  { id: '5-5', name: 'Perlica', rarity: Rarity.FIVE_STAR },
  { id: '5-6', name: 'Chen Qianyu', rarity: Rarity.FIVE_STAR },
  { id: '5-7', name: 'Snowshine', rarity: Rarity.FIVE_STAR },
  { id: '5-8', name: 'Alesh', rarity: Rarity.FIVE_STAR },
  { id: '5-9', name: 'Xaihi', rarity: Rarity.FIVE_STAR },

  // 6 Stars Standard
  { id: '6-s1', name: 'Pogranichnik', rarity: Rarity.SIX_STAR, type: 'standard' },
  { id: '6-s2', name: 'Ember', rarity: Rarity.SIX_STAR, type: 'standard' },
  { id: '6-s3', name: 'LiFeng', rarity: Rarity.SIX_STAR, type: 'standard' },
  { id: '6-s4', name: 'Last Rite', rarity: Rarity.SIX_STAR, type: 'standard' },
  { id: '6-s5', name: 'Ardelia', rarity: Rarity.SIX_STAR, type: 'standard' },

  // 6 Stars Featured
  { id: '6-f1', name: 'Gilberta', rarity: Rarity.SIX_STAR, type: 'featured' },

  // 6 Stars Old Rate Up
  { id: '6-o1', name: 'Yvonne', rarity: Rarity.SIX_STAR, type: 'old-rate-up' },
  { id: '6-o2', name: 'Laevatain', rarity: Rarity.SIX_STAR, type: 'old-rate-up' },
];

export const GACHA_CONFIG = {
  SIX_STAR_BASE: 0.008,
  FIVE_STAR_BASE: 0.08,
  SOFT_PITY_START: 65,
  SIX_STAR_HARD_PITY: 80,
  FIVE_STAR_HARD_PITY: 10,
  FEATURE_GUARANTEE_PULL: 120,
  FEATURED_RATE: 0.50,
  OLD_LIMITED_RATE: 0.142,
  STANDARD_OFF_RATE: 0.358,
};
