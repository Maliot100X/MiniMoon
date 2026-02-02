// Game constants and configuration

export const GAME_CONFIG = {
  // Rarity Configuration
  rarities: {
    Common: {
      name: 'Common',
      basePower: 10,
      maxHealth: 100,
      energyRegen: 5,
      dropChance: 0.5,
      color: '#9ca3af',
      gradient: 'from-gray-500 to-gray-600',
    },
    Uncommon: {
      name: 'Uncommon',
      basePower: 25,
      maxHealth: 150,
      energyRegen: 8,
      dropChance: 0.25,
      color: '#22c55e',
      gradient: 'from-green-500 to-green-600',
    },
    Rare: {
      name: 'Rare',
      basePower: 50,
      maxHealth: 250,
      energyRegen: 12,
      dropChance: 0.15,
      color: '#3b82f6',
      gradient: 'from-blue-500 to-blue-600',
    },
    Epic: {
      name: 'Epic',
      basePower: 100,
      maxHealth: 500,
      energyRegen: 20,
      dropChance: 0.07,
      color: '#a855f7',
      gradient: 'from-purple-500 to-purple-600',
    },
    Legendary: {
      name: 'Legendary',
      basePower: 250,
      maxHealth: 1000,
      energyRegen: 35,
      dropChance: 0.025,
      color: '#f59e0b',
      gradient: 'from-amber-500 to-orange-500',
    },
    Mythic: {
      name: 'Mythic',
      basePower: 500,
      maxHealth: 2000,
      energyRegen: 50,
      dropChance: 0.005,
      color: '#ef4444',
      gradient: 'from-red-500 to-pink-500',
    },
  },

  // Dungeon Configuration
  dungeons: {
    TrainingGrounds: {
      id: 1,
      name: 'Training Grounds',
      difficulty: 'Easy',
      energyCost: 10,
      minPower: 0,
      winRate: 0.9,
      rewards: { min: 100, max: 500 },
    },
    ForestOfBeginnings: {
      id: 2,
      name: 'Forest of Beginnings',
      difficulty: 'Easy',
      energyCost: 15,
      minPower: 50,
      winRate: 0.8,
      rewards: { min: 250, max: 1000 },
    },
    CrystalCave: {
      id: 3,
      name: 'Crystal Cave',
      difficulty: 'Medium',
      energyCost: 25,
      minPower: 150,
      winRate: 0.65,
      rewards: { min: 500, max: 2500 },
    },
    VolcanicCrater: {
      id: 4,
      name: 'Volcanic Crater',
      difficulty: 'Hard',
      energyCost: 40,
      minPower: 400,
      winRate: 0.5,
      rewards: { min: 1500, max: 5000 },
    },
    ShadowRealm: {
      id: 5,
      name: 'Shadow Realm',
      difficulty: 'Nightmare',
      energyCost: 75,
      minPower: 1000,
      winRate: 0.3,
      rewards: { min: 5000, max: 20000 },
    },
  },

  // Energy Configuration
  energy: {
    max: 100,
    regenRate: 5, // per hour
    regenInterval: 60 * 60 * 1000, // 1 hour in ms
  },

  // Experience Configuration
  experience: {
    levelUpBase: 100,
    levelUpMultiplier: 1.5,
    expPerDungeon: 25,
    expPerBattle: 10,
  },

  // Token Configuration
  token: {
    symbol: 'MNMOON',
    decimals: 18,
    name: 'MiniMoon Token',
  },

  // Network Configuration
  networks: {
    base: {
      chainId: 8453,
      name: 'Base',
      rpcUrl: 'https://mainnet.base.org',
      explorerUrl: 'https://basescan.org',
    },
    baseSepolia: {
      chainId: 84532,
      name: 'Base Sepolia',
      rpcUrl: 'https://sepolia.base.org',
      explorerUrl: 'https://sepolia.basescan.org',
    },
  },
};

// Monster names by rarity for random generation
export const MONSTER_NAMES = {
  Common: ['Slime', 'Rat', 'Bat', 'Spider', 'Ant', 'Bee', 'Worm', 'Larva', 'Mouse', 'Bird'],
  Uncommon: ['Goblin', 'Wolf', 'Snake', 'Bear', 'Deer', 'Fox', 'Hawk', 'Owl', 'Cat', 'Dog'],
  Rare: ['Centaur', 'Dryad', 'Imp', 'Kobold', 'Manticore', 'Nymph', 'Orc', 'Sprite', 'Warg', 'Yeti'],
  Epic: ['Gargoyle', 'Hydra', 'Phoenix', 'Chimera', 'Cyclops', 'Golem', 'Wraith', 'Banshee', 'Djinn', 'Specter'],
  Legendary: ['Dragon', 'Phoenix King', 'Void Dragon', 'Storm Giant', 'Ancient Wyrm', 'Celestial Dragon', 'Inferno Dragon'],
  Mythic: ['Moon Dragon', 'Shadow Lord', 'Void Incarnate', 'Eternal Phoenix', 'Primordial Beast'],
};

// Monster emoji icons
export const MONSTER_ICONS = {
  Common: ['🟢', '🐀', '🦇', '🕷️', '🐜', '🐝', '🪱', '🐁', '🐦', '🐈'],
  Uncommon: ['👺', '🐺', '🐍', '🐻', '🦌', '🦊', '🦅', '🦉', '🐈‍⬛', '🐕'],
  Rare: ['🧜', '🧚', '👿', '👹', '🦁', '🦄', '👾', '🧞', '🦅', '🦍'],
  Epic: ['🦎', '🐉', '🐲', '🦕', '👁️', '🗿', '👻', '💀', '🧞', '👹'],
  Legendary: ['🐉', '🔥', '⚡', '🌪️', '💎', '👑', '⭐', '🌟', '✨', '💫'],
  Mythic: ['🌙', '🌑', '⭐', '💫', '✨', '🌟', '🔮', '💀', '👁️', '🦁'],
};

export function getRandomMonsterName(rarity: keyof typeof MONSTER_NAMES): string {
  const names = MONSTER_NAMES[rarity];
  return names[Math.floor(Math.random() * names.length)];
}

export function getRandomMonsterIcon(rarity: keyof typeof MONSTER_ICONS): string {
  const icons = MONSTER_ICONS[rarity];
  return icons[Math.floor(Math.random() * icons.length)];
}

export function calculateLevel(exp: number): number {
  return Math.floor(exp / GAME_CONFIG.experience.levelUpBase) + 1;
}

export function calculatePower(rarity: string, level: number, bonus: number = 0): number {
  const basePower = GAME_CONFIG.rarities[rarity as keyof typeof GAME_CONFIG.rarities]?.basePower || 10;
  return Math.floor(basePower + (level - 1) * 5 + bonus);
}

export function calculateWinChance(attackerPower: number, defenderPower: number): number {
  if (attackerPower >= defenderPower * 2) return 0.95;
  if (attackerPower >= defenderPower * 1.5) return 0.8;
  if (attackerPower >= defenderPower) return 0.65;
  if (attackerPower >= defenderPower * 0.7) return 0.45;
  if (attackerPower >= defenderPower * 0.5) return 0.3;
  return 0.15;
}
