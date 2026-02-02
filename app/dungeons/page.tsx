'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import {
  Sword,
  Shield,
  Zap,
  Flame,
  Skull,
  Lock,
  ChevronRight,
  Play,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';

const dungeons = [
  {
    id: 1,
    name: 'Training Grounds',
    description: 'A safe environment for beginners to learn the basics',
    icon: Shield,
    difficulty: 'Easy',
    energyCost: 10,
    minPower: 0,
    winRate: 90,
    rewards: '100-500 $MNMOON',
    color: 'from-green-500 to-green-600',
    monsters: ['Slime', 'Rat', 'Bat'],
  },
  {
    id: 2,
    name: 'Forest of Beginnings',
    description: 'Dense forest inhabited by common monsters',
    icon: Sword,
    difficulty: 'Easy',
    energyCost: 15,
    minPower: 50,
    winRate: 80,
    rewards: '250-1,000 $MNMOON',
    color: 'from-emerald-500 to-emerald-600',
    monsters: ['Goblin', 'Wolf', 'Spider'],
  },
  {
    id: 3,
    name: 'Crystal Cave',
    description: 'Glimmering cave with powerful crystal monsters',
    icon: Zap,
    difficulty: 'Medium',
    energyCost: 25,
    minPower: 150,
    winRate: 65,
    rewards: '500-2,500 $MNMOON',
    color: 'from-blue-500 to-blue-600',
    monsters: ['Crystal Golem', 'Ice Wolf', 'Electric Eel'],
  },
  {
    id: 4,
    name: 'Volcanic Crater',
    description: 'Burning volcano home to fire elemental beasts',
    icon: Flame,
    difficulty: 'Hard',
    energyCost: 40,
    minPower: 400,
    winRate: 50,
    rewards: '1,500-5,000 $MNMOON',
    color: 'from-orange-500 to-red-600',
    monsters: ['Fire Dragon', 'Magma Beast', 'Phoenix'],
  },
  {
    id: 5,
    name: 'Shadow Realm',
    description: 'A dimension of darkness where only the strongest survive',
    icon: Skull,
    difficulty: 'Nightmare',
    energyCost: 75,
    minPower: 1000,
    winRate: 30,
    rewards: '5,000-20,000 $MNMOON',
    color: 'from-purple-600 to-black',
    monsters: ['Shadow Lord', 'Void Dragon', 'Dark Phoenix'],
  },
];

const difficultyColors = {
  Easy: 'text-green-400 bg-green-400/10',
  Medium: 'text-blue-400 bg-blue-400/10',
  Hard: 'text-orange-400 bg-orange-400/10',
  Nightmare: 'text-red-400 bg-red-400/10',
};

export default function DungeonsPage() {
  const { isConnected } = useAccount();
  const [enteringDungeon, setEnteringDungeon] = useState<number | null>(null);

  const handleEnterDungeon = async (dungeonId: number) => {
    if (!isConnected) {
      alert('Please connect your wallet first!');
      return;
    }
    setEnteringDungeon(dungeonId);
    // Simulate dungeon entry
    setTimeout(() => {
      setEnteringDungeon(null);
      alert(`Entering dungeon... (Simulation)`);
    }, 2000);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white">Dungeons</h1>
          <p className="mt-2 text-gray-400">
            Challenge dungeons with your monsters to earn rewards
          </p>
        </div>

        {/* Dungeon Grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          {dungeons.map((dungeon, index) => (
            <motion.div
              key={dungeon.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl bg-slate-800/50 border border-white/5 card-hover"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${dungeon.color} opacity-5`} />

              <div className="relative p-8">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`relative rounded-xl bg-gradient-to-br ${dungeon.color} p-4`}>
                      <dungeon.icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{dungeon.name}</h3>
                      <span className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-medium ${difficultyColors[dungeon.difficulty as keyof typeof difficultyColors]}`}>
                        {dungeon.difficulty}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="mt-4 text-gray-400">{dungeon.description}</p>

                {/* Stats */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-slate-700/50 p-4">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Zap className="h-4 w-4" />
                      <span className="text-sm">Energy Cost</span>
                    </div>
                    <div className="mt-1 text-2xl font-bold text-white">
                      {dungeon.energyCost}
                    </div>
                  </div>
                  <div className="rounded-xl bg-slate-700/50 p-4">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Sword className="h-4 w-4" />
                      <span className="text-sm">Win Rate</span>
                    </div>
                    <div className="mt-1 text-2xl font-bold text-green-400">
                      {dungeon.winRate}%
                    </div>
                  </div>
                  <div className="rounded-xl bg-slate-700/50 p-4">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Shield className="h-4 w-4" />
                      <span className="text-sm">Min Power</span>
                    </div>
                    <div className="mt-1 text-2xl font-bold text-white">
                      {dungeon.minPower.toLocaleString()}
                    </div>
                  </div>
                  <div className="rounded-xl bg-slate-700/50 p-4">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Flame className="h-4 w-4" />
                      <span className="text-sm">Rewards</span>
                    </div>
                    <div className="mt-1 text-lg font-bold text-amber-400">
                      {dungeon.rewards}
                    </div>
                  </div>
                </div>

                {/* Monster Types */}
                <div className="mt-6">
                  <div className="text-sm text-gray-400">Encounters:</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {dungeon.monsters.map((monster) => (
                      <span
                        key={monster}
                        className="rounded-full bg-white/10 px-3 py-1 text-sm text-gray-300"
                      >
                        {monster}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Enter Button */}
                <div className="mt-8">
                  <button
                    onClick={() => handleEnterDungeon(dungeon.id)}
                    disabled={enteringDungeon === dungeon.id}
                    className={`group flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r ${dungeon.color} px-6 py-4 font-bold text-white transition-all hover:opacity-90 disabled:opacity-50`}
                  >
                    {enteringDungeon === dungeon.id ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Entering...</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-5 w-5" />
                        <span>Enter Dungeon</span>
                        <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${dungeon.color} opacity-0 transition-opacity group-hover:opacity-10 blur-xl`} />
            </motion.div>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-16 rounded-2xl bg-gradient-to-r from-amber-500/10 to-pink-500/10 p-8 border border-amber-500/20">
          <h3 className="text-xl font-bold text-white">How Dungeons Work</h3>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20">
                <Zap className="h-6 w-6 text-amber-400" />
              </div>
              <h4 className="mt-4 font-semibold text-white">1. Spend Energy</h4>
              <p className="mt-2 text-sm text-gray-400">
                Each dungeon requires energy to enter. Energy regenerates over time.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20">
                <Sword className="h-6 w-6 text-blue-400" />
              </div>
              <h4 className="mt-4 font-semibold text-white">2. Battle</h4>
              <p className="mt-2 text-sm text-gray-400">
                Your monster fights dungeon enemies. Win chance depends on power level.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
                <Flame className="h-6 w-6 text-green-400" />
              </div>
              <h4 className="mt-4 font-semibold text-white">3. Earn Rewards</h4>
              <p className="mt-2 text-sm text-gray-400">
                Victory grants $MNMOON tokens and experience for your monster.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
