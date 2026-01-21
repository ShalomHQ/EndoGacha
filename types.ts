
export enum Rarity {
  FOUR_STAR = 4,
  FIVE_STAR = 5,
  SIX_STAR = 6
}

export type CharacterType = 'featured' | 'old-rate-up' | 'standard';

export interface Character {
  id: string;
  name: string;
  rarity: Rarity;
  type?: CharacterType;
}

export interface PullResult {
  character: Character;
  isNew: boolean;
  pullNumber: number;
}

export interface GachaStats {
  totalPulls: number;
  sixStarPity: number;
  fiveStarPity: number;
  featuredGuaranteedAt120: boolean;
  pullHistory: PullResult[];
  counts: {
    [Rarity.FOUR_STAR]: number;
    [Rarity.FIVE_STAR]: number;
    [Rarity.SIX_STAR]: number;
  };
}
