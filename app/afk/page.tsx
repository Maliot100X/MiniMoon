'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount } from 'wagmi';

const DROP_RATES = {
  Mythic: 0.01,      // 1% - $1 drop
  Legendary: 0.04,   // 4%
  Epic: 0.10,        // 10%
  Rare: 0.25,        // 25%
  Uncommon: 0.35,    // 35%
  Common: 0.25,      // 25%
};

const HATCHABLE_POKEMON = [
  { id: 1, name: 'Bulbasaur', type: 'grass', power: 100, rarity: 'Common' },
  { id: 4, name: 'Charmander', type: 'fire', power: 100, rarity: 'Common' },
  { id: 7, name: 'Squirtle', type: 'water', power: 100, rarity: 'Common' },
  { id: 25, name: 'Pikachu', type: 'electric', power: 120, rarity: 'Common' },
  { id: 37, name: 'Vulpix', type: 'fire', power: 80, rarity: 'Common' },
  { id: 54, name: 'Psyduck', type: 'water', power: 85, rarity: 'Common' },
  { id: 129, name: 'Magikarp', type: 'water', power: 20, rarity: 'Common' },
  { id: 133, name: 'Eevee', type: 'normal', power: 110, rarity: 'Common' },
  { id: 2, name: 'Ivysaur', type: 'grass', power: 200, rarity: 'Uncommon' },
  { id: 5, name: 'Charmeleon', type: 'fire', power: 200, rarity: 'Uncommon' },
  { id: 8, name: 'Wartortle', type: 'water', power: 200, rarity: 'Uncommon' },
  { id: 26, name: 'Raichu', type: 'electric', power: 400, rarity: 'Uncommon' },
  { id: 3, name: 'Venusaur', type: 'grass', power: 500, rarity: 'Rare' },
  { id: 6, name: 'Charizard', type: 'fire', power: 500, rarity: 'Rare' },
  { id: 9, name: 'Blastoise', type: 'water', power: 500, rarity: 'Rare' },
  { id: 94, name: 'Gengar', type: 'ghost', power: 500, rarity: 'Rare' },
  { id: 68, name: 'Machamp', type: 'fighting', power: 480, rarity: 'Epic' },
  { id: 149, name: 'Dragonite', type: 'dragon', power: 600, rarity: 'Epic' },
  { id: 144, name: 'Articuno', type: 'ice', power: 900, rarity: 'Legendary' },
  { id: 145, name: 'Zapdos', type: 'electric', power: 900, rarity: 'Legendary' },
  { id: 146, name: 'Moltres', type: 'fire', power: 900, rarity: 'Legendary' },
  { id: 150, name: 'Mewtwo', type: 'psychic', power: 1000, rarity: 'Legendary' },
  { id: 249, name: 'Lugia', type: 'psychic', power: 1200, rarity: 'Mythic' },
  { id: 250, name: 'Ho-Oh', type: 'fire', power: 1200, rarity: 'Mythic' },
  { id: 384, name: 'Rayquaza', type: 'dragon', power: 1300, rarity: 'Mythic' },
  { id: 493, name: 'Arceus', type: 'normal', power: 1500, rarity: 'Mythic' },
];

const STAKING_POOLS = [
  { id: 'basic', name: 'Basic Pool', apy: 5, minStake: 100, lockPeriod: 7, rewards: 'Daily', color: 'from-green-500 to-emerald-500' },
  { id: 'premium', name: 'Premium Pool', apy: 12, minStake: 1000, lockPeriod: 30, rewards: 'Daily', color: 'from-blue-500 to-cyan-500' },
  { id: 'vip', name: 'VIP Pool', apy: 25, minStake: 10000, lockPeriod: 90, rewards: 'Instant', color: 'from-purple-500 to-pink-500' },
];

const typeEmojis: Record<string, string> = {
  fire: '🔥', water: '💧', electric: '⚡', grass: '🌿',
  ice: '❄️', dragon: '🐉', ghost: '👻', fighting: '🥊',
  fairy: '🧚', psychic: '🧠', normal: '⚪', dark: '🌑',
};

