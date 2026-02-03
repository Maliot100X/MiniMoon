'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount, useBalance, useReadContract } from 'wagmi';
import { Settings, Copy, ExternalLink, Wallet, TrendingUp, DollarSign } from 'lucide-react';
import Inventory from '@/components/Inventory';
import { formatEther } from 'viem';

// $MNMOON Token contract on Base
const MNMOON_TOKEN_ADDRESS = '0x184f03750171f9eF32B6267271a7FEE59cb5F387';

// Token ABI
const TOKEN_ABI = [
  {
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
];

export default function ProfilePage() {
  const { isConnected, address } = useAccount();
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState('Playing MiniMoon on Base | Pokemon Trainer | Web3 Gamer');
  const [selectedAvatar, setSelectedAvatar] = useState(6);
  const [selectedBackground, setSelectedBackground] = useState(0);
  const [showHoldings, setShowHoldings] = useState(false);
  const [realData, setRealData] = useState({
    power: 0,
    wins: 0,
    losses: 0,
    monsters: 0,
    level: 1,
    rank: 0,
  });

  // Get native ETH balance from Base
  const { data: ethBalance } = useBalance({
    address,
    chainId: 8453,
  });

  // Get $MNMOON balance from contract
  const { data: mnmoonBalance } = useReadContract({
    address: MNMOON_TOKEN_ADDRESS,
    abi: TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address && isConnected },
  });

  // Calculate real values
  const mnmoonAmount = mnmoonBalance ? parseFloat(formatEther(mnmoonBalance as bigint)) : 0;
  const ethAmount = ethBalance ? parseFloat(ethBalance.formatted) : 0;
  const portfolioValue = (mnmoonAmount * 0.015) + (ethAmount * 3000);

  // Load real user data from chain/localStorage
  useEffect(() => {
    if (isConnected && address) {
      // In production, fetch real data from chain
      const savedData = localStorage.getItem(`minimoon_${address}`);
      if (savedData) {
        setRealData(JSON.parse(savedData));
      }
    }
  }, [isConnected, address]);

  const backgrounds = [
    { name: 'Volcanic', color: 'from-red-600 to-orange-700', icon: '🌋' },
    { name: 'Ocean', color: 'from-blue-600 to-cyan-700', icon: '🌊' },
    { name: 'Forest', color: 'from-green-600 to-emerald-700', icon: '🌲' },
    { name: 'Sky', color: 'from-sky-600 to-indigo-700', icon: '☁️' },
    { name: 'Twilight', color: 'from-purple-600 to-pink-700', icon: '🌅' },
    { name: 'Space', color: 'from-slate-900 to-purple-900', icon: '🌌' },
  ];

  const avatars = [6, 9, 25, 94, 149, 150, 130, 282, 143, 65, 59, 68];

  const getAvatarUrl = (id: number) => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  };

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      alert('Address copied!');
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen py-8">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-center justify-center p-12 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-slate-700/50">
            <div className="text-6xl mb-4">👤</div>
            <h3 className="text-xl font-bold text-white mb-2">Connect Wallet</h3>
            <p className="text-slate-400 text-center">Connect your Base wallet to view your profile</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl overflow-hidden mb-8"
        >
          <div className={`h-48 bg-gradient-to-r ${backgrounds[selectedBackground].color} relative`}>
            <div className="absolute top-4 right-4 flex items-center space-x-2 px-3 py-1 rounded-full bg-black/30">
              <span className="text-sm">Lv.{realData.level}</span>
            </div>
          </div>

          <div className="bg-slate-800/50 p-8 relative">
            <div className="flex flex-col md:flex-row md:items-end -mt-20 mb-6 space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                <div className="h-32 w-32 rounded-2xl bg-gradient-to-br from-amber-500 to-pink-500 flex items-center justify-center shadow-2xl">
                  <Image
                    src={getAvatarUrl(selectedAvatar)}
                    alt="Avatar"
                    width={120}
                    height={120}
                    className="object-contain"
                  />
                </div>
                <button
                  onClick={() => setEditing(!editing)}
                  className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-slate-700 border-2 border-slate-800 flex items-center justify-center text-white hover:bg-slate-600 transition-colors"
                >
                  <Settings className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h1 className="text-3xl font-bold text-white">
                    {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Trainer'}
                  </h1>
                </div>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                  <span>Level {realData.level}</span>
                  <span>•</span>
                  <span>Base Chain</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={copyAddress}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 font-bold text-white hover:opacity-90 transition-opacity flex items-center space-x-2"
                >
                  <Copy className="h-5 w-5" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Bio */}
            <div className="mt-4">
              {editing ? (
                <div className="space-y-3">
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full p-4 rounded-xl bg-slate-700/50 text-white border border-white/10 focus:border-amber-500/50 focus:outline-none"
                    rows={2}
                  />
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setEditing(false)}
                      className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 font-medium"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="px-4 py-2 rounded-lg bg-slate-700 text-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-300">{bio}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6 mb-8">
          {[
            { icon: '🐉', label: 'Monsters', value: realData.monsters, color: 'text-purple-400' },
            { icon: '💪', label: 'Power', value: realData.power.toLocaleString(), color: 'text-red-400' },
            { icon: '⚔️', label: 'Wins', value: realData.wins, color: 'text-green-400' },
            { icon: '💀', label: 'Losses', value: realData.losses, color: 'text-gray-400' },
            { icon: '💰', label: 'Tokens', value: `${mnmoonAmount.toLocaleString()} $MNMOON`, color: 'text-amber-400' },
            { icon: '🏆', label: 'Rank', value: realData.rank > 0 ? `#${realData.rank}` : 'Unranked', color: 'text-amber-400' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-xl bg-slate-800/50 border border-white/5 p-4 text-center"
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Real Holdings Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-2xl bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-indigo-500/30 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Wallet className="h-5 w-5 text-indigo-400" />
              Real Holdings on Base
            </h2>
            <button
              onClick={() => setShowHoldings(!showHoldings)}
              className="px-4 py-2 rounded-lg bg-indigo-500/20 text-indigo-400 text-sm font-medium hover:bg-indigo-500/30 transition-colors"
            >
              {showHoldings ? 'Hide' : 'Show'} Holdings
            </button>
          </div>

          <AnimatePresence>
            {showHoldings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {/* Total Portfolio Value */}
                <div className="mb-6 p-4 rounded-xl bg-black/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Total Portfolio Value</div>
                        <div className="text-2xl font-bold text-white">${portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-green-400">
                      <TrendingUp className="h-5 w-5" />
                      <span className="font-medium">Live</span>
                    </div>
                  </div>
                </div>

                {/* Token Holdings */}
                <div className="grid gap-3 sm:grid-cols-2">
                  {/* Native ETH */}
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-black/20 border border-white/10">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-2xl">
                      Ξ
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-400">Base ETH</div>
                      <div className="text-lg font-bold text-white">
                        {ethAmount.toFixed(4)} ETH
                      </div>
                      <div className="text-xs text-gray-500">
                        ~${(ethAmount * 3000).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* $MNMOON */}
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-black/20 border border-amber-500/30">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                      <span className="text-white font-bold">M</span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-400">$MNMOON</div>
                      <div className="text-lg font-bold text-white">
                        {mnmoonAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })} tokens
                      </div>
                      <div className="text-xs text-gray-500">
                        ~${(mnmoonAmount * 0.015).toFixed(2)}
                      </div>
                    </div>
                    <a
                      href={`https://basescan.org/token/${MNMOON_TOKEN_ADDRESS}?a=${address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </a>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <a
                    href={`https://basescan.org/address/${address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    View all on Basescan
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Inventory */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Inventory showHeader={true} />
        </motion.div>

        {/* Quick Links */}
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            { name: 'My Monsters', icon: '🐉', href: '/dungeons', color: 'from-purple-500 to-pink-500' },
            { name: 'Marketplace', icon: '🏪', href: '/marketplace', color: 'from-amber-500 to-yellow-500' },
            { name: 'Arena Battles', icon: '⚔️', href: '/arena', color: 'from-red-500 to-orange-500' },
            { name: 'AFK Hatch', icon: '🥚', href: '/afk', color: 'from-blue-500 to-cyan-500' },
          ].map((link, index) => (
            <motion.a
              key={link.name}
              href={link.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex flex-col items-center p-6 rounded-xl bg-slate-800/50 border border-white/5 hover:border-white/20 transition-all group"
            >
              <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform`}>
                {link.icon}
              </div>
              <span className="font-medium text-white group-hover:text-amber-400 transition-colors">{link.name}</span>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
}
