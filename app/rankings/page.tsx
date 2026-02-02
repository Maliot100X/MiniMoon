'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Coins, Sword, Star } from 'lucide-react';
import Link from 'next/link';

type RankingType = 'power' | 'arena' | 'wealth' | 'quests';

const rankings: Record<string, Array<{
  rank: number;
  username: string;
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
}>> = {
  power: [
    { rank: 1, username: 'DragonMaster', avatar: 150, power: 15420, level: 88, badge: '👑' },
    { rank: 2, username: 'PokemonKing', avatar: 6, power: 14850, level: 85, badge: '⭐' },
    { rank: 3, username: 'BattlePro', avatar: 68, power: 14200, level: 82, badge: '⚔️' },
    { rank: 4, username: 'Collector99', avatar: 149, power: 13500, level: 78, badge: '📚' },
    { rank: 5, username: 'ShadowHunter', avatar: 491, power: 12800, level: 75, badge: '🌑' },
    { rank: 6, username: 'AquaLegend', avatar: 130, power: 12100, level: 72, badge: '🌊' },
    { rank: 7, username: 'ThunderBolt', avatar: 25, power: 11500, level: 69, badge: '⚡' },
    { rank: 8, username: 'MysticMage', avatar: 282, power: 10900, level: 66, badge: '🧙' },
    { rank: 9, username: 'FireStorm', avatar: 257, power: 10300, level: 63, badge: '🔥' },
    { rank: 10, username: 'IceKing', avatar: 144, power: 9800, level: 60, badge: '❄️' },
  ],
  arena: [
    { rank: 1, username: 'ArenaGod', avatar: 149, wins: 999, losses: 12, elo: 2850, winRate: '98.8%' },
    { rank: 2, username: 'PvPChampion', avatar: 68, wins: 856, losses: 45, elo: 2720, winRate: '95.0%' },
    { rank: 3, username: 'BattleMaster', avatar: 150, wins: 742, losses: 67, elo: 2580, winRate: '91.7%' },
    { rank: 4, username: 'FighterPro', avatar: 257, wins: 689, losses: 89, elo: 2450, winRate: '88.5%' },
    { rank: 5, username: 'TournamentKing', avatar: 384, wins: 612, losses: 102, elo: 2320, winRate: '85.7%' },
  ],
  wealth: [
    { rank: 1, username: 'CryptoKing', avatar: 150, tokens: 2500000, daily: 15000, NFTs: 156 },
    { rank: 2, username: 'TokenMillionaire', avatar: 6, tokens: 1850000, daily: 12000, NFTs: 142 },
    { rank: 3, username: 'MarketTycoon', avatar: 149, tokens: 1420000, daily: 9800, NFTs: 128 },
    { rank: 4, username: 'DiamondHands', avatar: 130, tokens: 1180000, daily: 8500, NFTs: 115 },
    { rank: 5, username: 'WealthyTrainer', avatar: 25, tokens: 950000, daily: 7200, NFTs: 98 },
  ],
  quests: [
    { rank: 1, username: 'QuestMaster', avatar: 282, completed: 2847, streak: 156, points: 142350 },
    { rank: 2, username: 'DailyGrinder', avatar: 257, completed: 2456, streak: 89, points: 122800 },
    { rank: 3, username: 'AchievementHunter', avatar: 94, completed: 2123, streak: 67, points: 106150 },
    { rank: 4, username: 'TaskDestroyer', avatar: 68, completed: 1890, streak: 45, points: 94500 },
    { rank: 5, username: 'MissionCompleted', avatar: 9, completed: 1656, streak: 34, points: 82800 },
  ],
};

const rarityColors: Record<string, string> = {
  Common: 'text-gray-400',
  Uncommon: 'text-green-400',
  Rare: 'text-blue-400',
  Epic: 'text-purple-400',
  Legendary: 'text-amber-400',
  Mythic: 'text-red-500',
};

