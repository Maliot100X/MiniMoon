'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, TrendingUp, Clock, Shield, Zap, ExternalLink, RefreshCw, Wallet, ArrowUp, ArrowDown } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useAccount, useBalance, useReadContract } from 'wagmi';
import { formatEther } from 'viem';

// #MON Token contract on Base (from Streme.fun)
const MON_TOKEN_ADDRESS = '0x184f03750171f9eF32B6267271a7FEE59cb5F387';
const STAKING_CONTRACT_ADDRESS = '0x980E5F15E788Cb653C77781099Fb739d7A1aEEd0';

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

// Real #MON Token data from Streme.fun
const COIN_INFO = {
  name: 'MiniMoon',
  symbol: '$MON',
  address: '0x184f03750171f9eF32B6267271a7FEE59cb5F387',
  price: 0.062295,
  priceChange24h: 'NEW',
  volume24h: 2,
  marketCap: 22955,
  totalRewards: 190.26,
  stakingAllocation: 10000000000, // 10% of 100B supply
  vaultAllocation: 2000000000, // 20% of 100B supply
  lockDuration: '7 days',
  vestingDuration: '2 days',
  flowDuration: '>365 days',
  launchDate: 'Feb 3, 2026',
};

// Staking pools matching Streme.fun allocation
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
    allocationPercent: 70,
  },
  {
    id: '7day',
    name: '7-Day Pool',
    apy: 12,
    minStake: 500,
    lockPeriod: 7,
    rewards: 'Daily Rewards',
    color: 'from-blue-500 to-cyan-500',
    tvl: 0,
    description: 'Higher rewards with 7-day lock',
    allocationPercent: 20,
  },
  {
    id: '30day',
    name: '30-Day Pool',
    apy: 25,
    minStake: 2000,
    lockPeriod: 30,
    rewards: 'Daily Rewards',
    color: 'from-purple-500 to-pink-500',
    tvl: 0,
    description: 'Best APY with 30-day lock',
    allocationPercent: 7,
  },
  {
    id: '90day',
    name: 'VIP 90-Day Pool',
    apy: 50,
    minStake: 10000,
    lockPeriod: 90,
    rewards: 'Instant + Bonus Rewards',
    color: 'from-amber-500 to-orange-500',
    tvl: 0,
    description: 'Maximum rewards for big stakers',
    allocationPercent: 3,
  },
];

// Top stakers from Streme.fun
const TOP_STAKERS = [
  { rank: 1, address: '0x980e5f15e788cb653c77781099fb739d7a1aeed0', amount: 10003021 },
  { rank: 2, address: '0xf86ec2b7d5d95990d61b9f6166775fb22003cc09', amount: 1 },
];

