import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Monster {
  tokenId: number;
  name: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
  power: number;
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  speed: number;
  energy: number;
  maxEnergy: number;
  experience: number;
  level: number;
  wins: number;
  losses: number;
  dungeonRuns: number;
  isAlive: boolean;
}

export interface Player {
  address: string;
  monsters: Monster[];
  selectedMonsterId: number | null;
  tokens: string;
  energy: number;
  maxEnergy: number;
  lastEnergyUpdate: number;
}

export interface GameState {
  // Player state
  player: Player | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setPlayer: (player: Player) => void;
  updateMonster: (tokenId: number, updates: Partial<Monster>) => void;
  selectMonster: (tokenId: number | null) => void;
  addMonster: (monster: Monster) => void;
  removeMonster: (tokenId: number) => void;
  updateTokens: (amount: string) => void;
  updateEnergy: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  player: null,
  isLoading: false,
  error: null,
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setPlayer: (player) => set({ player }),

      updateMonster: (tokenId, updates) => {
        const { player } = get();
        if (!player) return;

        const updatedMonsters = player.monsters.map((monster) =>
          monster.tokenId === tokenId ? { ...monster, ...updates } : monster
        );

        set({
          player: {
            ...player,
            monsters: updatedMonsters,
          },
        });
      },

      selectMonster: (tokenId) => {
        const { player } = get();
        if (!player) return;

        set({
          player: {
            ...player,
            selectedMonsterId: tokenId,
          },
        });
      },

      addMonster: (monster) => {
        const { player } = get();
        if (!player) return;

        set({
          player: {
            ...player,
            monsters: [...player.monsters, monster],
          },
        });
      },

      removeMonster: (tokenId) => {
        const { player } = get();
        if (!player) return;

        const updatedMonsters = player.monsters.filter(
          (m) => m.tokenId !== tokenId
        );

        set({
          player: {
            ...player,
            monsters: updatedMonsters,
            selectedMonsterId:
              player.selectedMonsterId === tokenId
                ? null
                : player.selectedMonsterId,
          },
        });
      },

      updateTokens: (amount) => {
        const { player } = get();
        if (!player) return;

        set({
          player: {
            ...player,
            tokens: amount,
          },
        });
      },

      updateEnergy: () => {
        const { player } = get();
        if (!player) return;

        const now = Date.now();
        const timePassed = now - player.lastEnergyUpdate;
        const energyRegen = Math.floor(timePassed / (60 * 60 * 1000)) * 5; // 5 energy per hour

        if (energyRegen > 0) {
          const newEnergy = Math.min(player.energy + energyRegen, player.maxEnergy);
          set({
            player: {
              ...player,
              energy: newEnergy,
              lastEnergyUpdate: now,
            },
          });
        }
      },

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      reset: () => set(initialState),
    }),
    {
      name: 'minimoon-game-storage',
      partialize: (state) => ({
        player: state.player,
      }),
    }
  )
);

// Example usage helper
export function createMockPlayer(address: string): Player {
  return {
    address,
    monsters: [
      {
        tokenId: 1,
        name: 'Moon Dragon',
        rarity: 'Legendary',
        power: 1250,
        health: 2500,
        maxHealth: 2500,
        attack: 180,
        defense: 120,
        speed: 95,
        energy: 75,
        maxEnergy: 100,
        experience: 4500,
        level: 45,
        wins: 156,
        losses: 23,
        dungeonRuns: 189,
        isAlive: true,
      },
      {
        tokenId: 2,
        name: 'Shadow Wolf',
        rarity: 'Epic',
        power: 680,
        health: 1200,
        maxHealth: 1200,
        attack: 95,
        defense: 65,
        speed: 150,
        energy: 100,
        maxEnergy: 100,
        experience: 2800,
        level: 28,
        wins: 89,
        losses: 34,
        dungeonRuns: 123,
        isAlive: true,
      },
    ],
    selectedMonsterId: 1,
    tokens: '12500.50',
    energy: 75,
    maxEnergy: 100,
    lastEnergyUpdate: Date.now(),
  };
}