export default function RankingsPage() {
  const [activeTab, setActiveTab] = useState<RankingType>('power');
  const [timeFilter, setTimeFilter] = useState<'all' | 'weekly' | 'daily'>('all');

  const currentRankings = rankings[activeTab];

  const getAvatarUrl = (id?: number) => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id || 1}.png`;
  };

  const tabs = [
    { key: 'power', label: '⚔️ Power', icon: Sword },
    { key: 'arena', label: '🏆 Arena', icon: Trophy },
    { key: 'wealth', label: '💰 Wealth', icon: Coins },
    { key: 'quests', label: '📅 Quests', icon: Star },
  ];

  const getPlayerScore = (player: typeof currentRankings[0]) => {
    if (activeTab === 'power') return player.power?.toLocaleString() || '0';
    if (activeTab === 'arena') return `${player.elo} ELO`;
    if (activeTab === 'wealth') return `${player.tokens?.toLocaleString()} $MNMOON`;
    return `${player.points?.toLocaleString()} pts`;
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
          </div>

          <div className="flex space-x-2 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as RankingType)}
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
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {currentRankings.length >= 3 && (
            <div className="flex justify-center items-end space-x-4 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center"
              >
                <div className="relative mb-2">
                  <img
                    src={getAvatarUrl(currentRankings[1]?.avatar)}
                    alt={currentRankings[1]?.username}
                    className="w-16 h-16 object-contain mx-auto"
                  />
                  <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-slate-600 flex items-center justify-center text-sm">2</div>
                </div>
                <p className="font-bold text-white text-sm">{currentRankings[1]?.username}</p>
                <p className="text-gray-400 text-xs">{getPlayerScore(currentRankings[1])}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <div className="relative mb-2">
                  <div className="absolute -inset-2 bg-amber-500/30 rounded-full blur-lg" />
                  <img
                    src={getAvatarUrl(currentRankings[0]?.avatar)}
                    alt={currentRankings[0]?.username}
                    className="relative w-24 h-24 object-contain mx-auto"
                  />
                  <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-amber-500 flex items-center justify-center text-lg">1</div>
                </div>
                <p className="font-bold text-amber-400 text-lg">{currentRankings[0]?.username}</p>
                <p className="text-gray-400 text-sm">{getPlayerScore(currentRankings[0])}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <div className="relative mb-2">
                  <img
                    src={getAvatarUrl(currentRankings[2]?.avatar)}
                    alt={currentRankings[2]?.username}
                    className="w-14 h-14 object-contain mx-auto"
                  />
                  <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-orange-700 flex items-center justify-center text-sm">3</div>
                </div>
                <p className="font-bold text-white text-sm">{currentRankings[2]?.username}</p>
                <p className="text-gray-400 text-xs">{getPlayerScore(currentRankings[2])}</p>
              </motion.div>
            </div>
          )}

          <div className="space-y-2">
            {currentRankings.map((player, index) => (
              <motion.div
                key={player.rank}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center p-4 rounded-xl bg-slate-800/50 border border-white/5 hover:border-white/10 transition-all ${
                  player.rank <= 3 ? 'border-amber-500/30' : ''
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 ${
                  player.rank === 1 ? 'bg-amber-500/20 text-amber-400' :
                  player.rank === 2 ? 'bg-slate-400/20 text-slate-300' :
                  player.rank === 3 ? 'bg-orange-700/20 text-orange-500' :
                  'bg-slate-700 text-gray-400'
                }`}>
                  {player.rank <= 3 ? ['🥇', '🥈', '🥉'][player.rank - 1] : player.rank}
                </div>

                <img
                  src={getAvatarUrl(player.avatar)}
                  alt={player.username}
                  className="w-12 h-12 object-contain mr-4"
                />

                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <p className="font-bold text-white">{player.username}</p>
                    {player.badge && <span>{player.badge}</span>}
                  </div>
                  {player.level && <p className="text-sm text-gray-400">Level {player.level}</p>}
                  {player.winRate && <p className="text-sm text-gray-400">{player.winRate} win rate</p>}
                </div>

                <div className="text-right">
                  <p className="font-bold text-white">{getPlayerScore(player)}</p>
                  {activeTab === 'wealth' && player.daily && (
                    <p className="text-sm text-green-400">+{player.daily?.toLocaleString()}/day</p>
                  )}
                  {activeTab === 'quests' && player.completed && (
                    <p className="text-sm text-gray-400">{player.completed?.toLocaleString()} completed</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

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
