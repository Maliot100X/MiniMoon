'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import {
  Sword, Shield, Zap, Flame, Skull, ChevronRight, Play, Loader2, Lock, Check, X,
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

const difficultyColors: Record<string, { text: string; bg: string; border: string }> = {
  Easy: { text: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/30' },
  Medium: { text: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/30' },
  Hard: { text: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/30' },
  Nightmare: { text: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30' },
};

export default function DungeonsPage() {
  const { isConnected, address } = useAccount();
  const [enteringDungeon, setEnteringDungeon] = useState<number | null>(null);
  const [battleResult, setBattleResult] = useState<{ won: boolean; rewards: number; message: string } | null>(null);
  const [energy, setEnergy] = useState(100);
  const [power] = useState(500);
  const [stamina, setStamina] = useState(100);
  const [inBattle, setInBattle] = useState(false);

  const handleEnterDungeon = async (dungeonId: number) => {
    if (!isConnected) {
      alert('Please connect your wallet first!');
      return;
    }

    const dungeon = dungeons.find(d => d.id === dungeonId);
    if (!dungeon) return;

    if (energy < dungeon.energyCost) {
      alert(`Not enough energy! Need ${dungeon.energyCost} energy.`);
      return;
    }

    if (power < dungeon.minPower) {
      alert(`Your power (${power}) is too low for this dungeon! Minimum required: ${dungeon.minPower}`);
      return;
    }

    setEnteringDungeon(dungeonId);
    setInBattle(true);

    // Simulate battle
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Calculate win/loss (simulated)
    const winChance = dungeon.winRate / 100;
    const won = Math.random() < winChance;
    const baseReward = parseInt(dungeon.rewards.split('-')[0].replace(/[^0-9]/g, ''));
    const maxReward = parseInt(dungeon.rewards.split('-')[1].replace(/[^0-9]/g, ''));
    const rewards = won ? Math.floor(baseReward + Math.random() * (maxReward - baseReward)) : 0;

    setBattleResult({
      won,
      rewards,
      message: won 
        ? `Victory! You defeated the dungeon monsters!`
        : `Defeat! The monsters were too strong. Try again!`,
    });

    // Deduct energy
    setEnergy(prev => Math.max(0, prev - dungeon.energyCost));

    // Deduct stamina (recovers over time)
    setStamina(prev => Math.max(0, prev - 10));

    setEnteringDungeon(null);
  };

  const closeBattleResult = () => {
    setBattleResult(null);
    setInBattle(false);
  };

  const refreshEnergy = () => {
    setEnergy(100);
    setStamina(100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-white/5 py-6">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-400 hover:text-white">←</Link>
              <h1 className="text-3xl font-bold text-white">🏰 Dungeons</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-700/50">
                <span className="text-amber-400">⚡</span>
                <span className="text-white font-bold">{energy}/100</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-700/50">
                <span>💪</span>
                <span className="text-white font-bold">{power} ⚔️</span>
              </div>
            </div>
          </div>

          {/* Stamina Bar */}
          <div className="bg-slate-700/50 rounded-xl p-3 mb-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-400">Stamina</span>
              <span className="text-white font-medium">{stamina}/100</span>
            </div>
            <div className="h-2 bg-slate-600 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                animate={{ width: `${stamina}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Refresh Button */}
          {energy < 10 && (
            <button
              onClick={refreshEnergy}
              className="w-full py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 font-bold text-white"
            >
              🔄 Refresh Energy (Free)
            </button>
          )}
        </div>
      </div>

      {/* Dungeon List */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {dungeons.map((dungeon, index) => {
            const canEnter = isConnected && energy >= dungeon.energyCost && power >= dungeon.minPower;
            const difficulty = difficultyColors[dungeon.difficulty];

            return (
              <motion.div
                key={dungeon.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-slate-800/50 rounded-2xl p-4 border transition-all hover:scale-[1.01] ${
                  canEnter 
                    ? difficulty.border 
                    : 'border-white/5 opacity-70'
                }`}
              >
                <div className="flex items-start space-x-4">
                  {/* Dungeon Icon */}
                  <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${dungeon.color} flex items-center justify-center flex-shrink-0`}>
                    <dungeon.icon className="h-8 w-8 text-white" />
                  </div>

                  {/* Dungeon Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-xl font-bold text-white">{dungeon.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${difficulty.bg} ${difficulty.text}`}>
                        {dungeon.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">{dungeon.description}</p>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-3 text-sm">
                      <div className="flex items-center space-x-1 text-amber-400">
                        <span>⚡</span>
                        <span>{dungeon.energyCost}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-green-400">
                        <span>📈</span>
                        <span>{dungeon.winRate}% Win Rate</span>
                      </div>
                      <div className="flex items-center space-x-1 text-blue-400">
                        <span>💰</span>
                        <span>{dungeon.rewards}</span>
                      </div>
                      {power < dungeon.minPower && (
                        <div className="flex items-center space-x-1 text-red-400">
                          <Lock className="h-3 w-3" />
                          <span>Need {dungeon.minPower} Power</span>
                        </div>
                      )}
                    </div>

                    {/* Monster Preview */}
                    <div className="flex items-center space-x-2 mt-3">
                      <span className="text-xs text-gray-500">Encounters:</span>
                      <div className="flex space-x-1">
                        {dungeon.monsters.map((monster, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-slate-700/50 text-gray-400 text-xs">
                            {monster}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Enter Button */}
                  <button
                    onClick={() => handleEnterDungeon(dungeon.id)}
                    disabled={!canEnter || enteringDungeon === dungeon.id}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all ${
                      canEnter
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90'
                        : 'bg-slate-700 text-gray-500 cursor-not-allowed'
                    } disabled:opacity-50`}
                  >
                    {enteringDungeon === dungeon.id ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Entering...</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        <span>Enter</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Tips */}
        <div className="mt-8 bg-slate-800/50 rounded-xl p-6 border border-white/5">
          <h3 className="text-lg font-bold text-white mb-4">💡 Dungeon Tips</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start space-x-2">
              <span className="text-amber-400">⚡</span>
              <p className="text-gray-400">Higher difficulty dungeons use more energy but offer better rewards</p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-green-400">📈</span>
              <p className="text-gray-400">Win rates are based on your power vs dungeon requirements</p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-400">💰</span>
              <p className="text-gray-400">Rewards are random within the shown range</p>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-purple-400">🏆</span>
              <p className="text-gray-400">Complete dungeons to earn XP and progress your trainer level</p>
            </div>
          </div>
        </div>
      </div>

      {/* Battle Result Modal */}
      {battleResult && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={closeBattleResult}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className={`rounded-2xl p-8 max-w-sm w-full text-center ${
              battleResult.won
                ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500/30'
                : 'bg-gradient-to-br from-red-500/20 to-orange-500/20 border-2 border-red-500/30'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-8xl mb-4">
              {battleResult.won ? '🎉' : '💀'}
            </div>
            <h2 className={`text-2xl font-bold mb-2 ${
              battleResult.won ? 'text-green-400' : 'text-red-400'
            }`}>
              {battleResult.won ? 'Victory!' : 'Defeat!'}
            </h2>
            <p className="text-gray-400 mb-6">{battleResult.message}</p>

            {battleResult.won && (
              <div className="p-4 rounded-xl bg-slate-800/50 mb-6">
                <p className="text-sm text-gray-400">Rewards Earned</p>
                <p className="text-3xl font-bold text-amber-400">
                  +{battleResult.rewards.toLocaleString()} $MNMOON
                </p>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={closeBattleResult}
                className="flex-1 py-3 rounded-xl bg-slate-700 text-white font-bold hover:bg-slate-600 transition-colors"
              >
                Close
              </button>
              {!battleResult.won && (
                <button
                  onClick={() => {
                    closeBattleResult();
                    // Retry would go here
                  }}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 font-bold text-white"
                >
                  Try Again
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
