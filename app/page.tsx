'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';

// Placeholder token info - In production, fetch from API
const TOKEN_INFO = {
  address: '0x184f03750171f9eF32B6267271a7FEE59cb5F387',
  name: '$MNMOON',
  symbol: 'MNMOON',
  price: 0,
  marketCap: 0,
  holders: 0,
  totalStaked: 0,
  apy: 50,
};

// Pokemon data with real PokeAPI IDs for images
const pokemonData = [
  { id: 4, name: 'Charmander', type: 'fire', power: 100, rarity: 'Common' },
  { id: 5, name: 'Charmeleon', type: 'fire', power: 200, rarity: 'Uncommon' },
  { id: 6, name: 'Charizard', type: 'fire', power: 500, rarity: 'Rare' },
  { id: 149, name: 'Dragonite', type: 'dragon', power: 600, rarity: 'Epic' },
  { id: 150, name: 'Mewtwo', type: 'psychic', power: 1000, rarity: 'Legendary' },
  { id: 493, name: 'Arceus', type: 'normal', power: 1500, rarity: 'Mythic' },
  { id: 384, name: 'Rayquaza', type: 'dragon', power: 1300, rarity: 'Mythic' },
  { id: 249, name: 'Lugia', type: 'psychic', power: 1200, rarity: 'Mythic' },
  { id: 145, name: 'Zapdos', type: 'electric', power: 900, rarity: 'Legendary' },
  { id: 146, name: 'Moltres', type: 'fire', power: 900, rarity: 'Legendary' },
  { id: 144, name: 'Articuno', type: 'ice', power: 900, rarity: 'Legendary' },
  { id: 130, name: 'Gyarados', type: 'water', power: 550, rarity: 'Rare' },
  { id: 25, name: 'Pikachu', type: 'electric', power: 120, rarity: 'Common' },
  { id: 94, name: 'Gengar', type: 'ghost', power: 500, rarity: 'Epic' },
  { id: 68, name: 'Machamp', type: 'fighting', power: 480, rarity: 'Rare' },
  { id: 282, name: 'Gardevoir', type: 'fairy', power: 450, rarity: 'Epic' },
];

const typeColors: Record<string, { bg: string; text: string; gradient: string }> = {
  fire: { bg: 'bg-red-500/20', text: 'text-red-400', gradient: 'from-red-500 to-orange-500' },
  water: { bg: 'bg-blue-500/20', text: 'text-blue-400', gradient: 'from-blue-500 to-cyan-500' },
  electric: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', gradient: 'from-yellow-500 to-amber-500' },
  grass: { bg: 'bg-green-500/20', text: 'text-green-400', gradient: 'from-green-500 to-emerald-500' },
  dragon: { bg: 'bg-purple-500/20', text: 'text-purple-400', gradient: 'from-purple-500 to-pink-500' },
  ghost: { bg: 'bg-indigo-500/20', text: 'text-indigo-400', gradient: 'from-indigo-500 to-purple-500' },
  fighting: { bg: 'bg-orange-500/20', text: 'text-orange-400', gradient: 'from-orange-500 to-red-500' },
  psychic: { bg: 'bg-fuchsia-500/20', text: 'text-fuchsia-400', gradient: 'from-fuchsia-500 to-pink-500' },
  fairy: { bg: 'bg-pink-500/20', text: 'text-pink-400', gradient: 'from-pink-500 to-rose-500' },
  normal: { bg: 'bg-gray-500/20', text: 'text-gray-400', gradient: 'from-gray-500 to-slate-500' },
  ice: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', gradient: 'from-cyan-500 to-blue-500' },
};

const rarityColors: Record<string, { text: string; border: string; glow: string, bg: string }> = {
  Common: { text: 'text-gray-400', border: 'border-gray-400', glow: 'shadow-gray-400/20', bg: 'bg-gray-500/20' },
  Uncommon: { text: 'text-green-400', border: 'border-green-400', glow: 'shadow-green-400/20', bg: 'bg-green-500/20' },
  Rare: { text: 'text-blue-400', border: 'border-blue-400', glow: 'shadow-blue-400/20', bg: 'bg-blue-500/20' },
  Epic: { text: 'text-purple-400', border: 'border-purple-400', glow: 'shadow-purple-400/20', bg: 'bg-purple-500/20' },
  Legendary: { text: 'text-amber-400', border: 'border-amber-400', glow: 'shadow-amber-400/20', bg: 'bg-amber-500/20' },
  Mythic: { text: 'text-red-500', border: 'border-red-500', glow: 'shadow-red-500/30', bg: 'bg-red-500/30' },
};