const typeColors: Record<string, { bg: string; text: string; gradient: string }> = {
  fire: { bg: 'bg-red-500/20', text: 'text-red-400', gradient: 'from-red-500 to-orange-500' },
  water: { bg: 'bg-blue-500/20', text: 'text-blue-400', gradient: 'from-blue-500 to-cyan-500' },
  electric: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', gradient: 'from-yellow-500 to-amber-500' },
  grass: { bg: 'bg-green-500/20', text: 'text-green-400', gradient: 'from-green-500 to-emerald-500' },
  dragon: { bg: 'bg-purple-500/20', text: 'text-purple-400', gradient: 'from-purple-500 to-pink-500' },
  ghost: { bg: 'bg-indigo-500/20', text: 'text-indigo-400', gradient: 'from-indigo-500 to-purple-500' },
  fighting: { bg: 'bg-orange-500/20', text: 'text-orange-400', gradient: 'from-orange-500 to-red-500' },
  psychic: { bg: 'bg-fuchsia-500/20', text: 'text-fuchsia-400', gradient: 'from-fuchsia-500 to-pink-500' },
  normal: { bg: 'bg-gray-500/20', text: 'text-gray-400', gradient: 'from-gray-500 to-slate-500' },
};

const rarityColors: Record<string, { text: string; border: string; glow: string, bg: string }> = {
  Common: { text: 'text-gray-400', border: 'border-gray-400', glow: 'shadow-gray-400/20', bg: 'bg-gray-500/20' },
  Uncommon: { text: 'text-green-400', border: 'border-green-400', glow: 'shadow-green-400/20', bg: 'bg-green-500/20' },
  Rare: { text: 'text-blue-400', border: 'border-blue-400', glow: 'shadow-blue-400/20', bg: 'bg-blue-500/20' },
  Epic: { text: 'text-purple-400', border: 'border-purple-400', glow: 'shadow-purple-400/20', bg: 'bg-purple-500/20' },
  Legendary: { text: 'text-amber-400', border: 'border-amber-400', glow: 'shadow-amber-400/20', bg: 'bg-amber-500/20' },
  Mythic: { text: 'text-red-500', border: 'border-red-500', glow: 'shadow-red-500/30', bg: 'bg-red-500/30' },
};

