'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import {
  Target, Check, Clock, Coins, Star, TrendingUp, Calendar, RefreshCw, Loader2, Award, Shield, ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

interface Quest {
  id: number;
  name: string;
  description: string;
  icon: string;
  energyCost: number;
  expReward: number;
  tokenReward: number;
  progress: number;
  target: number;
  color: string;
  type: 'dungeon' | 'battle' | 'trade' | 'collection';
  verifyRequired: boolean;
  verifyUrl?: string;
}

const dailyQuests: Quest[] = [
  {
    id: 1,
    name: 'Daily Training',
    description: 'Complete 3 dungeon runs',
    icon: '🏰',
    energyCost: 20,
    expReward: 50,
    tokenReward: 100,
    progress: 0,
    target: 3,
    color: 'from-blue-500 to-blue-600',
    type: 'dungeon',
    verifyRequired: true,
    verifyUrl: '/dungeons',
  },
  {
    id: 2,
    name: 'Monster Hunter',
    description: 'Win 5 battles in Arena',
    icon: '⚔️',
    energyCost: 30,
    expReward: 100,
    tokenReward: 250,
    progress: 2,
    target: 5,
    color: 'from-red-500 to-red-600',
    type: 'battle',
    verifyRequired: true,
    verifyUrl: '/arena',
  },
  {
    id: 3,
    name: 'Collector',
    description: 'Buy or sell 1 Pokemon in marketplace',
    icon: '🏪',
    energyCost: 10,
    expReward: 25,
    tokenReward: 50,
    progress: 0,
    target: 1,
    color: 'from-amber-500 to-amber-600',
    type: 'trade',
    verifyRequired: true,
    verifyUrl: '/marketplace',
  },
  {
    id: 4,
    name: 'AFK Farmer',
    description: 'Hatch 3 eggs in AFK arena',
    icon: '🥚',
    energyCost: 0,
    expReward: 40,
    tokenReward: 75,
    progress: 1,
    target: 3,
    color: 'from-purple-500 to-purple-600',
    type: 'collection',
    verifyRequired: false,
  },
  {
    id: 5,
    name: 'Staker',
    description: 'Stake 100 $MNMOON in staking pool',
    icon: '🪙',
    energyCost: 0,
    expReward: 60,
    tokenReward: 150,
    progress: 0,
    target: 1,
    color: 'from-green-500 to-green-600',
    type: 'collection',
    verifyRequired: true,
    verifyUrl: '/staking',
  },
];

const weeklyQuests: Quest[] = [
  {
    id: 6,
    name: 'Dungeon Master',
    description: 'Complete 20 dungeon runs',
    icon: '🏆',
    energyCost: 0,
    expReward: 500,
    tokenReward: 1000,
    progress: 8,
    target: 20,
    color: 'from-amber-500 to-orange-600',
    type: 'dungeon',
    verifyRequired: true,
    verifyUrl: '/dungeons',
  },
  {
    id: 7,
    name: 'Champion',
    description: 'Win 15 battles',
    icon: '👑',
    energyCost: 0,
    expReward: 400,
    tokenReward: 750,
    progress: 6,
    target: 15,
    color: 'from-yellow-500 to-yellow-600',
    type: 'battle',
    verifyRequired: true,
    verifyUrl: '/arena',
  },
  {
    id: 8,
    name: 'Trader',
    description: 'Complete 5 marketplace trades',
    icon: '💰',
    energyCost: 0,
    expReward: 300,
    tokenReward: 500,
    progress: 2,
    target: 5,
    color: 'from-emerald-500 to-emerald-600',
    type: 'trade',
    verifyRequired: true,
    verifyUrl: '/marketplace',
  },
  {
    id: 9,
    name: 'Egg Collector',
    description: 'Hatch 20 eggs',
    icon: '🐣',
    energyCost: 0,
    expReward: 350,
    tokenReward: 600,
    progress: 12,
    target: 20,
    color: 'from-pink-500 to-pink-600',
    type: 'collection',
    verifyRequired: false,
  },
  {
    id: 10,
    name: 'Social Butterfly',
    description: 'Share MiniMoon on FarCaster or Twitter',
    icon: '🦪',
    energyCost: 0,
    expReward: 200,
    tokenReward: 400,
    progress: 0,
    target: 1,
    color: 'from-indigo-500 to-indigo-600',
    type: 'collection',
    verifyRequired: true,
    verifyUrl: '/share',
  },
];

