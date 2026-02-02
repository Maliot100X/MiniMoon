'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import {
  Target,
  Check,
  Clock,
  Coins,
  Star,
  TrendingUp,
  Calendar,
  RefreshCw,
  Loader2,
  Award,
} from 'lucide-react';

const dailyQuests = [
  {
    id: 1,
    name: 'Daily Training',
    description: 'Complete 3 dungeon runs',
    icon: TrendingUp,
    energyCost: 20,
    expReward: 50,
    tokenReward: 100,
    progress: 0,
    target: 3,
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 2,
    name: 'Monster Hunter',
    description: 'Defeat 5 monsters in battle',
    icon: Target,
    energyCost: 30,
    expReward: 100,
    tokenReward: 250,
    progress: 2,
    target: 5,
    color: 'from-red-500 to-red-600',
  },
  {
    id: 3,
    name: 'Collector',
    description: 'Visit the marketplace and make a trade',
    icon: Coins,
    energyCost: 10,
    expReward: 25,
    tokenReward: 50,
    progress: 1,
    target: 1,
    color: 'from-amber-500 to-amber-600',
  },
  {
    id: 4,
    name: 'Explorer',
    description: 'Complete any dungeon',
    icon: Star,
    energyCost: 15,
    expReward: 40,
    tokenReward: 75,
    progress: 1,
    target: 1,
    color: 'from-purple-500 to-purple-600',
  },
];

const weeklyQuests = [
  {
    id: 5,
    name: 'Dungeon Master',
    description: 'Complete 20 dungeon runs',
    icon: Award,
    energyCost: 0,
    expReward: 500,
    tokenReward: 1000,
    progress: 8,
    target: 20,
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 6,
    name: 'Champion',
    description: 'Win 10 battles',
    icon: Target,
    energyCost: 0,
    expReward: 300,
    tokenReward: 500,
    progress: 4,
    target: 10,
    color: 'from-yellow-500 to-yellow-600',
  },
];

