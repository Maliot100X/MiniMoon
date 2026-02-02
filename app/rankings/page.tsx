'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, TrendingUp, Coins, Sword, Star, Search, RefreshCw, Filter, User, ExternalLink, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useAccount } from 'wagmi';

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

const rankings: Record<string, RankingPlayer[]> = {
  power: [
    { rank: 1, username: 'DragonMaster', wallet: '0x1234...5678', farcaster: '@dragonmaster', avatar: 150, power: 15420, level: 88, badge: '👑' },
    { rank: 2, username: 'PokemonKing', wallet: '0xabcd...efgh', farcaster: '@pokeking', avatar: 6, power: 14850, level: 85, badge: '⭐' },
    { rank: 3, username: 'BattlePro', wallet: '0x9876...5432', farcaster: '@battlepro', avatar: 68, power: 14200, level: 82, badge: '⚔️' },
    { rank: 4, username: 'Collector99', avatar: 149, power: 13500, level: 78, badge: '📚' },
    { rank: 5, username: 'ShadowHunter', avatar: 491, power: 12800, level: 75, badge: '🌑' },
    { rank: 6, username: 'AquaLegend', avatar: 130, power: 12100, level: 72, badge: '🌊' },
    { rank: 7, username: 'ThunderBolt', avatar: 25, power: 11500, level: 69, badge: '⚡' },
    { rank: 8, username: 'MysticMage', avatar: 282, power: 10900, level: 66, badge: '🧙' },
    { rank: 9, username: 'FireStorm', avatar: 257, power: 10300, level: 63, badge: '🔥' },
    { rank: 10, username: 'IceKing', avatar: 144, power: 9800, level: 60, badge: '❄️' },
  ],
  arena: [
    { rank: 1, username: 'ArenaGod', farcaster: '@arenagod', avatar: 149, wins: 999, losses: 12, elo: 2850, winRate: '98.8%' },
    { rank: 2, username: 'PvPChampion', farcaster: '@pvpchamp', avatar: 68, wins: 856, losses: 45, elo: 2720, winRate: '95.0%' },
    { rank: 3, username: 'BattleMaster', farcaster: '@battlemaster', avatar: 150, wins: 742, losses: 67, elo: 2580, winRate: '91.7%' },
    { rank: 4, username: 'FighterPro', avatar: 257, wins: 689, losses: 89, elo: 2450, winRate: '88.5%' },
    { rank: 5, username: 'TournamentKing', avatar: 384, wins: 612, losses: 102, elo: 2320, winRate: '85.7%' },
  ],
  wealth: [
    { rank: 1, username: 'CryptoKing', wallet: '0xking...0001', avatar: 150, tokens: 2500000, daily: 15000, NFTs: 156 },
    { rank: 2, username: 'TokenMillionaire', avatar: 6, tokens: 1850000, daily: 12000, NFTs: 142 },
    { rank: 3, username: 'MarketTycoon', avatar: 149, tokens: 1420000, daily: 9800, NFTs: 128 },
    { rank: 4, username: 'DiamondHands', avatar: 130, tokens: 1180000, daily: 8500, NFTs: 115 },
    { rank: 5, username: 'WealthyTrainer', avatar: 25, tokens: 950000, daily: 7200, NFTs: 98 },
  ],
  quests: [
    { rank: 1, username: 'QuestMaster', farcaster: '@questmaster', avatar: 282, completed: 2847, streak: 156, points: 142350 },
    { rank: 2, username: 'DailyGrinder', avatar: 257, completed: 2456, streak: 89, points: 122800 },
    { rank: 3, username: 'AchievementHunter', avatar: 94, completed: 2123, streak: 67, points: 106150 },
    { rank: 4, username: 'TaskDestroyer', avatar: 68, completed: 1890, streak: 45, points: 94500 },
    { rank: 5, username: 'MissionCompleted', avatar: 9, completed: 1656, streak: 34, points: 82800 },
  ],
};

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

  const currentRankings = rankings[activeTab];

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

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    // Simulate fetching fresh data
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLastUpdated(new Date());
    setIsRefreshing(false);
  }, []);

  const getAvatarUrl = (id?: number) => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id || 1}.png`;
  };

  const tabs = [
    { key: 'power', label: '⚔️ Power', icon: Sword },
    { key: 'arena', label: '🏆 Arena', icon: Trophy },
    { key: 'wealth', label: '💰 Wealth', icon: Coins },
    { key: 'quests', label: '📅 Quests', icon: Star },
  ];

  const getPlayerScore = (player: RankingPlayer) => {
    if (activeTab === 'power') return player.power?.toLocaleString() || '0';
    if (activeTab === 'arena') return `${player.elo} ELO`;
    if (activeTab === 'wealth') return `${player.tokens?.toLocaleString()} $MNMOON`;
    return `${player.points?.toLocaleString()} pts`;
  };

  // Search players by wallet, FID, or FarCaster name
  const searchPlayers = useMemo(() => {
    if (!searchQuery.trim()) return currentRankings;
    const query = searchQuery.toLowerCase();
    return currentRankings.filter(
      (player) =>
        player.username.toLowerCase().includes(query) ||
        player.wallet?.toLowerCase().includes(query) ||
        player.farcaster?.toLowerCase().includes(query) ||
        player.fid?.toString().includes(query)
    );
  }, [currentRankings, searchQuery]);

  const formatLastUpdated = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="bg-slate-800/50 border-b border-white/5 py-6">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-400 hover:text-white">←</Link>
              <h1 className="text-3xl font-bold text-white">🏆 Global Rankings</h1>
            </div>
            <div className="flex items-center space-x-2">
              {/* Auto-refresh toggle */}
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  autoRefresh
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-slate-700/50 text-gray-400 border border-white/10'
                }`}
              >
                <Clock className="h-3 w-3" />
                <span>{autoRefresh ? `${countdown}s` : 'Off'}</span>
              </button>
              {/* Manual refresh */}
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* User Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by wallet, FID, or FarCaster name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-700/50 text-white text-sm placeholder-gray-400 border border-white/10 focus:border-amber-500/50 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Search results indicator */}
          {searchQuery && (
            <div className="mb-4 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm">
              Found {searchPlayers.length} player{searchPlayers.length !== 1 ? 's' : ''} matching "{searchQuery}"
            </div>
          )}

          <div className="flex space-x-2 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key as RankingType);
                  setSearchQuery('');
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                    : 'bg-slate-700/50 text-gray-400 hover:text-white'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {activeTab !== 'arena' && (
            <div className="flex space-x-2 mt-4">
              {(['all', 'weekly', 'daily'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTimeFilter(filter)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    timeFilter === filter
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          )}

          {/* Last updated indicator */}
          <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
            <span>Last updated: {formatLastUpdated(lastUpdated)}</span>
            <span>{currentRankings.length} players</span>
          </div>
        </div>
      </div>

      {/* Prize Info Banner */}
      {activeTab === 'power' && (
        <div className="bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-amber-500/10 border-b border-amber-500/20 py-3">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-center space-x-6">
              {PRIZES.power.map((prize) => (
                <div key={prize.place} className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs font-bold bg-gradient-to-r ${prize.color} text-white`}>
                    #{prize.place}
                  </span>
                  <span className="text-sm text-amber-400">{prize.reward}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          key={`${activeTab}-${searchQuery}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {searchPlayers.length >= 3 && !searchQuery && (
            <div className="flex justify-center items-end space-x-4 mb-8">
              {[1, 0, 2].map((idx) => {
                const player = searchPlayers[idx];
                if (!player) return null;
                return (
                  <motion.div
                    key={player.rank}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="text-center"
                  >
                    <div className="relative mb-2">
                      {idx === 0 && <div className="absolute -inset-2 bg-amber-500/30 rounded-full blur-lg" />}
                      <Image
                        src={getAvatarUrl(player.avatar)}
                        alt={player.username}
                        width={idx === 0 ? 96 : idx === 1 ? 64 : 56}
                        height={idx === 0 ? 96 : idx === 1 ? 64 : 56}
                        className="object-contain mx-auto relative"
                      />
                      <div className={`absolute -top-2 -right-2 h-8 w-8 rounded-full flex items-center justify-center text-lg font-bold ${
                        idx === 0 ? 'bg-amber-500 text-white' :
                        idx === 1 ? 'bg-slate-400 text-slate-800' :
                        'bg-orange-700 text-white'
                      }`}>
                        {['🥇', '🥈', '🥉'][idx]}
                      </div>
                    </div>
                    <p className={`font-bold ${idx === 0 ? 'text-amber-400 text-lg' : 'text-white text-sm'}`}>
                      {player.username}
                    </p>
                    <p className="text-gray-400 text-xs">{getPlayerScore(player)}</p>
                    {player.farcaster && (
                      <p className="text-xs text-purple-400 mt-1">{player.farcaster}</p>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}

          <div className="space-y-2">
            {searchPlayers.map((player, index) => (
              <motion.div
                key={player.rank}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`flex items-center p-4 rounded-xl bg-slate-800/50 border border-white/5 hover:border-white/10 transition-all ${
                  player.rank <= 3 ? 'border-amber-500/30' : ''
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 ${
                  player.rank === 1 ? 'bg-amber-500/20 text-amber-400' :
                  player.rank === 2 ? 'bg-slate-400/20 text-slate-300' :
                  player.rank === 3 ? 'bg-orange-700/20 text-orange-500' :
                  'bg-slate-700 text-gray-400'
                }`}>
                  {player.rank <= 3 ? ['🥇', '🥈', '🥉'][player.rank - 1] : player.rank}
                </div>

                <Image
                  src={getAvatarUrl(player.avatar)}
                  alt={player.username}
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain mr-4"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="font-bold text-white truncate">{player.username}</p>
                    {player.badge && <span>{player.badge}</span>}
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-400">
                    {player.level && <span>Level {player.level}</span>}
                    {player.farcaster && <span className="text-purple-400">{player.farcaster}</span>}
                    {player.wallet && <span className="text-blue-400">{player.wallet}</span>}
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold text-white">{getPlayerScore(player)}</p>
                  {activeTab === 'wealth' && player.daily && (
                    <p className="text-sm text-green-400">+{player.daily?.toLocaleString()}/day</p>
                  )}
                  {activeTab === 'quests' && player.completed && (
                    <p className="text-sm text-gray-400">{player.completed?.toLocaleString()} completed</p>
                  )}
                  {activeTab === 'arena' && player.winRate && (
                    <p className="text-sm text-green-400">{player.winRate} WR</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {searchPlayers.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <User className="h-16 w-16 mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No players found</h3>
              <p className="text-gray-400">Try searching with a different wallet, FID, or FarCaster name</p>
            </div>
          )}

          <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">Your Position</p>
                <p className="text-2xl font-bold text-white">#234</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400">Your Score</p>
                <p className="text-2xl font-bold text-amber-400">8,450 ⚔️</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
