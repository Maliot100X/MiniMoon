'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { useSearchParams } from 'next/navigation';

// Mock FarCaster user data
const getMockUser = (fid: string | null) => {
  if (!fid) return null;
  return {
    fid: parseInt(fid),
    username: 'pokemon_trainer',
    displayName: 'Pokemon Trainer',
    pfp: '🐉',
    bio: 'MiniMoon Champion | Pokemon Fan',
    verified: true,
  };
};

export default function FarCasterPage() {
  const { isConnected, address } = useAccount();
  const searchParams = useSearchParams();
  const fid = searchParams?.get('fid');
  const [farcasterUser, setFarcasterUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (fid) {
        setFarcasterUser(getMockUser(fid));
      } else {
        setFarcasterUser({
          fid: 12345,
          username: 'minimoon_gamer',
          displayName: 'MiniMoon Champion',
          pfp: '🐉',
          bio: 'Playing MiniMoon on Base | Pokemon Fan | Web3 Gamer',
          verified: true,
        });
      }
      setLoading(false);
    };
    checkAuth();
  }, [fid]);

  const quickActions = [
    { name: 'Battle Arena', icon: '⚔️', href: '/arena', color: 'from-red-500 to-orange-500', desc: 'PvP Battles' },
    { name: 'Marketplace', icon: '🏪', href: '/marketplace', color: 'from-amber-500 to-yellow-500', desc: 'Buy & Sell' },
    { name: 'My Profile', icon: '👤', href: '/profile', color: 'from-blue-500 to-cyan-500', desc: 'View Stats' },
    { name: 'Shop', icon: '🛒', href: '/marketplace?tab=shop', color: 'from-purple-500 to-pink-500', desc: 'Items' },
  ];

  const featuredMonsters = [
    { name: 'Charizard', emoji: '🐉', power: 500, rarity: 'Rare' },
    { name: 'Pikachu', emoji: '⚡', power: 120, rarity: 'Common' },
    { name: 'Gengar', emoji: '😈', power: 500, rarity: 'Epic' },
    { name: 'Dragonite', emoji: '🐲', power: 600, rarity: 'Epic' },
    { name: 'Mewtwo', emoji: '🧬', power: 1000, rarity: 'Legendary' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-white/5 py-4">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🦪</span>
            <h1 className="text-xl font-bold text-white">MiniMoon on FarCaster</h1>
          </div>
          <Link href="/" className="text-gray-400 hover:text-white text-sm">
            Full Site
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Connecting to Warpcast...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* User Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/50 rounded-2xl p-6 border border-white/5"
            >
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-amber-500 to-pink-500 flex items-center justify-center text-4xl">
                  {farcasterUser?.pfp || '🐉'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-bold text-white">{farcasterUser?.displayName}</h2>
                    {farcasterUser?.verified && (
                      <span className="text-blue-400">✓</span>
                    )}
                  </div>
                  <p className="text-purple-400">@{farcasterUser?.username}</p>
                  <p className="text-sm text-gray-400">FID: {farcasterUser?.fid}</p>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={action.href}
                    className="block p-4 rounded-xl bg-slate-800/50 border border-white/5 hover:border-white/20 transition-all"
                  >
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center mb-2`}>
                      <span className="text-2xl">{action.icon}</span>
                    </div>
                    <h3 className="font-bold text-white">{action.name}</h3>
                    <p className="text-xs text-gray-400">{action.desc}</p>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Featured Monsters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-800/50 rounded-2xl p-6 border border-white/5"
            >
              <h3 className="text-lg font-bold text-white mb-4">Featured Monsters</h3>
              <div className="grid grid-cols-5 gap-2">
                {featuredMonsters.map((monster) => (
                  <div
                    key={monster.name}
                    className="text-center p-3 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 transition-colors cursor-pointer"
                  >
                    <div className="text-3xl mb-1">{monster.emoji}</div>
                    <div className="text-xs text-white truncate">{monster.name}</div>
                    <div className="text-xs text-amber-400">⚔️ {monster.power}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Subscription CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-r from-amber-500/20 to-pink-500/20 rounded-2xl p-6 border border-amber-500/30"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">MiniMoon Premium</h3>
                  <p className="text-sm text-gray-300">$1/24h or $20/month - Exclusive perks!</p>
                </div>
                <Link
                  href="/subscription"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 font-bold text-white"
                >
                  Subscribe
                </Link>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-slate-800/50 rounded-2xl p-6 border border-white/5"
            >
              <h3 className="text-lg font-bold text-white mb-4">Your Stats</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-amber-400">7</div>
                  <div className="text-sm text-gray-400">Monsters</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-400">3,450</div>
                  <div className="text-sm text-gray-400">Total Power</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">156</div>
                  <div className="text-sm text-gray-400">Battle Wins</div>
                </div>
              </div>
            </motion.div>

            {/* Footer */}
            <div className="text-center text-gray-500 text-sm py-4">
              <p>Playing on Base Chain • Powered by MiniMoon</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