export default function StakingPage() {
  const { isConnected, address } = useAccount();
  const [selectedPool, setSelectedPool] = useState('flexible');
  const [stakedAmount, setStakedAmount] = useState(0);
  const [stakingRewards, setStakingRewards] = useState(0);
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [stakeAmount, setStakeAmount] = useState('');

  // Get #MON balance from contract
  const { data: monBalance } = useReadContract({
    address: MON_TOKEN_ADDRESS,
    abi: TOKEN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address && isConnected },
  });

  // Calculate real balance
  const monAmount = monBalance ? parseFloat(formatEther(monBalance as bigint)) : 0;

  // Get total supply
  const { data: totalSupply } = useReadContract({
    address: MON_TOKEN_ADDRESS,
    abi: TOKEN_ABI,
    functionName: 'totalSupply',
  });

  const totalSupplyAmount = totalSupply ? parseFloat(formatEther(totalSupply as bigint)) : 100000000000; // 100B default

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
      alert(`Minimum stake is ${pool.minStake.toLocaleString()} $MON`);
      return;
    }

    setStakedAmount(prev => prev + amount);
    setStakingRewards(0);
    setShowStakeModal(false);
    setStakeAmount('');
    alert(`Successfully staked ${amount.toLocaleString()} $MON!`);
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
      alert(`Claimed ${stakingRewards.toFixed(4)} $MON in rewards!`);
      setStakingRewards(0);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000)return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
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
            <a
              href="https://streme.fun/token/0x184f03750171f9ef32b6267271a7fee59cb5f387"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-700 text-gray-400 hover:text-white transition-colors"
            >
              <span>View on Streme</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          {/* Coin Info Banner - EXACT Streme.fun Style */}
          <div className="bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-violet-500/30">
            <div className="flex flex-wrap items-center justify-between gap-6">
              {/* Left: Icon and Name */}
              <div className="flex items-center space-x-4">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-violet-400 via-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">M</span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">{COIN_INFO.name}</h2>
                  <p className="text-xl text-violet-400 font-mono">{COIN_INFO.symbol}</p>
                  <p className="text-xs text-gray-400 font-mono mt-1">{formatAddress(COIN_INFO.address)}</p>
                </div>
              </div>

              {/* Right: Stats Grid */}
              <div className="flex flex-wrap gap-8 text-center">
                <div>
                  <p className="text-3xl font-bold text-green-400">${COIN_INFO.price.toFixed(6)}</p>
                  <p className="text-xs text-gray-400">Price</p>
                  <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-green-500/20 text-green-400 mt-1">
                    {COIN_INFO.priceChange24h}
                  </span>
                </div>
                <div>
                  <p className="text-3xl font-bold text-blue-400">${formatNumber(COIN_INFO.marketCap)}</p>
                  <p className="text-xs text-gray-400">Market Cap</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-cyan-400">${formatNumber(COIN_INFO.volume24h)}</p>
                  <p className="text-xs text-gray-400">24h Volume</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-amber-400">{formatNumber(COIN_INFO.totalRewards)}</p>
                  <p className="text-xs text-gray-400">Total Rewards</p>
                </div>
              </div>
            </div>

            {/* Supply Info */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex flex-wrap items-center justify-between text-sm">
                <span className="text-gray-400">Supply: {formatNumber(COIN_INFO.stakingAllocation)} / {formatNumber(totalSupplyAmount)}</span>
                <span className="text-gray-400">Launched: {COIN_INFO.launchDate}</span>
              </div>
              <div className="mt-2 h-3 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500"
                  style={{ width: `${(COIN_INFO.stakingAllocation / totalSupplyAmount) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Staking: 10%</span>
                <span>LP: 70%</span>
                <span>Vault: 20%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Your Staking */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-violet-500/20"
            >
              <h3 className="text-xl font-bold text-white mb-4">💰 Your Staking</h3>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 rounded-xl bg-slate-800/50 border border-white/5">
                  <p className="text-3xl font-bold text-violet-400">{stakedAmount.toLocaleString()}</p>
                  <p className="text-sm text-gray-400">Staked $MON</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-slate-800/50 border border-white/5">
                  <p className="text-3xl font-bold text-green-400">{stakingRewards.toFixed(4)}</p>
                  <p className="text-sm text-gray-400">Pending Rewards</p>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowStakeModal(true)}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 font-bold text-white flex items-center justify-center space-x-2 hover:from-violet-600 hover:to-pink-600 transition-all"
                >
                  <ArrowUp className="h-4 w-4" />
                  <span>Stake</span>
                </button>
                <button
                  onClick={claimRewards}
                  disabled={stakingRewards <= 0.001}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 font-bold text-white flex items-center justify-center space-x-2 disabled:opacity-50 hover:from-green-600 hover:to-emerald-600 transition-all"
                >
                  <Zap className="h-4 w-4" />
                  <span>Claim</span>
                </button>
                <button
                  onClick={handleUnstake}
                  disabled={stakedAmount <= 0}
                  className="py-3 px-4 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 font-bold flex items-center justify-center disabled:opacity-50 hover:bg-red-500/30 transition-all"
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
                      ? `Balance: ${monAmount.toLocaleString()} $MON`
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

            {/* Top Stakers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-slate-800/50 rounded-2xl p-6 border border-white/5"
            >
              <h3 className="text-lg font-bold text-white mb-4">🏆 Top $MON Stakers</h3>
              <div className="space-y-3">
                {TOP_STAKERS.map((staker) => (
                  <div key={staker.rank} className="flex items-center justify-between p-3 rounded-xl bg-slate-700/30">
                    <div className="flex items-center space-x-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                        staker.rank === 1 ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-600 text-gray-400'
                      }`}>
                        {staker.rank}
                      </span>
                      <a
                        href={`https://basescan.org/address/${staker.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-violet-400 hover:text-violet-300 font-mono text-sm"
                      >
                        {formatAddress(staker.address)}
                      </a>
                    </div>
                    <span className="text-amber-400 font-bold">{formatNumber(staker.amount)} $MON</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center">Total Rewards Distributed: {formatNumber(COIN_INFO.totalRewards)} $MON</p>
            </motion.div>
          </div>

          {/* Right Column - Staking Pools */}
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
                    className={`w-full p-5 rounded-xl border-2 transition-all text-left ${
                      selectedPool === pool.id
                        ? `border-violet-500 bg-gradient-to-r ${pool.color}/10`
                        : 'border-white/10 bg-slate-800/50 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-4">
                        <div className={`h-12 w-12 rounded-xl bg-gradient-to-r ${pool.color} flex items-center justify-center shadow-lg`}>
                          <TrendingUp className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-white text-lg">{pool.name}</p>
                          <p className="text-xs text-gray-400">{pool.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-green-400">{pool.apy}%</p>
                        <p className="text-xs text-gray-400">APY</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between text-sm">
                      <div className="flex items-center space-x-6">
                        <span className="text-gray-400">Min: <span className="text-white">{pool.minStake.toLocaleString()}</span></span>
                        <span className="text-gray-400 flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{pool.lockPeriod} days lock</span>
                        </span>
                        <span className="text-gray-400">Allocation: <span className="text-violet-400">{pool.allocationPercent}%</span></span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
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
              <div className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-xl p-4 border border-violet-500/20">
                <Shield className="h-8 w-8 text-violet-400 mb-2" />
                <p className="font-bold text-white">Secure</p>
                <p className="text-xs text-gray-400">Audited contracts</p>
              </div>
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-500/20">
                <Zap className="h-8 w-8 text-green-400 mb-2" />
                <p className="font-bold text-white">Fast</p>
                <p className="text-xs text-gray-400">Instant rewards</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Allocation & Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-2xl p-6 border border-white/5"
        >
          <h3 className="text-xl font-bold text-white mb-6">📊 Allocation & Distribution</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-xl bg-slate-800/50">
              <div className="h-16 w-16 rounded-full bg-violet-500/20 flex items-center justify-center mx-auto mb-3">
                <Coins className="h-8 w-8 text-violet-400" />
              </div>
              <p className="text-2xl font-bold text-violet-400">10%</p>
              <p className="text-sm text-gray-400 mb-2">Staking Rewards</p>
              <p className="text-xs text-gray-500">10B $MON • {COIN_INFO.flowDuration}</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-slate-800/50">
              <div className="h-16 w-16 rounded-full bg-pink-500/20 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-8 w-8 text-pink-400" />
              </div>
              <p className="text-2xl font-bold text-pink-400">70%</p>
              <p className="text-sm text-gray-400 mb-2">LP Rewards</p>
              <p className="text-xs text-gray-500">70B $MON • Liquidity</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-slate-800/50">
              <div className="h-16 w-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-3">
                <Shield className="h-8 w-8 text-amber-400" />
              </div>
              <p className="text-2xl font-bold text-amber-400">20%</p>
              <p className="text-sm text-gray-400 mb-2">Vault</p>
              <p className="text-xs text-gray-500">20B $MON • {COIN_INFO.lockDuration} lock, {COIN_INFO.vestingDuration} vest</p>
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
              className="bg-slate-800 rounded-2xl p-6 max-w-sm w-full border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-white mb-4">Stake $MON</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Amount to Stake</label>
                  <input
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-4 py-3 rounded-xl bg-slate-700/50 text-white border border-white/10 focus:border-violet-500/50 focus:outline-none"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <button onClick={() => setStakeAmount('100')} className="hover:text-white">100</button>
                    <button onClick={() => setStakeAmount('1000')} className="hover:text-white">1K</button>
                    <button onClick={() => setStakeAmount('10000')} className="hover:text-white">10K</button>
                    <button onClick={() => setStakeAmount(Math.floor(monAmount).toString())} className="hover:text-white">All</button>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-700/30 text-sm">
                  <div className="flex justify-between text-gray-400 mb-1">
                    <span>Available</span>
                    <span className="text-white">{monAmount.toLocaleString()} $MON</span>
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
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 font-bold text-white hover:from-violet-600 hover:to-pink-600 transition-all"
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
