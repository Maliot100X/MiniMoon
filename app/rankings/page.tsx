'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, TrendingUp, Coins, Sword, Star, Search, RefreshCw, Filter, User, ExternalLink, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useAccount } from 'wagmi';
import { formatEther } from 'viem';

type RankingType = 'power' | 'arena' | 'wealth' | 'quests';

interface RankingPlayer {
  rank: number;
  username: string;
  wallet?: string;
  fid?: number;
  farcaster?: string;
  avatar?: number;
  power?: number;
  level?: number;
  badge?: string;
  wins?: number;
  losses?: number;
  elo?: number;
  winRate?: string;
  tokens?: number;
  daily?: number;
  NFTs?: number;
  completed?: number;
  streak?: number;
  points?: number;
}

// Prize information
const PRIZES = {
  power: [
    { place: 1, reward: '$50 USDC', color: 'from-amber-500 to-yellow-500' },
    { place: 2, reward: '$25 USDC', color: 'from-slate-400 to-slate-500' },
    { place: 3, reward: 'Free Hatch + Mythic', color: 'from-orange-600 to-orange-700' },
  ],
};

export default function RankingsPage() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<RankingType>('power');
  const [timeFilter, setTimeFilter] = useState<'all' | 'weekly' | 'daily'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [countdown, setCountdown] = useState(30);

  // Real rankings data - in production, fetch from chain/API
  const [rankings, setRankings] = useState<RankingPlayer[]>([]);
  const [userRank, setUserRank] = useState<{ rank: number; score: number } | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch rankings from chain/API
  const fetchRankings = useCallback(async () => {
    setLoading(true);
    try {
      // In production, fetch real rankings from contract/API
      // For now, show empty state until real data is available
      setRankings([]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching rankings:', error);
      setLoading(false);
    }
  }, []);

  // Fetch user rank
  const fetchUserRank = useCallback(async () => {
    if (!address) {
      setUserRank(null);
      return;
    }
    try {
      // In production, fetch real user rank from chain
      setUserRank(null);
    } catch (error) {
      console.error('Error fetching user rank:', error);
      setUserRank(null);
    }
  }, [address]);

  // Initial fetch
  useEffect(() => {
    fetchRankings();
    fetchUserRank();
  }, [fetchRankings, fetchUserRank]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          handleRefresh();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setCountdown(30);
    await Promise.all([fetchRankings(), fetchUserRank()]);
    setLastUpdated(new Date());
    setIsRefreshing(false);
  };

  const currentRankings = rankings;

  const searchPlayers = useMemo(() => {
    if (!searchQuery.trim()) return currentRankings;
    const query = searchQuery.toLowerCase();
    return currentRankings.filter(
      (player) =>
        player.username?.toLowerCase().includes(query) ||
        player.wallet?.toLowerCase().includes(query) ||
        player.fid?.toString().includes(query) ||
        player.farcaster?.toLowerCase().includes(query)
    );
  }, [currentRankings, searchQuery]);

  const getAvatarUrl = (id: number) => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  };

  const getBadge = (rank: number) => {
    if (rank === 1) return { emoji: '👑', color: 'text-yellow-400' };
    if (rank === 2) return { emoji: '🥈', color: 'text-gray-300' };
    if (rank === 3) return { emoji: '🥉', color: 'text-amber-600' };
    return null;
  };

  const tabIcons: Record<RankingType, React.ReactNode> = {
    power: <Sword className="w-4 h-4" />,
    arena: <TrendingUp className="w-4 h-4" />,
    wealth: <Coins className="w-4 h-4" />,
    quests: <Star className="w-4 h-4" />,
  };

  const tabLabels: Record<RankingType, string> = {
    power: '⚔️ Power',
    arena: '🏆 Arena',
    wealth: '💰 Wealth',
    quests: '✨ Quests',
  };

  const scoreLabels: Record<RankingType, string> = {
    power: 'Power',
    arena: 'ELO',
    wealth: '$MNMOON',
    quests: 'Points',
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="mx-auto max-w-4xl px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white">🏆 Rankings</h1>
              <p className="text-gray-400 text-sm mt-1">Compete for real prizes!</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="text-gray-300 text-sm">{isRefreshing ? 'Refreshing...' : `${countdown}s`}</span>
            </button>
          </div>

          {/* Prize Banner */}
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-pink-500/20 border border-amber-500/30">
            <div className="flex items-center gap-3 mb-3">
              <Trophy className="w-6 h-6 text-amber-400" />
              <h3 className="text-lg font-bold text-white">Weekly Power Rankings</h3>
            </div>
            <div className="flex flex-wrap gap-4">
              {PRIZES.power.map((prize) => (
                <div
                  key={prize.place}
                  className={`flex-1 min-w-[100px] p-3 rounded-xl bg-gradient-to-br ${prize.color} bg-opacity-20 text-center`}
                >
                  <p className="text-xs text-gray-300">#{prize.place}</p>
                  <p className="text-lg font-bold text-white">{prize.reward}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {(Object.keys(tabLabels) as RankingType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                  activeTab === tab
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'bg-slate-800/50 text-gray-400 hover:bg-slate-700/50'
                }`}
              >
                {tabIcons[tab]}
                <span className="text-sm font-medium">{tabLabels[tab]}</span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search by wallet, FID, or FarCaster name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>

          {/* Rankings List */}
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : searchPlayers.length === 0 ? (
                <div className="text-center py-12">
                  <Trophy className="h-16 w-16 mx-auto text-gray-600 mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">
                    {searchQuery ? 'No players found' : 'No rankings yet'}
                  </h3>
                  <p className="text-gray-400">
                    {searchQuery
                      ? 'Try searching with a different wallet, FID, or FarCaster name'
                      : 'Connect your wallet and start playing to appear on the leaderboard!'}
                  </p>
                </div>
              ) : (
                searchPlayers.map((player) => {
                  const badge = getBadge(player.rank);
                  return (
                    <motion.div
                      key={`${player.wallet}-${player.rank}`}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                        player.rank <= 3
                          ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20'
                          : 'bg-slate-800/50 border border-slate-700/30'
                      } ${address?.toLowerCase() === player.wallet?.toLowerCase() ? 'ring-2 ring-cyan-500/50' : ''}`}
                    >
                      <div className={`text-2xl font-bold w-12 text-center ${player.rank <= 3 ? 'text-amber-400' : 'text-gray-400'}`}>
                        #{player.rank}
                      </div>
                      {player.avatar && (
                        <Image
                          src={getAvatarUrl(player.avatar)}
                          alt={player.username}
                          width={48}
                          height={48}
                          className="rounded-lg"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-white truncate">
                            {player.username || 'Unknown Trainer'}
                          </h3>
                          {badge && <span className={`text-xl ${badge.color}`}>{badge.emoji}</span>}
                          {player.farcaster && (
                            <a
                              href={`https://farcaster.xyz/${player.farcaster.replace('@', '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-cyan-400"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                          {player.level && <span>Lvl {player.level}</span>}
                          {player.wallet && (
                            <span className="truncate max-w-[100px]">{player.wallet}</span>
                          )}
                          {player.fid && <span className="flex items-center gap-1">FID: {player.fid}</span>}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-cyan-400">
                          {player.power?.toLocaleString() ||
                            player.elo?.toLocaleString() ||
                            player.tokens?.toLocaleString() ||
                            player.points?.toLocaleString() ||
                            '0'}
                        </p>
                        <p className="text-xs text-gray-500">{scoreLabels[activeTab]}</p>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>

          {/* User Position */}
          {isConnected && userRank && (
            <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400">Your Position</p>
                  <p className="text-2xl font-bold text-white">#{userRank.rank}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400">Your {scoreLabels[activeTab]}</p>
                  <p className="text-2xl font-bold text-cyan-400">{userRank.score.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          {/* User not connected */}
          {isConnected && !userRank && (
            <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-slate-500/10 to-slate-600/10 border border-slate-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400">Your Position</p>
                  <p className="text-2xl font-bold text-white">-</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400">Your {scoreLabels[activeTab]}</p>
                  <p className="text-2xl font-bold text-gray-500">Start playing!</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
