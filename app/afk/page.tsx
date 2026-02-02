'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Drop rates configuration
const DROP_RATES = {
  Mythic: 0.01,      // 1% - $1 drop
  Legendary: 0.04,   // 4%
  Epic: 0.10,        // 10%
  Rare: 0.25,        // 25%
  Uncommon: 0.35,    // 35%
  Common: 0.25,      // 25%
};

// Pokemon that can be hatched from eggs
const HATCHABLE_POKEMON = [
  // Common (25%)
  { id: 1, name: 'Bulbasaur', type: 'grass', power: 100, rarity: 'Common' },
  { id: 4, name: 'Charmander', type: 'fire', power: 100, rarity: 'Common' },
  { id: 7, name: 'Squirtle', type: 'water', power: 100, rarity: 'Common' },
  { id: 25, name: 'Pikachu', type: 'electric', power: 120, rarity: 'Common' },
  { id: 37, name: 'Vulpix', type: 'fire', power: 80, rarity: 'Common' },
  { id: 54, name: 'Psyduck', type: 'water', power: 85, rarity: 'Common' },
  { id: 129, name: 'Magikarp', type: 'water', power: 20, rarity: 'Common' },
  { id: 133, name: 'Eevee', type: 'normal', power: 110, rarity: 'Common' },
  { id: 190, name: 'Aipom', type: 'normal', power: 90, rarity: 'Common' },
  { id: 406, name: 'Budew', type: 'grass', power: 60, rarity: 'Common' },

  // Uncommon (35%)
  { id: 2, name: 'Ivysaur', type: 'grass', power: 200, rarity: 'Uncommon' },
  { id: 5, name: 'Charmeleon', type: 'fire', power: 200, rarity: 'Uncommon' },
  { id: 8, name: 'Wartortle', type: 'water', power: 200, rarity: 'Uncommon' },
  { id: 26, name: 'Raichu', type: 'electric', power: 400, rarity: 'Uncommon' },
  { id: 38, name: 'Ninetales', type: 'fire', power: 250, rarity: 'Uncommon' },
  { id: 43, name: 'Oddish', type: 'grass', power: 75, rarity: 'Uncommon' },
  { id: 55, name: 'Golduck', type: 'water', power: 280, rarity: 'Uncommon' },
  { id: 60, name: 'Poliwag', type: 'water', power: 70, rarity: 'Uncommon' },
  { id: 92, name: 'Gastly', type: 'ghost', power: 120, rarity: 'Uncommon' },
  { id: 173, name: 'Cleffa', type: 'fairy', power: 50, rarity: 'Uncommon' },
  { id: 220, name: 'Swinub', type: 'ice', power: 80, rarity: 'Uncommon' },

  // Rare (25%)
  { id: 3, name: 'Venusaur', type: 'grass', power: 500, rarity: 'Rare' },
  { id: 6, name: 'Charizard', type: 'fire', power: 500, rarity: 'Rare' },
  { id: 9, name: 'Blastoise', type: 'water', power: 500, rarity: 'Rare' },
  { id: 45, name: 'Vileplume', type: 'grass', power: 380, rarity: 'Rare' },
  { id: 62, name: 'Politoed', type: 'water', power: 300, rarity: 'Rare' },
  { id: 66, name: 'Machop', type: 'fighting', power: 100, rarity: 'Rare' },
  { id: 94, name: 'Gengar', type: 'ghost', power: 500, rarity: 'Rare' },
  { id: 125, name: 'Electabuzz', type: 'electric', power: 350, rarity: 'Rare' },
  { id: 135, name: 'Jolteon', type: 'electric', power: 380, rarity: 'Rare' },
  { id: 196, name: 'Espeon', type: 'psychic', power: 420, rarity: 'Rare' },
  { id: 282, name: 'Gardevoir', type: 'fairy', power: 450, rarity: 'Rare' },

  // Epic (10%)
  { id: 68, name: 'Machamp', type: 'fighting', power: 480, rarity: 'Epic' },
  { id: 93, name: 'Haunter', type: 'ghost', power: 280, rarity: 'Epic' },
  { id: 131, name: 'Lapras', type: 'ice', power: 450, rarity: 'Epic' },
  { id: 149, name: 'Dragonite', type: 'dragon', power: 600, rarity: 'Epic' },
  { id: 230, name: 'Kingdra', type: 'dragon', power: 550, rarity: 'Epic' },
  { id: 257, name: 'Blaziken', type: 'fighting', power: 550, rarity: 'Epic' },
  { id: 303, name: 'Mawile', type: 'fairy', power: 350, rarity: 'Epic' },

  // Legendary (4%)
  { id: 144, name: 'Articuno', type: 'ice', power: 900, rarity: 'Legendary' },
  { id: 145, name: 'Zapdos', type: 'electric', power: 900, rarity: 'Legendary' },
  { id: 146, name: 'Moltres', type: 'fire', power: 900, rarity: 'Legendary' },
  { id: 150, name: 'Mewtwo', type: 'psychic', power: 1000, rarity: 'Legendary' },
  { id: 151, name: 'Mew', type: 'psychic', power: 800, rarity: 'Legendary' },
  { id: 243, name: 'Raikou', type: 'electric', power: 900, rarity: 'Legendary' },
  { id: 244, name: 'Entei', type: 'fire', power: 900, rarity: 'Legendary' },
  { id: 245, name: 'Suicune', type: 'water', power: 900, rarity: 'Legendary' },

  // Mythic (1%) - $1 Drop!
  { id: 249, name: 'Lugia', type: 'psychic', power: 1200, rarity: 'Mythic' },
  { id: 250, name: 'Ho-Oh', type: 'fire', power: 1200, rarity: 'Mythic' },
  { id: 380, name: 'Latias', type: 'dragon', power: 1100, rarity: 'Mythic' },
  { id: 381, name: 'Latios', type: 'dragon', power: 1100, rarity: 'Mythic' },
  { id: 382, name: 'Kyogre', type: 'water', power: 1200, rarity: 'Mythic' },
  { id: 383, name: 'Groudon', type: 'fire', power: 1200, rarity: 'Mythic' },
  { id: 384, name: 'Rayquaza', type: 'dragon', power: 1300, rarity: 'Mythic' },
  { id: 385, name: 'Jirachi', type: 'psychic', power: 1000, rarity: 'Mythic' },
  { id: 386, name: 'Deoxys', type: 'psychic', power: 1100, rarity: 'Mythic' },
  { id: 483, name: 'Dialga', type: 'dragon', power: 1000, rarity: 'Mythic' },
  { id: 484, name: 'Palkia', type: 'dragon', power: 1000, rarity: 'Mythic' },
  { id: 487, name: 'Giratina', type: 'ghost', power: 1200, rarity: 'Mythic' },
  { id: 493, name: 'Arceus', type: 'normal', power: 1500, rarity: 'Mythic' },
  { id: 716, name: 'Xerneas', type: 'fairy', power: 1300, rarity: 'Mythic' },
  { id: 717, name: 'Yveltal', type: 'dark', power: 1300, rarity: 'Mythic' },
  { id: 718, name: 'Zygarde', type: 'dragon', power: 1200, rarity: 'Mythic' },
  { id: 791, name: 'Solgaleo', type: 'psychic', power: 1400, rarity: 'Mythic' },
  { id: 792, name: 'Lunala', type: 'psychic', power: 1400, rarity: 'Mythic' },
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
  ice: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', gradient: 'from-cyan-500 to-blue-500' },
  dragon: { bg: 'bg-purple-500/20', text: 'text-purple-400', gradient: 'from-purple-500 to-pink-500' },
  ghost: { bg: 'bg-indigo-500/20', text: 'text-indigo-400', gradient: 'from-indigo-500 to-purple-500' },
  fighting: { bg: 'bg-orange-500/20', text: 'text-orange-400', gradient: 'from-orange-500 to-red-500' },
  fairy: { bg: 'bg-pink-500/20', text: 'text-pink-400', gradient: 'from-pink-500 to-rose-500' },
  psychic: { bg: 'bg-fuchsia-500/20', text: 'text-fuchsia-400', gradient: 'from-fuchsia-500 to-pink-500' },
  normal: { bg: 'bg-gray-500/20', text: 'text-gray-400', gradient: 'from-gray-500 to-slate-500' },
  dark: { bg: 'bg-slate-500/20', text: 'text-slate-400', gradient: 'from-slate-500 to-gray-600' },
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
  const [isFarming, setIsFarming] = useState(false);
  const [energy, setEnergy] = useState(100);
  const [eggs, setEggs] = useState(5);
  const [hatchingPokemon, setHatchingPokemon] = useState<any>(null);
  const [showHatchModal, setShowHatchModal] = useState(false);
  const [inventory, setInventory] = useState<any[]>([]);
  const [farmingTime, setFarmingTime] = useState(0);
  const [dropAnimation, setDropAnimation] = useState<{ pokemon: any; id: number } | null>(null);

  // Farming timer
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

  // Auto drop egg every 10 seconds while farming
  useEffect(() => {
    if (isFarming && farmingTime > 0 && farmingTime % 10 === 0 && energy > 0) {
      // Trigger egg drop animation
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

  const getPokemonImageUrl = (id: number) => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-white/5 py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-400 hover:text-white">←</Link>
              <h1 className="text-3xl font-bold text-white">🥚 AFK Hatch Arena</h1>
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
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Farming Area */}
          <div className="space-y-6">
            {/* 3D Farming Visualization */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative bg-slate-800/50 rounded-2xl p-8 border border-white/5 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-pink-500/5" />

              {/* Farming Scene */}
              <div className="relative z-10 text-center py-8">
                {isFarming ? (
                  <div className="space-y-6">
                    {/* Animated Egg */}
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

                    {/* Progress Bar */}
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

                    {/* Drop Animation */}
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

                    {/* Drop Rate Info */}
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

            {/* Hatch Button */}
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

          {/* Inventory / Hatched Pokemon */}
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

            {/* Stats */}
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
                  <p className="text-2xl font-bold text-red-400">
                    {inventory.filter(p => p.rarity === 'Mythic').length}
                  </p>
                  <p className="text-sm text-gray-400">Mythic Found</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-700/30 text-center">
                  <p className="text-2xl font-bold text-purple-400">
                    {inventory.filter(p => ['Mythic', 'Legendary'].includes(p.rarity)).length}
                  </p>
                  <p className="text-sm text-gray-400">Legendaries</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-700/30 text-center">
                  <p className="text-2xl font-bold text-green-400">
                    {inventory.reduce((sum, p) => sum + p.power, 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-400">Total Power</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Hatch Animation Modal */}
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
              {/* Flash Effect */}
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
    </div>
  );
}