export default function QuestsPage() {
  const { isConnected, address } = useAccount();
  const [refreshing, setRefreshing] = useState(false);
  const [claiming, setClaiming] = useState<number | null>(null);
  const [verifying, setVerifying] = useState<number | null>(null);
  const [daily, setDaily] = useState<Quest[]>(dailyQuests);
  const [weekly, setWeekly] = useState<Quest[]>(weeklyQuests);
  const [selectedTab, setSelectedTab] = useState<'daily' | 'weekly'>('daily');
  const [totalEarned, setTotalEarned] = useState({ exp: 12500, tokens: 45000 });

  const refreshQuests = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Randomize quest progress
    setDaily(prev => prev.map(q => ({ ...q, progress: Math.floor(Math.random() * q.target) })));
    setRefreshing(false);
  };

  const verifyQuest = async (questId: number, questType: 'daily' | 'weekly') => {
    if (!isConnected) {
      alert('Please connect your wallet first!');
      return;
    }

    setVerifying(questId);
    
    // Simulate verification (would check blockchain/state in production)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update progress to max
    if (questType === 'daily') {
      setDaily(prev => prev.map(q => q.id === questId ? { ...q, progress: q.target } : q));
    } else {
      setWeekly(prev => prev.map(q => q.id === questId ? { ...q, progress: q.target } : q));
    }
    
    setVerifying(null);
  };

  const claimQuest = async (quest: Quest) => {
    if (quest.progress < quest.target) {
      alert('Quest not completed yet!');
      return;
    }

    setClaiming(quest.id);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Add rewards
    setTotalEarned(prev => ({
      exp: prev.exp + quest.expReward,
      tokens: prev.tokens + quest.tokenReward,
    }));
    
    // Mark as claimed (would set completed state in production)
    setClaiming(null);
  };

  const currentQuests = selectedTab === 'daily' ? daily : weekly;
  const completedCount = currentQuests.filter(q => q.progress >= q.target).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-white/5 py-6">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-400 hover:text-white">←</Link>
              <h1 className="text-3xl font-bold text-white">📅 Quests</h1>
            </div>
            <button
              onClick={refreshQuests}
              disabled={refreshing}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-700/50 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            >
              {refreshing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span>Refresh</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl p-3 text-center border border-amber-500/20">
              <p className="text-2xl font-bold text-amber-400">{totalEarned.tokens.toLocaleString()}</p>
              <p className="text-xs text-gray-400">$MNMOON Earned</p>
            </div>
            <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl p-3 text-center border border-blue-500/20">
              <p className="text-2xl font-bold text-blue-400">{totalEarned.exp.toLocaleString()}</p>
              <p className="text-xs text-gray-400">XP Earned</p>
            </div>
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-3 text-center border border-green-500/20">
              <p className="text-2xl font-bold text-green-400">{daily.filter(q => q.progress >= q.target).length}/{daily.length}</p>
              <p className="text-xs text-gray-400">Daily Done</p>
            </div>
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-3 text-center border border-purple-500/20">
              <p className="text-2xl font-bold text-purple-400">{weekly.filter(q => q.progress >= q.target).length}/{weekly.length}</p>
              <p className="text-xs text-gray-400">Weekly Done</p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex space-x-2 mt-6">
            <button
              onClick={() => setSelectedTab('daily')}
              className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center space-x-2 ${
                selectedTab === 'daily'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                  : 'bg-slate-700/50 text-gray-400 hover:text-white'
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>Daily ({completedCount}/{daily.length})</span>
            </button>
            <button
              onClick={() => setSelectedTab('weekly')}
              className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center space-x-2 ${
                selectedTab === 'weekly'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-slate-700/50 text-gray-400 hover:text-white'
              }`}
            >
              <Award className="h-4 w-4" />
              <span>Weekly ({completedCount}/{weekly.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quest List */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="space-y-4">
            {currentQuests.map((quest, index) => {
              const isCompleted = quest.progress >= quest.target;
              const canClaim = isCompleted;

              return (
                <motion.div
                  key={quest.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`relative bg-slate-800/50 rounded-xl p-4 border transition-all ${
                    isCompleted
                      ? 'border-green-500/30 bg-gradient-to-r from-green-500/5 to-emerald-500/5'
                      : 'border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    {/* Quest Icon */}
                    <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${quest.color} flex items-center justify-center text-2xl flex-shrink-0`}>
                      {quest.icon}
                    </div>

                    {/* Quest Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-white">{quest.name}</h3>
                        {isCompleted && (
                          <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-bold">
                            ✓ Complete
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mt-1">{quest.description}</p>

                      {/* Progress Bar */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-white font-medium">{quest.progress}/{quest.target}</span>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${
                              isCompleted
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                : 'bg-gradient-to-r from-amber-500 to-orange-500'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${(quest.progress / quest.target) * 100}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>

                      {/* Rewards */}
                      <div className="flex items-center space-x-4 mt-3">
                        <span className="flex items-center space-x-1 text-amber-400 text-sm">
                          <Coins className="h-3 w-3" />
                          <span>{quest.tokenReward}</span>
                        </span>
                        <span className="flex items-center space-x-1 text-blue-400 text-sm">
                          <Star className="h-3 w-3" />
                          <span>{quest.expReward} XP</span>
                        </span>
                        {quest.energyCost > 0 && (
<span className="flex items-center space-x-1 text-gray-400 text-sm">
                            <span>⚡</span>
                            <span>{quest.energyCost}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-2">
                      {quest.verifyRequired && !isCompleted && (
                        <button
                          onClick={() => verifyQuest(quest.id, selectedTab)}
                          disabled={verifying === quest.id}
                          className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold text-sm hover:bg-blue-500/30 disabled:opacity-50"
                        >
                          {verifying === quest.id ? (
                            <>
                              <Loader2 className="h-3 w-3 animate-spin" />
                              <span>Verifying...</span>
                            </>
                          ) : (
                            <>
                              <Shield className="h-3 w-3" />
                              <span>Verify</span>
                            </>
                          )}
                        </button>
                      )}

                      {quest.verifyUrl && !isCompleted && (
                        <a
                          href={quest.verifyUrl}
                          className="flex items-center justify-center space-x-1 px-4 py-2 rounded-lg bg-slate-700 text-gray-300 font-bold text-sm hover:bg-slate-600"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span>Go</span>
                        </a>
                      )}

                      <button
                        onClick={() => claimQuest(quest)}
                        disabled={!canClaim || claiming === quest.id}
                        className={`flex items-center space-x-1 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                          canClaim
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:opacity-90'
                            : 'bg-slate-700 text-gray-500 cursor-not-allowed'
                        } disabled:opacity-50`}
                      >
                        {claiming === quest.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Check className="h-3 w-3" />
                        )}
                        <span>{canClaim ? 'Claim' : 'Locked'}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Quest Tips */}
          <div className="mt-8 bg-slate-800/50 rounded-xl p-6 border border-white/5">
            <h3 className="text-lg font-bold text-white mb-4">💡 Quest Tips</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start space-x-2">
                <Clock className="h-5 w-5 text-amber-400 flex-shrink-0" />
                <div>
                  <p className="font-bold text-white">Daily Reset</p>
                  <p className="text-gray-400">Quests refresh every day at UTC midnight</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Award className="h-5 w-5 text-purple-400 flex-shrink-0" />
                <div>
                  <p className="font-bold text-white">Weekly Bonus</p>
                  <p className="text-gray-400">Complete all dailies for bonus rewards</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Shield className="h-5 w-5 text-green-400 flex-shrink-0" />
                <div>
                  <p className="font-bold text-white">Verification</p>
                  <p className="text-gray-400">Some quests need verification for rewards</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