export default function AFKPage() {
  const { isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<'farming' | 'staking'>('farming');
  const [isFarming, setIsFarming] = useState(false);
  const [energy, setEnergy] = useState(100);
  const [eggs, setEggs] = useState(5);
  const [hatchingPokemon, setHatchingPokemon] = useState<any>(null);
  const [showHatchModal, setShowHatchModal] = useState(false);
  const [inventory, setInventory] = useState<any[]>([]);
  const [farmingTime, setFarmingTime] = useState(0);
  const [dropAnimation, setDropAnimation] = useState<{ pokemon: any; id: number } | null>(null);
  
  // Staking state
  const [stakedAmount, setStakedAmount] = useState(0);
  const [stakingRewards, setStakingRewards] = useState(0);
  const [selectedPool, setSelectedPool] = useState('basic');
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [stakeAmount, setStakeAmount] = useState('');

  // Simulate staking rewards accumulation
  useEffect(() => {
    const interval = setInterval(() => {
      if (stakedAmount > 0) {
        const pool = STAKING_POOLS.find(p => p.id === selectedPool);
        const dailyRate = pool ? pool.apy / 365 / 100 : 0;
        setStakingRewards(prev => prev + (stakedAmount * dailyRate / 86400));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [stakedAmount, selectedPool]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isFarming && energy > 0) {
      interval = setInterval(() => {
        setFarmingTime(prev => prev + 1);
        setEnergy(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isFarming, energy]);

  useEffect(() => {
    if (isFarming && farmingTime > 0 && farmingTime % 10 === 0 && energy > 0) {
      const dropPokemon = hatchRandomPokemon();
      setDropAnimation({ pokemon: dropPokemon, id: Date.now() });
      setTimeout(() => setDropAnimation(null), 2000);
      setEggs(prev => prev + 1);
    }
  }, [farmingTime, isFarming, energy]);

  const hatchRandomPokemon = () => {
    const rand = Math.random();
    let cumulative = 0;
    const rarities = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic'];

    for (const rarity of rarities) {
      cumulative += DROP_RATES[rarity as keyof typeof DROP_RATES];
      if (rand < cumulative) {
        const pool = HATCHABLE_POKEMON.filter(p => p.rarity === rarity);
        return pool[Math.floor(Math.random() * pool.length)];
      }
    }
    return HATCHABLE_POKEMON.filter(p => p.rarity === 'Common')[0];
  };

  const handleHatch = () => {
    if (eggs <= 0) {
      alert('No eggs to hatch! Buy more from the shop.');
      return;
    }

    const pokemon = hatchRandomPokemon();
    setHatchingPokemon(pokemon);
    setEggs(prev => prev - 1);
    setShowHatchModal(true);
  };

  const confirmHatch = () => {
    if (hatchingPokemon) {
      setInventory(prev => [hatchingPokemon, ...prev]);
    }
    setShowHatchModal(false);
    setHatchingPokemon(null);
  };

  const startFarming = () => {
    if (energy <= 0) {
      alert('No energy left! Buy energy packs from the shop.');
      return;
    }
    setIsFarming(true);
    setFarmingTime(0);
  };

  const stopFarming = () => {
    setIsFarming(false);
  };

  const handleStake = () => {
    const amount = parseFloat(stakeAmount);
    if (amount <= 0 || isNaN(amount)) {
      alert('Please enter a valid amount');
      return;
    }
    if (amount < 100) {
      alert('Minimum stake is 100 $MNMOON');
      return;
    }
    
    setStakedAmount(prev => prev + amount);
    setStakingRewards(0);
    setShowStakeModal(false);
    setStakeAmount('');
    alert(`Successfully staked ${amount} $MNMOON!`);
  };

  const handleUnstake = () => {
    if (stakedAmount <= 0) return;
    
    const pool = STAKING_POOLS.find(p => p.id === selectedPool);
    if (pool) {
      const confirm = window.confirm(`Unstake all ${stakedAmount.toLocaleString()} $MNMOON? You will lose ${(stakedAmount * pool.apy / 100).toLocaleString()} $MNMOON in potential rewards.`);
      if (confirm) {
        setStakedAmount(0);
        setStakingRewards(0);
      }
    }
  };

  const claimRewards = () => {
    if (stakingRewards > 0) {
      alert(`Claimed ${stakingRewards.toFixed(4)} $MNMOON in rewards!`);
      setStakingRewards(0);
    }
  };

  const getPokemonImageUrl = (id: number) => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="bg-slate-800/50 border-b border-white/5 py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-400 hover:text-white">←</Link>
              <h1 className="text-3xl font-bold text-white">⏰ AFK Arena</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-700/50">
                <span>⚡</span>
                <span className="text-amber-400 font-bold">{energy}/100</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-700/50">
                <span>🥚</span>
                <span className="text-amber-400 font-bold">{eggs}</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30">
                <span>🪙</span>
                <span className="text-amber-400 font-bold">{(12500 + stakedAmount).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('farming')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                activeTab === 'farming'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                  : 'bg-slate-700 text-gray-400 hover:text-white'
              }`}
            >
              🥚 Egg Farming
            </button>
            <button
              onClick={() => setActiveTab('staking')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                activeTab === 'staking'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                  : 'bg-slate-700 text-gray-400 hover:text-white'
              }`}
            >
              🪙 Staking
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'farming' ? (
            <motion.div
              key="farming"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative bg-slate-800/50 rounded-2xl p-8 border border-white/5 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-pink-500/5" />

                    <div className="relative z-10 text-center py-8">
                      {isFarming ? (
                        <div className="space-y-6">
                          <div className="relative inline-block">
                            <motion.div
                              animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0],
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="text-8xl"
                            >
                              🥚
                            </motion.div>
                            <motion.div
                              animate={{ opacity: [0.3, 0.6, 0.3] }}
                              transition={{ duration: 1, repeat: Infinity }}
                              className="absolute -inset-4 bg-amber-500/20 rounded-full blur-xl"
                            />
                          </div>

                          <div>
                            <p className="text-amber-400 font-bold text-xl">Farming Active...</p>
                            <p className="text-gray-400">Time: {Math.floor(farmingTime / 60)}:{(farmingTime % 60).toString().padStart(2, '0')}</p>
                          </div>

                          <div className="w-full max-w-xs mx-auto">
                            <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                                animate={{ width: `${energy}%` }}
                                transition={{ duration: 0.5 }}
                              />
                            </div>
                            <p className="text-sm text-gray-400 mt-1">Energy: {energy}/100</p>
                          </div>

                          {dropAnimation && (
                            <motion.div
                              initial={{ opacity: 0, y: -50, scale: 0.5 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.5 }}
                              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-20"
                            >
                              <div className="text-6xl animate-bounce">+1 🥚</div>
                              <p className="text-amber-400 font-bold mt-2">Egg Dropped!</p>
                            </motion.div>
                          )}

                          <button
                            onClick={stopFarming}
                            className="px-8 py-4 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 font-bold text-white text-xl hover:opacity-90 transition-opacity"
                          >
                            ⏹️ Stop Farming
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div className="text-8xl">🥚</div>
                          <div>
                            <h2 className="text-2xl font-bold text-white mb-2">AFK Egg Farming</h2>
                            <p className="text-gray-400">Farm eggs automatically while away!</p>
                          </div>

                          <div className="bg-slate-700/30 rounded-xl p-4 text-left">
                            <h3 className="font-bold text-white mb-3">Drop Rates</h3>
                            <div className="space-y-2 text-sm">
                              {Object.entries(DROP_RATES).reverse().map(([rarity, rate]) => (
                                <div key={rarity} className="flex items-center justify-between">
                                  <span className={rarityColors[rarity as keyof typeof rarityColors]?.text}>{rarity}</span>
                                  <span className="text-gray-400">{(rate * 100).toFixed(0)}%</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <button
                            onClick={startFarming}
                            disabled={energy <= 0}
                            className="px-12 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 font-bold text-white text-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            ▶️ Start Farming
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-500/30"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-white">🥚 Hatch Your Eggs</h3>
                        <p className="text-gray-400">Get random Pokemon with crypto prizes!</p>
                      </div>
                      <button
                        onClick={handleHatch}
                        disabled={eggs <= 0}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Hatch ({eggs} 🥚)
                      </button>
                    </div>
                  </motion.div>
                </div>

                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-slate-800/50 rounded-2xl p-6 border border-white/5"
                  >
                    <h2 className="text-xl font-bold text-white mb-4">🎒 Your Hatched Pokemon</h2>

                    {inventory.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="text-6xl mb-4">🥚</div>
                        <p className="text-gray-400">No Pokemon hatched yet.</p>
                        <p className="text-sm text-gray-500">Hatch eggs to get started!</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                        {inventory.slice(0, 20).map((pokemon, index) => {
                          const colors = typeColors[pokemon.type] || typeColors.normal;
                          const rarity = rarityColors[pokemon.rarity];

                          return (
                            <motion.div
                              key={`${pokemon.id}-${index}`}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className={`p-3 rounded-xl border ${rarity.border} ${rarity.bg}`}
                            >
                              <div className="flex items-center space-x-3">
                                <Image
                                  src={getPokemonImageUrl(pokemon.id)}
                                  alt={pokemon.name}
                                  width={48}
                                  height={48}
                                  className="object-contain"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="font-bold text-white text-sm truncate">{pokemon.name}</p>
                                  <p className={`text-xs ${colors.text}`}>{pokemon.power} ⚔️</p>
                                  <p className={`text-xs ${rarity.text}`}>{pokemon.rarity}</p>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-slate-800/50 rounded-2xl p-6 border border-white/5"
                  >
                    <h3 className="text-lg font-bold text-white mb-4">📊 AFK Stats</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-xl bg-slate-700/30 text-center">
                        <p className="text-2xl font-bold text-amber-400">{inventory.length}</p>
                        <p className="text-sm text-gray-400">Total Hatched</p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-700/30 text-center">
                        <p className="text-2xl font-bold text-red-400">{inventory.filter(p => p.rarity === 'Mythic').length}</p>
                        <p className="text-sm text-gray-400">Mythic Found</p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-700/30 text-center">
                        <p className="text-2xl font-bold text-purple-400">{inventory.filter(p => ['Mythic', 'Legendary'].includes(p.rarity)).length}</p>
                        <p className="text-sm text-gray-400">Legendaries</p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-700/30 text-center">
                        <p className="text-2xl font-bold text-green-400">{inventory.reduce((sum, p) => sum + p.power, 0).toLocaleString()}</p>
                        <p className="text-sm text-gray-400">Total Power</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="staking"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {/* Staking Stats */}
                  <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl p-6 border border-amber-500/20">
                    <h2 className="text-2xl font-bold text-white mb-4">🪙 Your Staking</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-amber-400">{stakedAmount.toLocaleString()}</p>
                        <p className="text-sm text-gray-400">Staked $MNMOON</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-green-400">{stakingRewards.toFixed(4)}</p>
                        <p className="text-sm text-gray-400">Earned Rewards</p>
                      </div>
                    </div>
                    <div className="flex space-x-3 mt-4">
                      <button
                        onClick={() => setShowStakeModal(true)}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 font-bold text-white"
                      >
                        + Stake More
                      </button>
                      <button
                        onClick={claimRewards}
                        disabled={stakingRewards <= 0}
                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 font-bold text-white disabled:opacity-50"
                      >
                        Claim Rewards
                      </button>
                      <button
                        onClick={handleUnstake}
                        disabled={stakedAmount <= 0}
                        className="py-3 px-4 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 font-bold disabled:opacity-50"
                      >
                        Unstake
                      </button>
                    </div>
                  </div>

                  {/* Pool Selection */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">Select Pool</h3>
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
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-bold text-white">{pool.name}</p>
                            <p className="text-sm text-gray-400">Min: {pool.minStake.toLocaleString()} $MNMOON • Lock: {pool.lockPeriod} days</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-green-400">{pool.apy}%</p>
                            <p className="text-xs text-gray-400">APY</p>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center space-x-2">
                          <span className="text-xs bg-slate-700 px-2 py-1 rounded">{pool.rewards} Rewards</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  {/* How it Works */}
                  <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/5">
                    <h3 className="text-xl font-bold text-white mb-4">💡 How Staking Works</h3>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold">1</div>
                        <div>
                          <p className="font-bold text-white">Stake $MNMOON</p>
                          <p className="text-sm text-gray-400">Choose a pool and stake your tokens</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold">2</div>
                        <div>
                          <p className="font-bold text-white">Earn Rewards</p>
                          <p className="text-sm text-gray-400">Get up to {STAKING_POOLS.reduce((max, p) => Math.max(max, p.apy), 0)}% APY</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold">3</div>
                        <div>
                          <p className="font-bold text-white">Claim & Unstake</p>
                          <p className="text-sm text-gray-400">Claim rewards daily and unstake after lock period</p>
                        </div>
                      </div>
                    </div>
                  </div>

{/* Tips */}
                  <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-500/20">
                    <h3 className="text-lg font-bold text-white mb-3">💡 Tips</h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li>• Higher APY pools require longer lock periods</li>
                      <li>• Rewards compound automatically when restaked</li>
                      <li>• Early unstaking may forfeit rewards</li>
                      <li>• VIP pool gives instant rewards instead of daily</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showHatchModal && hatchingPokemon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
            onClick={() => setShowHatchModal(false)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="text-center p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.5, repeat: 3 }}
                className="absolute inset-0 bg-white pointer-events-none"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5 }}
                className="text-9xl mb-6 relative z-10"
              >
                🥚
              </motion.div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="relative z-10"
              >
                <p className="text-amber-400 font-bold text-xl mb-4">You hatched a {hatchingPokemon.rarity}!</p>
                <div className={`inline-block p-6 rounded-2xl border-2 ${rarityColors[hatchingPokemon.rarity as keyof typeof rarityColors]?.border} bg-slate-800/80`}>
                  <Image
                    src={getPokemonImageUrl(hatchingPokemon.id)}
                    alt={hatchingPokemon.name}
                    width={150}
                    height={150}
                    className="object-contain mb-4"
                  />
                  <h2 className="text-2xl font-bold text-white">{hatchingPokemon.name}</h2>
                  <p className={`${typeColors[hatchingPokemon.type as keyof typeof typeColors]?.text}`}>
                    {typeEmojis[hatchingPokemon.type]} {hatchingPokemon.type}
                  </p>
                  <p className="text-amber-400 font-bold mt-2">⚔️ {hatchingPokemon.power}</p>
                </div>
                <button
                  onClick={confirmHatch}
                  className="mt-6 px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 font-bold text-white"
                >
                  Add to Collection
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                  <label className="block text-sm text-gray-400 mb-2">Amount</label>
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
                    <button onClick={() => setStakeAmount((12500).toString())} className="hover:text-white">All</button>
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
