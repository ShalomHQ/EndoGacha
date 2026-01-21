
import { Rarity, Character, GachaStats, PullResult } from './types';
import { CHARACTERS, GACHA_CONFIG } from './constants';

export class GachaEngine {
  static getCharacterPool(rarity: Rarity, type?: string): Character[] {
    return CHARACTERS.filter(c => c.rarity === rarity && (!type || c.type === type));
  }

  static pull(stats: GachaStats): { result: PullResult; nextStats: GachaStats } {
    const nextStats = { ...stats, counts: { ...stats.counts } };
    nextStats.totalPulls += 1;
    nextStats.sixStarPity += 1;
    nextStats.fiveStarPity += 1;

    let rarity: Rarity = Rarity.FOUR_STAR;

    // Check 120 pull guarantee
    const is120Guarantee = nextStats.totalPulls === GACHA_CONFIG.FEATURE_GUARANTEE_PULL && nextStats.featuredGuaranteedAt120;

    if (is120Guarantee) {
      rarity = Rarity.SIX_STAR;
    } else {
      // Calculate 6-star probability
      let sixStarRate = GACHA_CONFIG.SIX_STAR_BASE;
      if (nextStats.sixStarPity > GACHA_CONFIG.SOFT_PITY_START) {
        sixStarRate += (nextStats.sixStarPity - GACHA_CONFIG.SOFT_PITY_START) * 0.05;
      }
      if (nextStats.sixStarPity >= GACHA_CONFIG.SIX_STAR_HARD_PITY) {
        sixStarRate = 1.0;
      }

      // Calculate 5-star probability
      let fiveStarRate = GACHA_CONFIG.FIVE_STAR_BASE;
      if (nextStats.fiveStarPity >= GACHA_CONFIG.FIVE_STAR_HARD_PITY) {
        fiveStarRate = 1.0;
      }

      const roll = Math.random();
      if (roll < sixStarRate) {
        rarity = Rarity.SIX_STAR;
      } else if (roll < sixStarRate + fiveStarRate) {
        rarity = Rarity.FIVE_STAR;
      }
    }

    let character: Character;

    if (rarity === Rarity.SIX_STAR) {
      if (is120Guarantee) {
        character = this.getCharacterPool(Rarity.SIX_STAR, 'featured')[0];
        nextStats.featuredGuaranteedAt120 = false;
      } else {
        const roll = Math.random();
        if (roll < GACHA_CONFIG.FEATURED_RATE) {
          character = this.getCharacterPool(Rarity.SIX_STAR, 'featured')[0];
          nextStats.featuredGuaranteedAt120 = false;
        } else if (roll < GACHA_CONFIG.FEATURED_RATE + GACHA_CONFIG.OLD_LIMITED_RATE) {
          const pool = this.getCharacterPool(Rarity.SIX_STAR, 'old-rate-up');
          character = pool[Math.floor(Math.random() * pool.length)];
        } else {
          const pool = this.getCharacterPool(Rarity.SIX_STAR, 'standard');
          character = pool[Math.floor(Math.random() * pool.length)];
        }
      }
      nextStats.sixStarPity = 0;
      nextStats.counts[Rarity.SIX_STAR]++;
    } else if (rarity === Rarity.FIVE_STAR) {
      const pool = this.getCharacterPool(Rarity.FIVE_STAR);
      character = pool[Math.floor(Math.random() * pool.length)];
      nextStats.fiveStarPity = 0;
      nextStats.counts[Rarity.FIVE_STAR]++;
    } else {
      const pool = this.getCharacterPool(Rarity.FOUR_STAR);
      character = pool[Math.floor(Math.random() * pool.length)];
      nextStats.counts[Rarity.FOUR_STAR]++;
    }

    const result: PullResult = {
      character,
      isNew: !stats.pullHistory.some(h => h.character.id === character.id),
      pullNumber: nextStats.totalPulls
    };

    // Store every pull in chronological order (newest first)
    nextStats.pullHistory = [result, ...stats.pullHistory];

    return { result, nextStats };
  }

  static multiPull(stats: GachaStats, count: number): { results: PullResult[]; nextStats: GachaStats } {
    let currentStats = { ...stats };
    const results: PullResult[] = [];
    for (let i = 0; i < count; i++) {
      const { result, nextStats } = this.pull(currentStats);
      results.push(result);
      currentStats = nextStats;
    }
    return { results, nextStats: currentStats };
  }
}