const typeEmojis: Record<string, string> = {
  fire: '🔥', water: '💧', electric: '⚡', grass: '🌿',
  ice: '❄️', dragon: '🐉', ghost: '👻', fighting: '🥊',
  fairy: '🧚', psychic: '🧠', normal: '⚪', dark: '🌑',
};

export default function HomePage() {
  const { isConnected, address } = useAccount();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedRarity, setSelectedRarity] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [imageLoaded, setImageLoaded] = useState<Record<number, boolean>>({});
  const [livePrice, setLivePrice] = useState(TOKEN_INFO.price);

  // Simulate live price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLivePrice(prev => prev + (Math.random() - 0.5) * 0.001);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredMonsters = pokemonData.filter(m => {
    const matchesType = !selectedType || m.type === selectedType;
    const matchesRarity = !selectedRarity || m.rarity === selectedRarity;
    const matchesSearch = !searchTerm || m.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesRarity && matchesSearch;
  });

  const types = ['fire', 'water', 'electric', 'grass', 'ice', 'dragon', 'ghost', 'fighting', 'fairy', 'psychic'];
  const rarities = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic'];

  const getPokemonImageUrl = (id: number) => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Token Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-pink-500/10 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <span className="text-xl font-bold text-white">M</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{TOKEN_INFO.name}</h1>
                <p className="text-sm text-gray-400">Base Chain Token</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">${livePrice.toFixed(4)}</p>
                <p className="text-xs text-gray-400">Live Price</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400">${(TOKEN_INFO.marketCap / 1000000).toFixed(1)}M</p>
                <p className="text-xs text-gray-400">Market Cap</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-400">{TOKEN_INFO.holders.toLocaleString()}</p>
                <p className="text-xs text-gray-400">Holders</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-400">{TOKEN_INFO.apy}%</p>
                <p className="text-xs text-gray-400">Max APY</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">${(TOKEN_INFO.totalStaked / 1000000).toFixed(1)}M</p>
                <p className="text-xs text-gray-400">Total Staked</p>
              </div>
            </div>

            <a
              href="https://streme.fun/token/0x184f03750171f9ef32b6267271a7fee59cb5f387"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 font-bold text-white hover:opacity-90 transition-opacity text-sm"
            >
              View on Streme ↗
            </a>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden py-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-pink-500/5 to-purple-500/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6">
              <div className="inline-block relative">
                <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-amber-400 to-pink-500 flex items-center justify-center text-5xl shadow-2xl shadow-amber-500/30">
                  🌙
                </div>
                <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-amber-500 to-pink-500 blur-lg opacity-50 animate-pulse" />
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500 bg-clip-text text-transparent mb-4">
              MiniMoon
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Collect, Battle & Trade Real Pokemon NFT Characters on Base Chain
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="px-6 py-3 rounded-xl bg-slate-800/50 border border-white/5">
                <span className="text-amber-400 font-bold">{pokemonData.length}+</span>
                <span className="text-gray-400 ml-2">Pokemon</span>
              </div>
              <div className="px-6 py-3 rounded-xl bg-slate-800/50 border border-white/5">
                <span className="text-green-400 font-bold">{TOKEN_INFO.holders.toLocaleString()}+</span>
                <span className="text-gray-400 ml-2">Players</span>
              </div>
              <div className="px-6 py-3 rounded-xl bg-slate-800/50 border border-white/5">
                <span className="text-purple-400 font-bold">${(TOKEN_INFO.totalStaked / 1000000).toFixed(1)}M</span>
                <span className="text-gray-400 ml-2">Staked</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <Link href="/marketplace" className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl font-bold text-white hover:opacity-90 transition-all shadow-lg shadow-amber-500/25">
                🏪 Buy Monsters
              </Link>
              <Link href="/arena" className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl font-bold text-white hover:opacity-90 transition-all shadow-lg shadow-red-500/25">
                ⚔️ Battle Arena
              </Link>
              <Link href="/afk" className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl font-bold text-white hover:opacity-90 transition-all shadow-lg shadow-blue-500/25">
                🥚 AFK Hatch
              </Link>
              <Link href="/staking" className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl font-bold text-white hover:opacity-90 transition-all shadow-lg shadow-green-500/25">
                🪙 Stake & Earn
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* User Balance Banner (if connected) */}
      {isConnected && address && (
        <div className="max-w-7xl mx-auto px-4 mb-8">
          <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl p-6 border border-amber-500/30">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-400">Your Balance</p>
                <p className="text-3xl font-bold text-amber-400">12,500 $MNMOON</p>
              </div>
              <div className="flex space-x-4 text-center">
                <div>
                  <p className="text-xl font-bold text-white">12</p>
                  <p className="text-xs text-gray-400">Monsters</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-white">8,450</p>
                  <p className="text-xs text-gray-400">Power</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-white">#234</p>
                  <p className="text-xs text-gray-400">Rank</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="max-w-6xl mx-auto px-4 mb-8">
        <div className="flex flex-wrap gap-3 justify-center">
          <input
            type="text"
            placeholder="Search Pokemon..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded-xl bg-slate-800/50 text-white placeholder-gray-400 border border-white/10 focus:border-amber-500/50 focus:outline-none w-48"
          />

          <select
            value={selectedType || ''}
            onChange={(e) => setSelectedType(e.target.value || null)}
            className="px-4 py-2 rounded-xl bg-slate-800/50 text-white border border-white/10 focus:border-amber-500/50 focus:outline-none"
          >
            <option value="">All Types</option>
            {types.map(type => (
              <option key={type} value={type}>
                {typeEmojis[type]} {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={selectedRarity || ''}
            onChange={(e) => setSelectedRarity(e.target.value || null)}
            className="px-4 py-2 rounded-xl bg-slate-800/50 text-white border border-white/10 focus:border-amber-500/50 focus:outline-none"
          >
            <option value="">All Rarities</option>
            {rarities.map(rarity => (
              <option key={rarity} value={rarity}>{rarity}</option>
            ))}
          </select>

          {(selectedType || selectedRarity || searchTerm) && (
            <button
              onClick={() => {
                setSelectedType(null);
                setSelectedRarity(null);
                setSearchTerm('');
              }}
              className="px-4 py-2 rounded-xl bg-slate-700 text-gray-300 hover:text-white transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Pokemon Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {filteredMonsters.length} Pokemon Available
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredMonsters.map((pokemon, index) => {
            const colors = typeColors[pokemon.type] || typeColors.normal;
            const rarity = rarityColors[pokemon.rarity];

            return (
              <motion.div
                key={pokemon.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className={`relative bg-slate-800/50 rounded-2xl p-4 border-2 ${rarity.border} hover:border-amber-500/50 transition-all hover:scale-105 hover:shadow-xl ${rarity.glow} cursor-pointer group overflow-hidden`}
              >
                {/* Background glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />

                {/* Pokemon Image */}
                <div className="relative z-10 text-center">
                  <div className="relative w-24 h-24 mx-auto mb-3">
                    {!imageLoaded[pokemon.id] && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                    <Image
                      src={getPokemonImageUrl(pokemon.id)}
                      alt={pokemon.name}
                      width={96}
                      height={96}
                      className={`object-contain transition-all group-hover:scale-110 ${!imageLoaded[pokemon.id] ? 'opacity-0' : 'opacity-100'}`}
                      onLoad={() => setImageLoaded(prev => ({ ...prev, [pokemon.id]: true }))}
                    />
                  </div>

                  <h3 className="font-bold text-white text-sm mb-1">{pokemon.name}</h3>

                  <div className={`text-xs px-2 py-0.5 rounded-full inline-block ${colors.bg} ${colors.text} border border-current`}>
                    {pokemon.rarity}
                  </div>

                  <div className="mt-2 flex items-center justify-center space-x-1">
                    <span className={colors.text}>{typeEmojis[pokemon.type]}</span>
                    <span className={`text-sm font-bold ${colors.text}`}>{pokemon.power}</span>
                  </div>
                </div>

                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </motion.div>
            );
          })}
        </div>

        {filteredMonsters.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2">No Pokemon Found</h3>
            <p className="text-gray-400">Try adjusting your filters</p>
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: '🐉', label: 'Total Pokemon', value: pokemonData.length.toString(), color: 'text-amber-400' },
              { icon: '🔥', label: 'Fire Type', value: pokemonData.filter(p => p.type === 'fire').length.toString(), color: 'text-red-400' },
              { icon: '💧', label: 'Water Type', value: pokemonData.filter(p => p.type === 'water').length.toString(), color: 'text-blue-400' },
              { icon: '⭐', label: 'Mythic', value: pokemonData.filter(p => p.rarity === 'Mythic').length.toString(), color: 'text-purple-400' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-4 rounded-xl bg-slate-800/30 border border-white/5"
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-500">
          <p className="mb-2">MiniMoon - Pokemon NFT Trading Game on Base Chain</p>
          <p className="text-sm">
            Images from PokeAPI • Trade with $MNMOON Token • Powered by Base
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            <a href="https://farcaster.xyz/maliotsol" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">
              🦪 FarCaster
            </a>
            <a href="https://x.com/minimoon_game" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">
              🐦 Twitter
            </a>
            <a href="https://github.com/Maliot100X/MiniMoon" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">
              🐙 GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
