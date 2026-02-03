'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, TrendingUp, Clock, Shield, Zap, ExternalLink, RefreshCw, Wallet, ArrowUp, ArrowDown } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useAccount, useBalance, useReadContract } from 'wagmi';
import { formatEther } from 'viem';

// $MNMOON Token contract on Base
const MNMOON_TOKEN_ADDRESS = '0x184f03750171f9eF32B6267271a7FEE59cb5F387';

const TOKEN_ABI = [
  {
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
];

// Placeholder - In production, fetch from API/chain
const COIN_INFO = {
  name: '$MNMOON',
  symbol: 'MNMOON',
  totalSupply: 1000000000,
  circulatingSupply: 0,
  price: 0,
  marketCap: 0,
  holders: 0,
  tvl: 0,
  launchDate: 'Coming Soon',
};

const STAKING_POOLS = [
  {
    id: 'flexible',
    name: 'Flexible Pool',
    apy: 5,
    minStake: 100,
    lockPeriod: 0,
    rewards: 'Instant Rewards',
    color: 'from-green-500 to-emerald-500',
    tvl: 0,
    description: 'No lock period, withdraw anytime',
  },
  {
    id: 'basic',
    name: '7-Day Pool',
    apy: 12,
    minStake: 500,
    lockPeriod: 7,
    rewards: 'Daily Rewards',
    color: 'from-blue-500 to-cyan-500',
    tvl: 0,
    description: 'Higher rewards with 7-day lock',
  },
  {
    id: 'premium',
    name: '30-Day Pool',
    apy: 25,
    minStake: 2000,
    lockPeriod: 30,
    rewards: 'Daily Rewards',
    color: 'from-purple-500 to-pink-500',
    tvl: 0,
    description: 'Best APY with 30-day lock',
  },
  {
    id: 'vip',
    name: 'VIP 90-Day Pool',
    apy: 50,
    minStake: 10000,
    lockPeriod: 90,
    rewards: 'Instant + Bonus Rewards',
    color: 'from-amber-500 to-orange-500',
    tvl: 0,
    description: 'Maximum rewards for big stakers',
  },
];

export default function StakingPage() {
  const { isConnected, address } = useAccount();
  const [selectedPool, setSelectedPool] = useState('flexible');
  const [stakedAmount, setStakedAmount] = useState(0);
  const [stakingRewards, setStakingRewards] = useState(0);
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [stakeAmount, setStakeAmount] = useState('');

  // Get native ETH balance
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

  // Calculate real balance
  const mnmoonAmount = mnmoonBalance ? parseFloat(formatEther(mnmoonBalance as bigint)) : 0;

  // Get total supply
  const { data: totalSupply } = useReadContract({
    address: MNMOON_TOKEN_ADDRESS,
    abi: TOKEN_ABI,
    functionName: 'totalSupply',
  });

  const totalSupplyAmount = totalSupply ? parseFloat(formatEther(totalSupply as bigint)) : 0;

  // Simulate rewards accumulation
  useEffect(() => {
    const interval = setInterval(() => {
      if (stakedAmount > 0) {
        const pool = STAKING_POOLS.find(p => p.id === selectedPool);
        if (pool) {
          const dailyRate = pool.apy / 365 / 100;
          setStakingRewards(prev => prev + (stakedAmount * dailyRate / 86400));
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [stakedAmount, selectedPool]);

  const handleStake = () => {
    const amount = parseFloat(stakeAmount);
    if (amount <= 0 || isNaN(amount)) {
      alert('Please enter a valid amount');
      return;
    }

    const pool = STAKING_POOLS.find(p => p.id === selectedPool);
    if (pool && amount < pool.minStake) {
      alert(`Minimum stake is ${pool.minStake.toLocaleString()} $MNMOON`);
      return;
    }

    setStakedAmount(prev => prev + amount);
    setStakingRewards(0);
    setShowStakeModal(false);
    setStakeAmount('');
    alert(`Successfully staked ${amount.toLocaleString()} $MNMOON!`);
  };

  const handleUnstake = () => {
    if (stakedAmount <= 0) return;

    const pool = STAKING_POOLS.find(p => p.id === selectedPool);
    if (pool && pool.lockPeriod > 0) {
      const confirm = window.confirm(
        `This pool has a ${pool.lockPeriod}-day lock period. ` +
        `Early unstaking will forfeit all pending rewards. Continue?`
      );
      if (!confirm) return;
    }

    setStakedAmount(0);
    setStakingRewards(0);
  };

  const claimRewards = () => {
    if (stakingRewards > 0.001) {
      alert(`Claimed ${stakingRewards.toFixed(4)} $MNMOON in rewards!`);
      setStakingRewards(0);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return num.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-white/5 py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-400 hover:text-white">←</Link>
              <h1 className="text-3xl font-bold text-white">🪙 Staking & Coin Info</h1>
            </div>
          </div>

          {/* Coin Info Banner */}
          <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-pink-500/20 rounded-2xl p-6 border border-amber-500/30">
            <div className="flex flex-wrap items-center justify-between gap-6">
              {/* Left: Icon and Name */}
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">M</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">$MNMOON</h2>
                  <p className="text-gray-400">MNMOON Token</p>
                </div>
              </div>

              {/* Right: Stats Grid */}
              <div className="flex flex-wrap gap-6 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-400">${COIN_INFO.price.toFixed(3)}</p>
                  <p className="text-xs text-gray-400">Price</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-400">${formatNumber(COIN_INFO.marketCap)}</p>
                  <p className="text-xs text-gray-400">Market Cap</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-400">{formatNumber(COIN_INFO.holders)}</p>
                  <p className="text-xs text-gray-400">Holders</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-cyan-400">{formatNumber(COIN_INFO.tvl)}</p>
                  <p className="text-xs text-gray-400">TVL</p>
                </div>
              </div>
            </div>

{/* Supply Info */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Supply: {formatNumber(COIN_INFO.circulatingSupply)} / {formatNumber(COIN_INFO.totalSupply)}</span>
                <span className="text-gray-400">Launched: {COIN_INFO.launchDate}</span>
              </div>
              <div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                  style={{ width: `${totalSupplyAmount > 0 ? (COIN_INFO.circulatingSupply / totalSupplyAmount) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Your Staking */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl p-6 border border-amber-500/20"
            >
              <h3 className="text-xl font-bold text-white mb-4">💰 Your Staking</h3>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 rounded-xl bg-slate-800/50">
                  <p className="text-3xl font-bold text-amber-400">{stakedAmount.toLocaleString()}</p>
                  <p className="text-sm text-gray-400">Staked $MNMOON</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-slate-800/50">
                  <p className="text-3xl font-bold text-green-400">{stakingRewards.toFixed(4)}</p>
                  <p className="text-sm text-gray-400">Pending Rewards</p>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowStakeModal(true)}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 font-bold text-white flex items-center justify-center space-x-2"
                >
                  <ArrowUp className="h-4 w-4" />
                  <span>Stake</span>
                </button>
                <button
                  onClick={claimRewards}
                  disabled={stakingRewards <= 0.001}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 font-bold text-white flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Zap className="h-4 w-4" />
                  <span>Claim</span>
                </button>
                <button
                  onClick={handleUnstake}
                  disabled={stakedAmount <= 0}
                  className="py-3 px-4 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 font-bold flex items-center justify-center disabled:opacity-50"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
              </div>
            </motion.div>

            {/* Wallet Sync Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`rounded-2xl p-4 border ${
                isConnected
                  ? 'bg-green-500/10 border-green-500/30'
                  : 'bg-slate-800/50 border-white/5'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  isConnected ? 'bg-green-500/20' : 'bg-slate-700'
                }`}>
                  <Wallet className={`h-5 w-5 ${isConnected ? 'text-green-400' : 'text-gray-400'}`} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-white">
                    {isConnected ? 'Wallet Connected' : 'Wallet Not Connected'}
                  </p>
                  <p className="text-sm text-gray-400">
                    {isConnected
                      ? `Balance: ${mnmoonAmount.toLocaleString()} $MNMOON`
                      : 'Connect wallet to start staking'}
                  </p>
                </div>
                {isConnected && (
                  <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-bold">
                    Synced ✓
                  </span>
                )}
              </div>
            </motion.div>
          </div>

          {/* Staking Pools */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-bold text-white mb-4">🎯 Staking Pools</h3>

              <div className="space-y-4">
                {STAKING_POOLS.map((pool) => (
                  <button
                    key={pool.id}
                    onClick={() => setSelectedPool(pool.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      selectedPool === pool.id
                        ? `border-amber-500 bg-gradient-to-r ${pool.color}/10`
                        : 'border-white/10 bg-slate-800/50 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className={`h-10 w-10 rounded-lg bg-gradient-to-r ${pool.color} flex items-center justify-center`}>
                          <TrendingUp className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-white">{pool.name}</p>
                          <p className="text-xs text-gray-400">{pool.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-400">{pool.apy}%</p>
                        <p className="text-xs text-gray-400">APY</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <span className="text-gray-400">Min: {pool.minStake.toLocaleString()}</span>
                        <span className="text-gray-400 flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{pool.lockPeriod} days</span>
                        </span>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        pool.rewards.includes('Instant')
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {pool.rewards}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Info Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5">
                <Shield className="h-8 w-8 text-blue-400 mb-2" />
                <p className="font-bold text-white">Secure</p>
                <p className="text-xs text-gray-400">Audited contracts</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5">
                <Zap className="h-8 w-8 text-yellow-400 mb-2" />
                <p className="font-bold text-white">Fast</p>
                <p className="text-xs text-gray-400">Instant rewards</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* How it Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-slate-800/50 rounded-2xl p-6 border border-white/5"
        >
          <h3 className="text-xl font-bold text-white mb-6">💡 How Staking Works</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-3">
                <Wallet className="h-6 w-6 text-amber-400" />
              </div>
              <p className="font-bold text-white mb-1">1. Connect Wallet</p>
              <p className="text-sm text-gray-400">Link your Base wallet</p>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-3">
                <ArrowUp className="h-6 w-6 text-blue-400" />
              </div>
              <p className="font-bold text-white mb-1">2. Stake $MNMOON</p>
              <p className="text-sm text-gray-400">Choose a pool and stake</p>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-green-400" />
              </div>
              <p className="font-bold text-white mb-1">3. Earn Rewards</p>
              <p className="text-sm text-gray-400">Get up to 50% APY</p>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-3">
                <Coins className="h-6 w-6 text-purple-400" />
              </div>
              <p className="font-bold text-white mb-1">4. Claim & Enjoy</p>
              <p className="text-sm text-gray-400">Withdraw anytime</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Stake Modal */}
      <AnimatePresence>
        {showStakeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowStakeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-slate-800 rounded-2xl p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-white mb-4">Stake $MNMOON</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Amount to Stake</label>
                  <input
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-4 py-3 rounded-xl bg-slate-700/50 text-white border border-white/10 focus:border-amber-500/50 focus:outline-none"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <button onClick={() => setStakeAmount('100')} className="hover:text-white">100</button>
                    <button onClick={() => setStakeAmount('1000')} className="hover:text-white">1K</button>
                    <button onClick={() => setStakeAmount('10000')} className="hover:text-white">10K</button>
                    <button onClick={() => setStakeAmount(Math.floor(mnmoonAmount).toString())} className="hover:text-white">All</button>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-700/30 text-sm">
                  <div className="flex justify-between text-gray-400 mb-1">
                    <span>Available</span>
                    <span className="text-white">{mnmoonAmount.toLocaleString()} $MNMOON</span>
                  </div>
                  <div className="flex justify-between text-gray-400 mb-1">
                    <span>Pool APY</span>
                    <span className="text-green-400">
                      {STAKING_POOLS.find(p => p.id === selectedPool)?.apy}%
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Lock Period</span>
                    <span className="text-white">
                      {STAKING_POOLS.find(p => p.id === selectedPool)?.lockPeriod} days
                    </span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowStakeModal(false)}
                    className="flex-1 py-3 rounded-xl bg-slate-700 text-white font-bold hover:bg-slate-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleStake}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 font-bold text-white"
                  >
                    Stake
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