export default function QuestsPage() {
  const { isConnected } = useAccount();
  const [refreshing, setRefreshing] = useState(false);
  const [claiming, setClaiming] = useState<number | null>(null);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

  const handleClaim = async (questId: number) => {
    if (!isConnected) {
      alert('Please connect your wallet first!');
      return;
    }
    setClaiming(questId);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setClaiming(null);
    alert(`Quest completed! Rewards claimed!`);
  };

  const allQuests = [...dailyQuests, ...weeklyQuests];
  const completedQuests = allQuests.filter((q) => q.progress >= q.target);
  const inProgressQuests = allQuests.filter((q) => q.progress < q.target);

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white">Quests</h1>
            <p className="mt-2 text-gray-400">
              Complete quests to earn $MNMOON tokens and experience
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-4">
            <div className="flex items-center space-x-2 rounded-xl bg-slate-800 px-4 py-2">
              <Clock className="h-5 w-5 text-amber-400" />
              <span className="text-sm text-gray-400">Reset in:</span>
              <span className="font-mono text-white">23:45:12</span>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center space-x-2 rounded-xl bg-slate-800 px-4 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-4 mb-12">
          <div className="rounded-xl bg-slate-800/50 p-6 border border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Daily Progress</span>
              <Calendar className="h-5 w-5 text-blue-400" />
            </div>
            <div className="mt-2 text-3xl font-bold text-white">
              {dailyQuests.filter((q) => q.progress >= q.target).length}/{dailyQuests.length}
            </div>
            <div className="mt-2 h-2 rounded-full bg-slate-700">
              <div
                className="h-full rounded-full bg-blue-500 transition-all"
                style={{
                  width: `${(dailyQuests.filter((q) => q.progress >= q.target).length / dailyQuests.length) * 100}%`,
                }}
              />
            </div>
          </div>
          <div className="rounded-xl bg-slate-800/50 p-6 border border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Weekly Progress</span>
              <Star className="h-5 w-5 text-amber-400" />
            </div>
            <div className="mt-2 text-3xl font-bold text-white">
              {weeklyQuests.filter((q) => q.progress >= q.target).length}/{weeklyQuests.length}
            </div>
            <div className="mt-2 h-2 rounded-full bg-slate-700">
              <div
                className="h-full rounded-full bg-amber-500 transition-all"
                style={{
                  width: `${(weeklyQuests.filter((q) => q.progress >= q.target).length / weeklyQuests.length) * 100}%`,
                }}
              />
            </div>
          </div>
          <div className="rounded-xl bg-slate-800/50 p-6 border border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Total Earned</span>
              <Coins className="h-5 w-5 text-green-400" />
            </div>
            <div className="mt-2 text-3xl font-bold text-green-400">12,450</div>
            <div className="mt-1 text-sm text-gray-500">$MNMOON</div>
          </div>
          <div className="rounded-xl bg-slate-800/50 p-6 border border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">EXP Gained</span>
              <TrendingUp className="h-5 w-5 text-purple-400" />
            </div>
            <div className="mt-2 text-3xl font-bold text-purple-400">2,850</div>
            <div className="mt-1 text-sm text-gray-500">Experience</div>
          </div>
        </div>

        {/* Daily Quests */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Daily Quests</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {dailyQuests.map((quest, index) => (
              <motion.div
                key={quest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative overflow-hidden rounded-xl bg-slate-800/50 border p-6 card-hover ${
                  quest.progress >= quest.target
                    ? 'border-green-500/30'
                    : 'border-white/5'
                }`}
              >
                {quest.progress >= quest.target && (
                  <div className="absolute top-0 right-0 rounded-bl-xl bg-green-500 px-3 py-1">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
                <div className={`inline-flex rounded-xl bg-gradient-to-br ${quest.color} p-3`}>
                  <quest.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-4 font-bold text-white">{quest.name}</h3>
                <p className="mt-1 text-sm text-gray-400">{quest.description}</p>

                {/* Progress */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white">
                      {quest.progress}/{quest.target}
                    </span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-700">
                    <div
                      className={`h-full rounded-full transition-all ${
                        quest.progress >= quest.target ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${(quest.progress / quest.target) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Rewards */}
                <div className="mt-4 flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-purple-400" />
                    <span className="text-gray-300">+{quest.expReward} EXP</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Coins className="h-4 w-4 text-amber-400" />
                    <span className="text-gray-300">{quest.tokenReward}</span>
                  </div>
                </div>

                {/* Claim Button */}
                <button
                  onClick={() => handleClaim(quest.id)}
                  disabled={!!claiming || quest.progress < quest.target}
                  className={`mt-4 w-full rounded-lg py-3 font-bold transition-all ${
                    quest.progress >= quest.target
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:opacity-90'
                      : 'bg-slate-700 text-gray-400 cursor-not-allowed'
                  } disabled:opacity-50`}
                >
                  {claiming === quest.id ? (
                    <span className="flex items-center justify-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Claiming...</span>
                    </span>
                  ) : quest.progress >= quest.target ? (
                    'Claim Rewards'
                  ) : (
                    `In Progress (${quest.energyCost} Energy)`
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Weekly Quests */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">Weekly Quests</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {weeklyQuests.map((quest, index) => (
              <motion.div
                key={quest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (index + 4) * 0.1 }}
                className={`relative overflow-hidden rounded-xl bg-slate-800/50 border p-6 card-hover ${
                  quest.progress >= quest.target
                    ? 'border-green-500/30'
                    : 'border-white/5'
                }`}
              >
                {quest.progress >= quest.target && (
                  <div className="absolute top-0 right-0 rounded-bl-xl bg-green-500 px-3 py-1">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
                <div className="flex items-start space-x-4">
                  <div className={`flex-shrink-0 rounded-xl bg-gradient-to-br ${quest.color} p-4`}>
                    <quest.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white">{quest.name}</h3>
                    <p className="mt-1 text-gray-400">{quest.description}</p>

                    {/* Progress */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-white">
                          {quest.progress}/{quest.target}
                        </span>
                      </div>
                      <div className="mt-2 h-3 rounded-full bg-slate-700">
                        <div
                          className={`h-full rounded-full transition-all ${
                            quest.progress >= quest.target ? 'bg-amber-500' : 'bg-amber-500/50'
                          }`}
                          style={{ width: `${(quest.progress / quest.target) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Rewards */}
                    <div className="mt-4 flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <Star className="h-5 w-5 text-purple-400" />
                        <span className="font-bold text-white">+{quest.expReward} EXP</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Coins className="h-5 w-5 text-amber-400" />
                        <span className="font-bold text-white">{quest.tokenReward}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Claim Button */}
                <button
                  onClick={() => handleClaim(quest.id)}
                  disabled={!!claiming || quest.progress < quest.target}
                  className={`mt-6 w-full rounded-lg py-3 font-bold transition-all ${
                    quest.progress >= quest.target
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:opacity-90'
                      : 'bg-slate-700 text-gray-400 cursor-not-allowed'
                  } disabled:opacity-50`}
                >
                  {claiming === quest.id ? (
                    <span className="flex items-center justify-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Claiming...</span>
                    </span>
                  ) : quest.progress >= quest.target ? (
                    'Claim Rewards'
                  ) : (
                    `${quest.progress}/${quest.target} Complete`
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
