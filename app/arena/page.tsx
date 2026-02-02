'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { Wallet, Trophy, Users, Zap, Shield, Sword, Crown, Star, RefreshCw } from 'lucide-react';

export default function ArenaPage() {
  const { isConnected } = useAccount();
  const [selectedMode, setSelectedMode] = useState<'ranked' | 'tournament' | 'friendly'>('ranked');
  const [battling, setBattling] = useState(false);
  const [battleResult, setBattleResult] = useState<any>(null);

  // Mock arena data
  const arenaModes = [
    { id: 'ranked', name: '🏆 Ranked', icon: '🏆', desc: 'Climb the leaderboard', entry: '50 $MNMOON', prize: '2x + ELO' },
    { id: 'tournament', name: '⚡ Tournament', icon: '⚡', desc: 'Weekly competitions', entry: '100 $MNMOON', prize: '50K $MNMOON pool' },
    { id: 'friendly', name: '🤝 Friendly', icon: '🤝', desc: 'Practice battles', entry: 'Free', prize: 'No rewards' },
  ];

  const topPlayers = [
    { rank: 1, name: 'DragonMaster', elo: 2450, wins: 245, avatar: '🐉' },
    { rank: 2, name: 'BattleKing', elo: 2280, wins: 198, avatar: '👑' },
    { rank: 3, name: 'PokemonPro', elo: 2150, wins: 187, avatar: '⚔️' },
    { rank: 4, name: 'ArenaLegend', elo: 2020, wins: 156, avatar: '🛡️' },
    { rank: 5, name: 'NFTCollector', elo: 1890, wins: 142, avatar: '💎' },
  ];

  const myStats = {
    elo: 1650,
    rank: 234,
    wins: 87,
    losses: 42,
    streak: 5,
  };

  const startBattle = async () => {
    if (!isConnected) {
      alert('Connect wallet first!');
      return;
    }
    setBattling(true);
    setBattleResult(null);
    
    // Simulate battle
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const win = Math.random() > 0.4;
    setBattleResult({
      win,
      earned: win ? 150 : 0,
      exp: win ? 100 : 25,
      newElo: win ? myStats.elo + 25 : myStats.elo - 15,
    });
    setBattling(false);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white">⚔️ Arena PvP</h1>
          <p className="mt-2 text-gray-400">Challenge other players for glory and rewards!</p>
        </div>

        {/* Stats Bar */}
        <div className="grid gap-4 sm:grid-cols-5 mb-8">
          <div className="rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 p-4 border border-amber-500/30">
            <div className="flex items-center space-x-2 text-amber-400">
              <Crown className="h-5 w-5" />
              <span className="text-sm">ELO</span>
            </div>
            <div className="mt-1 text-2xl font-bold text-white">{myStats.elo}</div>
            <div className="text-xs text-gray-400">Rank #{myStats.rank}</div>
          </div>
          <div className="rounded-xl bg-slate-800/50 p-4 border border-white/5">
            <div className="flex items-center space-x-2 text-green-400">
              <Trophy className="h-5 w-5" />
              <span className="text-sm">Wins</span>
            </div>
            <div className="mt-1 text-2xl font-bold text-white">{myStats.wins}</div>
          </div>
          <div className="rounded-xl bg-slate-800/50 p-4 border border-white/5">
            <div className="flex items-center space-x-2 text-red-400">
              <Sword className="h-5 w-5" />
              <span className="text-sm">Losses</span>
            </div>
            <div className="mt-1 text-2xl font-bold text-white">{myStats.losses}</div>
          </div>
          <div className="rounded-xl bg-slate-800/50 p-4 border border-white/5">
            <div className="flex items-center space-x-2 text-blue-400">
              <Zap className="h-5 w-5" />
              <span className="text-sm">Streak</span>
            </div>
            <div className="mt-1 text-2xl font-bold text-white">🔥 {myStats.streak}</div>
          </div>
          <div className="rounded-xl bg-slate-800/50 p-4 border border-white/5">
            <div className="flex items-center space-x-2 text-purple-400">
              <Star className="h-5 w-5" />
              <span className="text-sm">Win Rate</span>
            </div>
            <div className="mt-1 text-2xl font-bold text-white">
              {Math.round((myStats.wins / (myStats.wins + myStats.losses)) * 100)}%
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Arena Modes */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-white">🎯 Choose Battle Mode</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {arenaModes.map((mode) => (
                <motion.button
                  key={mode.id}
                  onClick={() => setSelectedMode(mode.id as any)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-6 rounded-2xl border-2 transition-all text-left ${
                    selectedMode === mode.id
                      ? 'border-amber-500 bg-amber-500/10'
                      : 'border-white/10 bg-slate-800/50 hover:border-white/20'
                  }`}
                >
                  <div className="text-4xl mb-3">{mode.icon}</div>
                  <h3 className="font-bold text-white">{mode.name}</h3>
                  <p className="mt-1 text-sm text-gray-400">{mode.desc}</p>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-amber-400">{mode.entry}</span>
                    <span className="text-green-400">{mode.prize}</span>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Battle Button */}
            <div className="rounded-2xl bg-slate-800/50 border border-white/5 p-8 text-center">
              <div className="mb-6">
                <div className="text-6xl mb-4">⚔️</div>
                <h3 className="text-xl font-bold text-white">
                  {selectedMode === 'ranked' && '🏆 Ranked Battle'}
                  {selectedMode === 'tournament' && '⚡ Tournament Match'}
                  {selectedMode === 'friendly' && '🤝 Friendly Duel'}
                </h3>
                <p className="mt-2 text-gray-400">
                  {selectedMode === 'ranked' && 'Match against players of similar ELO'}
                  {selectedMode === 'tournament' && 'Compete for the weekly prize pool'}
                  {selectedMode === 'friendly' && 'Practice without risking rewards'}
                </p>
              </div>

              {battling ? (
                <div className="space-y-4">
                  <div className="flex justify-center items-center space-x-4">
                    <div className="text-center">
                      <div className="text-4xl">🐉</div>
                      <div className="mt-2 text-white">Your Monster</div>
                      <div className="text-2xl font-bold text-amber-400">1,250</div>
                    </div>
                    <div className="text-4xl font-bold text-gray-500">VS</div>
                    <div className="text-center">
                      <div className="text-4xl">👹</div>
                      <div className="mt-2 text-white">Enemy</div>
                      <div className="text-2xl font-bold text-red-400">1,180</div>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <RefreshCw className="h-8 w-8 animate-spin text-amber-400" />
                  </div>
                  <p className="text-gray-400">Battle in progress...</p>
                </div>
              ) : battleResult ? (
                <div className={`rounded-xl p-6 ${battleResult.win ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
                  <div className={`text-4xl mb-2 ${battleResult.win ? 'text-green-400' : 'text-red-400'}`}>
                    {battleResult.win ? '🎉 Victory!' : '💀 Defeat'}
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-400">Earned</div>
                      <div className="text-xl font-bold text-amber-400">+{battleResult.earned} $MNMOON</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-400">EXP</div>
                      <div className="text-xl font-bold text-purple-400">+{battleResult.exp}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-400">New ELO</div>
                      <div className={`text-xl font-bold ${battleResult.win ? 'text-green-400' : 'text-red-400'}`}>
                        {battleResult.newElo}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setBattleResult(null)}
                    className="mt-4 w-full py-3 rounded-xl bg-slate-700 font-bold text-white hover:bg-slate-600 transition-colors"
                  >
                    Battle Again
                  </button>
                </div>
              ) : (
                <button
                  onClick={startBattle}
                  disabled={!isConnected}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 font-bold text-white text-lg hover:from-amber-400 hover:to-orange-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isConnected ? '⚔️ Start Battle' : '🔗 Connect Wallet to Battle'}
                </button>
              )}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">🏆 Top Players</h2>
            <div className="rounded-2xl bg-slate-800/50 border border-white/5 overflow-hidden">
              {topPlayers.map((player, index) => (
                <div
                  key={player.rank}
                  className={`flex items-center space-x-4 p-4 ${
                    index < 3 ? 'bg-gradient-to-r from-' + ['amber', 'gray', 'orange'][index] + '-500/10' : ''
                  } ${index !== topPlayers.length - 1 ? 'border-b border-white/5' : ''}`}
                >
                  <div className={`text-2xl ${player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : player.rank === 3 ? '🥉' : '#' + player.rank}`}>
                    {player.rank <= 3 ? ['','🥇','🥈','🥉'][player.rank] : `#${player.rank}`}
                  </div>
                  <div className="text-3xl">{player.avatar}</div>
                  <div className="flex-1">
                    <div className="font-bold text-white">{player.name}</div>
                    <div className="text-sm text-gray-400">{player.wins}W</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-amber-400">{player.elo}</div>
                    <div className="text-xs text-gray-500">ELO</div>
                  </div>
                </div>
              ))}
            </div>

            <a href="/rankings" className="block text-center py-3 rounded-xl bg-slate-800/50 text-gray-400 hover:text-white transition-colors">
              View Full Rankings →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
