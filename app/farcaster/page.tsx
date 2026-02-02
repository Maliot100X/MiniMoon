'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import {
  User,
  Wallet,
  Fingerprint,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Copy,
  RefreshCw,
  Trophy,
  Star,
  Zap,
} from 'lucide-react';

export default function FarCasterPage() {
  const { isConnected, address } = useAccount();
  const [farcasterUser, setFarcasterUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Simulated FarCaster user data (in real app, this comes from Neynar or Warpcast SDK)
  const mockFarcasterUser = {
    fid: 12345,
    username: 'minimoon_gamer',
    displayName: 'MiniMoon Champion 🎮',
    pfp: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    bio: 'Playing MiniMoon on Base | Pokemon Fan | Web3 Gamer',
    followers: 1234,
    following: 567,
    custody: '0x7a...3d2e',
    verified: true,
  };

  const connectFarCaster = async () => {
    setLoading(true);
    // In real implementation: use Neynar SDK or Warpcast Auth
    // const { user } = await neynar.authenticate();
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setFarcasterUser(mockFarcasterUser);
    setLoading(false);
  };

  const copyFid = async () => {
    await navigator.clipboard.writeText('12345');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 rounded-full bg-purple-500/10 px-4 py-2 text-sm text-purple-400 border border-purple-500/20 mb-4">
            <span className="text-xl">📱</span>
            <span>FarCaster Mini App</span>
          </div>
          <h1 className="text-4xl font-bold text-white">MiniMoon on FarCaster</h1>
          <p className="mt-4 text-gray-400">
            Play MiniMoon directly from Warpcast! Connect with your FarCaster identity.
          </p>
        </div>

        {/* Features */}
        <div className="grid gap-6 sm:grid-cols-3 mb-12">
          {[
            { icon: '🔗', title: 'FID Auto-Sync', desc: 'Automatically connect using your FID' },
            { icon: '👤', title: 'Profile Sync', desc: 'Use your FarCaster username & avatar' },
            { icon: '💬', title: 'Cast Integration', desc: 'Share achievements to Warpcast' },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-xl bg-slate-800/50 p-6 border border-white/5 text-center"
            >
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="font-bold text-white">{feature.title}</h3>
              <p className="mt-1 text-sm text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Connection Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-slate-800/50 border border-white/5 p-8"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mb-4">
              <span className="text-4xl">🦪</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Connect with FarCaster</h2>
            <p className="mt-2 text-gray-400">
              Sign in with your FarCaster wallet to sync your profile
            </p>
          </div>

          {farcasterUser ? (
            <div className="space-y-6">
              {/* Connected Profile */}
              <div className="flex items-center space-x-6 p-6 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                <img
                  src={farcasterUser.pfp}
                  alt={farcasterUser.displayName}
                  className="h-20 w-20 rounded-full border-2 border-purple-500"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xl font-bold text-white">{farcasterUser.displayName}</h3>
                    {farcasterUser.verified && (
                      <CheckCircle className="h-5 w-5 text-blue-400" />
                    )}
                  </div>
                  <p className="text-purple-400">@{farcasterUser.username}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                    <span className="flex items-center space-x-1">
                      <Fingerprint className="h-4 w-4" />
                      <button onClick={copyFid} className="flex items-center space-x-1 hover:text-white">
                        <span>FID: {farcasterUser.fid}</span>
                        {copied ? <CheckCircle className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
                      </button>
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{farcasterUser.followers}</div>
                  <div className="text-sm text-gray-400">Followers</div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-slate-700/50 p-4 text-center">
                  <Trophy className="h-8 w-8 mx-auto text-amber-400" />
                  <div className="mt-2 text-2xl font-bold text-white">247</div>
                  <div className="text-sm text-gray-400">Battles Won</div>
                </div>
                <div className="rounded-xl bg-slate-700/50 p-4 text-center">
                  <Star className="h-8 w-8 mx-auto text-purple-400" />
                  <div className="mt-2 text-2xl font-bold text-white">1,450</div>
                  <div className="text-sm text-gray-400">Farcaster Points</div>
                </div>
                <div className="rounded-xl bg-slate-700/50 p-4 text-center">
                  <Zap className="h-8 w-8 mx-auto text-blue-400" />
                  <div className="mt-2 text-2xl font-bold text-white">5</div>
                  <div className="text-sm text-gray-400">Monsters</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-4">
                <Link href="/profile" className="flex-1">
                  <button className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 font-bold text-white hover:opacity-90 transition-opacity">
                    View Profile 👤
                  </button>
                </Link>
                <button
                  onClick={() => setFarcasterUser(null)}
                  className="px-6 py-3 rounded-xl bg-slate-700 font-bold text-gray-400 hover:text-white transition-colors"
                >
                  Disconnect
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <button
                onClick={connectFarCaster}
                disabled={loading}
                className="inline-flex items-center space-x-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl">🦪</span>
                    <span>Sign in with FarCaster</span>
                  </>
                )}
              </button>
              <p className="mt-4 text-sm text-gray-400">
                Powered by Neynar SDK • Secure authentication
              </p>
            </div>
          )}
        </motion.div>

        {/* Integration Guide */}
        <div className="mt-12 rounded-2xl bg-slate-800/50 border border-white/5 p-8">
          <h3 className="text-xl font-bold text-white mb-6">🔧 Integration Setup</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                1
              </div>
              <div>
                <h4 className="font-bold text-white">Add to FarCaster Frame</h4>
                <p className="text-gray-400 text-sm">
                  Use this URL in your FarCaster frame: <code className="text-amber-400">https://minimoon.game/farcaster</code>
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                2
              </div>
              <div>
                <h4 className="font-bold text-white">Configure Actions</h4>
                <p className="text-gray-400 text-sm">
                  Set up frame actions for: <code className="text-amber-400">challenge</code>, <code className="text-amber-400">battle</code>, <code className="text-amber-400">trade</code>
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                3
              </div>
              <div>
                <h4 className="font-bold text-white">Enable Cast Integration</h4>
                <p className="text-gray-400 text-sm">
                  Players can share achievements directly to Warpcast from the game
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {[
            { q: 'Is my FarCaster data safe?', a: 'Yes! We only read public information and never post without permission.' },
            { q: 'Can I use without FarCaster?', a: 'Yes! You can connect with MetaMask or Coinbase Wallet directly.' },
            { q: 'Do I need Warpcast app?', a: 'No, you can play from any browser using your FarCaster credentials.' },
            { q: 'How do I share scores?', a: 'Click "Share to Warpcast" after battles to cast your achievements!' },
          ].map((faq, index) => (
            <div key={index} className="rounded-xl bg-slate-800/30 p-6 border border-white/5">
              <h4 className="font-bold text-white">{faq.q}</h4>
              <p className="mt-2 text-gray-400 text-sm">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
