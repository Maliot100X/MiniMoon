'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

// Pokemon data with real PokeAPI IDs for images
const pokemonData = [
  // Fire Type - Gen 1 Starters & Fire Pokemon
  { id: 4, name: 'Charmander', type: 'fire', power: 100, rarity: 'Common' },
  { id: 5, name: 'Charmeleon', type: 'fire', power: 200, rarity: 'Uncommon' },
  { id: 6, name: 'Charizard', type: 'fire', power: 500, rarity: 'Rare' },
  { id: 37, name: 'Vulpix', type: 'fire', power: 80, rarity: 'Common' },
  { id: 38, name: 'Ninetales', type: 'fire', power: 250, rarity: 'Uncommon' },
  { id: 58, name: 'Growlithe', type: 'fire', power: 90, rarity: 'Common' },
  { id: 59, name: 'Arcanine', type: 'fire', power: 350, rarity: 'Rare' },
  { id: 244, name: 'Entei', type: 'fire', power: 800, rarity: 'Legendary' },
  { id: 390, name: 'Chimchar', type: 'fire', power: 100, rarity: 'Common' },
  { id: 391, name: 'Monferno', type: 'fire', power: 200, rarity: 'Uncommon' },
  { id: 392, name: 'Infernape', type: 'fire', power: 500, rarity: 'Rare' },
  
  // Water Type
  { id: 7, name: 'Squirtle', type: 'water', power: 100, rarity: 'Common' },
  { id: 8, name: 'Wartortle', type: 'water', power: 200, rarity: 'Uncommon' },
  { id: 9, name: 'Blastoise', type: 'water', power: 500, rarity: 'Rare' },
  { id: 54, name: 'Psyduck', type: 'water', power: 85, rarity: 'Common' },
  { id: 55, name: 'Golduck', type: 'water', power: 280, rarity: 'Uncommon' },
  { id: 60, name: 'Poliwag', type: 'water', power: 70, rarity: 'Common' },
  { id: 61, name: 'Poliwhirl', type: 'water', power: 150, rarity: 'Uncommon' },
  { id: 62, name: 'Politoed', type: 'water', power: 300, rarity: 'Rare' },
  { id: 129, name: 'Magikarp', type: 'water', power: 20, rarity: 'Common' },
  { id: 130, name: 'Gyarados', type: 'water', power: 550, rarity: 'Rare' },
  { id: 245, name: 'Suicune', type: 'water', power: 800, rarity: 'Legendary' },
  
  // Electric Type
  { id: 25, name: 'Pikachu', type: 'electric', power: 120, rarity: 'Common' },
  { id: 26, name: 'Raichu', type: 'electric', power: 400, rarity: 'Rare' },
  { id: 125, name: 'Electabuzz', type: 'electric', power: 350, rarity: 'Rare' },
  { id: 135, name: 'Jolteon', type: 'electric', power: 380, rarity: 'Rare' },
  { id: 145, name: 'Zapdos', type: 'electric', power: 900, rarity: 'Legendary' },
  { id: 417, name: 'Pachirisu', type: 'electric', power: 100, rarity: 'Common' },
  
  // Grass Type
  { id: 1, name: 'Bulbasaur', type: 'grass', power: 100, rarity: 'Common' },
  { id: 2, name: 'Ivysaur', type: 'grass', power: 200, rarity: 'Uncommon' },
  { id: 3, name: 'Venusaur', type: 'grass', power: 500, rarity: 'Rare' },
  { id: 43, name: 'Oddish', type: 'grass', power: 75, rarity: 'Common' },
  { id: 44, name: 'Gloom', type: 'grass', power: 180, rarity: 'Uncommon' },
  { id: 45, name: 'Vileplume', type: 'grass', power: 380, rarity: 'Rare' },
  { id: 182, name: 'Bellossom', type: 'grass', power: 400, rarity: 'Rare' },
  { id: 254, name: 'Sceptile', type: 'grass', power: 500, rarity: 'Rare' },
  { id: 406, name: 'Budew', type: 'grass', power: 60, rarity: 'Common' },
  
  // Ice Type
  { id: 124, name: 'Jynx', type: 'ice', power: 320, rarity: 'Rare' },
  { id: 131, name: 'Lapras', type: 'ice', power: 450, rarity: 'Rare' },
  { id: 144, name: 'Articuno', type: 'ice', power: 900, rarity: 'Legendary' },
  { id:220, name: 'Swinub', type: 'ice', power: 80, rarity: 'Common' },
  { id: 221, name: 'Piloswine', type: 'ice', power: 200, rarity: 'Uncommon' },
  { id: 222, name: 'Mamoswine', type: 'ice', power: 450, rarity: 'Rare' },
  { id: 361, name: 'Snorunt', type: 'ice', power: 150, rarity: 'Uncommon' },
  { id: 362, name: 'Glalie', type: 'ice', power: 350, rarity: 'Rare' },
  
  // Dragon Type
  { id: 147, name: 'Dratini', type: 'dragon', power: 150, rarity: 'Uncommon' },
  { id: 148, name: 'Dragonair', type: 'dragon', power: 350, rarity: 'Rare' },
  { id: 149, name: 'Dragonite', type: 'dragon', power: 600, rarity: 'Epic' },
  { id: 230, name: 'Kingdra', type: 'dragon', power: 550, rarity: 'Rare' },
  { id: 329, name: 'Beldum', type: 'dragon', power: 100, rarity: 'Common' },
  { id: 330, name: 'Metang', type: 'dragon', power: 250, rarity: 'Uncommon' },
  { id: 331, name: 'Metagross', type: 'dragon', power: 600, rarity: 'Epic' },
  { id: 483, name: 'Dialga', type: 'dragon', power: 1000, rarity: 'Mythic' },
  { id: 484, name: 'Palkia', type: 'dragon', power: 1000, rarity: 'Mythic' },
  
  // Ghost Type
  { id: 92, name: 'Gastly', type: 'ghost', power: 120, rarity: 'Uncommon' },
  { id: 93, name: 'Haunter', type: 'ghost', power: 280, rarity: 'Rare' },
  { id: 94, name: 'Gengar', type: 'ghost', power: 500, rarity: 'Epic' },
  { id: 200, name: 'Misdreavus', type: 'ghost', power: 150, rarity: 'Uncommon' },
  { id: 429, name: 'Mismagius', type: 'ghost', power: 400, rarity: 'Rare' },
  { id: 487, name: 'Giratina', type: 'ghost', power: 1200, rarity: 'Mythic' },
  
  // Fighting Type
  { id: 66, name: 'Machop', type: 'fighting', power: 100, rarity: 'Common' },
  { id: 67, name: 'Machoke', type: 'fighting', power: 220, rarity: 'Uncommon' },
  { id: 68, name: 'Machamp', type: 'fighting', power: 480, rarity: 'Rare' },
  { id: 106, name: 'Hitmonlee', type: 'fighting', power: 350, rarity: 'Rare' },
  { id: 107, name: 'Hitmonchan', type: 'fighting', power: 350, rarity: 'Rare' },
  { id: 237, name: 'Hitmontop', type: 'fighting', power: 380, rarity: 'Rare' },
  { id: 256, name: 'Combusken', type: 'fighting', power: 200, rarity: 'Uncommon' },
  { id: 257, name: 'Blaziken', type: 'fighting', power: 550, rarity: 'Rare' },
  { id: 532, name: 'Timburr', type: 'fighting', power: 100, rarity: 'Common' },
  { id: 533, name: 'Gurdurr', type: 'fighting', power: 220, rarity: 'Uncommon' },
  { id: 534, name: 'Conkeldurr', type: 'fighting', power: 500, rarity: 'Rare' },
  
  // Fairy Type
  { id: 35, name: 'Clefairy', type: 'fairy', power: 90, rarity: 'Common' },
  { id: 36, name: 'Clefable', type: 'fairy', power: 300, rarity: 'Rare' },
  { id: 39, name: 'Jigglypuff', type: 'fairy', power: 80, rarity: 'Common' },
  { id: 40, name: 'Wigglytuff', type: 'fairy', power: 280, rarity: 'Uncommon' },
  { id: 173, name: 'Cleffa', type: 'fairy', power: 50, rarity: 'Common' },
  { id: 282, name: 'Gardevoir', type: 'fairy', power: 450, rarity: 'Epic' },
  { id: 303, name: 'Mawile', type: 'fairy', power: 350, rarity: 'Rare' },
  { id: 406, name: 'Spritzee', type: 'fairy', power: 150, rarity: 'Uncommon' },
  { id: 407, name: 'Aromatisse', type: 'fairy', power: 380, rarity: 'Rare' },
  { id: 546, name: 'Swirlix', type: 'fairy', power: 120, rarity: 'Common' },
  { id: 547, name: 'Slurpuff', type: 'fairy', power: 350, rarity: 'Rare' },
  
  // Psychic Type
  { id: 63, name: 'Abra', type: 'psychic', power: 100, rarity: 'Common' },
  { id: 64, name: 'Kadabra', type: 'psychic', power: 250, rarity: 'Uncommon' },
  { id: 65, name: 'Alakazam', type: 'psychic', power: 550, rarity: 'Rare' },
  { id: 150, name: 'Mewtwo', type: 'psychic', power: 1000, rarity: 'Legendary' },
  { id: 151, name: 'Mew', type: 'psychic', power: 800, rarity: 'Legendary' },
  { id: 177, name: 'Natu', type: 'psychic', power: 80, rarity: 'Common' },
  { id: 178, name: 'Xatu', type: 'psychic', power: 280, rarity: 'Rare' },
  { id: 196, name: 'Espeon', type: 'psychic', power: 420, rarity: 'Rare' },
  { id: 249, name: 'Lugia', type: 'psychic', power: 1200, rarity: 'Mythic' },
  { id: 250, name: 'Ho-Oh', type: 'psychic', power: 1200, rarity: 'Mythic' },
  { id: 385, name: 'Jirachi', type: 'psychic', power: 1000, rarity: 'Mythic' },
  { id: 386, name: 'Deoxys', type: 'psychic', power: 1100, rarity: 'Mythic' },
  
  // Legendary & Mythic
  { id: 243, name: 'Raikou', type: 'electric', power: 900, rarity: 'Legendary' },
  { id: 244, name: 'Entei', type: 'fire', power: 900, rarity: 'Legendary' },
  { id: 245, name: 'Suicune', type: 'water', power: 900, rarity: 'Legendary' },
  { id: 380, name: 'Latias', type: 'dragon', power: 1100, rarity: 'Mythic' },
  { id: 381, name: 'Latios', type: 'dragon', power: 1100, rarity: 'Mythic' },
  { id: 382, name: 'Kyogre', type: 'water', power: 1200, rarity: 'Mythic' },
  { id: 383, name: 'Groudon', type: 'fire', power: 1200, rarity: 'Mythic' },
  { id: 384, name: 'Rayquaza', type: 'dragon', power: 1300, rarity: 'Mythic' },
  { id: 480, name: 'Uxie', type: 'psychic', power: 1000, rarity: 'Mythic' },
  { id: 481, name: 'Mesprit', type: 'psychic', power: 1000, rarity: 'Mythic' },
  { id: 482, name: 'Azelf', type: 'psychic', power: 1000, rarity: 'Mythic' },
  { id: 485, name: 'Heatran', type: 'fire', power: 1100, rarity: 'Mythic' },
  { id: 486, name: 'Regigigas', type: 'normal', power: 1300, rarity: 'Mythic' },
  { id: 488, name: 'Cresselia', type: 'psychic', power: 1000, rarity: 'Mythic' },
  { id: 491, name: 'Darkrai', type: 'dark', power: 1100, rarity: 'Mythic' },
  { id: 492, name: 'Shaymin', type: 'grass', power: 1000, rarity: 'Mythic' },
  { id: 493, name: 'Arceus', type: 'normal', power: 1500, rarity: 'Mythic' },
  { id: 494, name: 'Victini', type: 'psychic', power: 1200, rarity: 'Mythic' },
  { id: 638, name: 'Cobalion', type: 'steel', power: 1100, rarity: 'Mythic' },
  { id: 639, name: 'Terrakion', type: 'rock', power: 1100, rarity: 'Mythic' },
  { id: 640, name: 'Virizion', type: 'grass', power: 1100, rarity: 'Mythic' },
  { id: 641, name: 'Tornadus', type: 'flying', power: 1100, rarity: 'Mythic' },
  { id: 642, name: 'Thundurus', type: 'electric', power: 1100, rarity: 'Mythic' },
  { id: 643, name: 'Reshiram', type: 'dragon', power: 1300, rarity: 'Mythic' },
  { id: 644, name: 'Zekrom', type: 'dragon', power: 1300, rarity: 'Mythic' },
  { id: 645, name: 'Landorus', type: 'ground', power: 1100, rarity: 'Mythic' },
  { id: 716, name: 'Xerneas', type: 'fairy', power: 1300, rarity: 'Mythic' },
  { id: 717, name: 'Yveltal', type: 'dark', power: 1300, rarity: 'Mythic' },
  { id: 718, name: 'Zygarde', type: 'dragon', power: 1200, rarity: 'Mythic' },
  { id: 789, name: 'Cosmog', type: 'psychic', power: 500, rarity: 'Common' },
  { id: 790, name: 'Cosmoem', type: 'psychic', power: 800, rarity: 'Rare' },
  { id: 791, name: 'Solgaleo', type: 'psychic', power: 1400, rarity: 'Mythic' },
  { id: 792, name: 'Lunala', type: 'psychic', power: 1400, rarity: 'Mythic' },
];

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
  steel: { bg: 'bg-zinc-500/20', text: 'text-zinc-400', gradient: 'from-zinc-500 to-gray-500' },
  rock: { bg: 'bg-amber-500/20', text: 'text-amber-400', gradient: 'from-amber-500 to-yellow-500' },
  ground: { bg: 'bg-yellow-600/20', text: 'text-yellow-600', gradient: 'from-yellow-600 to-amber-600' },
  flying: { bg: 'bg-sky-500/20', text: 'text-sky-400', gradient: 'from-sky-500 to-indigo-500' },
  poison: { bg: 'bg-violet-500/20', text: 'text-violet-400', gradient: 'from-violet-500 to-purple-500' },
  bug: { bg: 'bg-lime-500/20', text: 'text-lime-400', gradient: 'from-lime-500 to-green-500' },
};

const rarityColors: Record<string, { text: string; border: string; glow: string }> = {
  Common: { text: 'text-gray-400', border: 'border-gray-400', glow: 'shadow-gray-400/20' },
  Uncommon: { text: 'text-green-400', border: 'border-green-400', glow: 'shadow-green-400/20' },
  Rare: { text: 'text-blue-400', border: 'border-blue-400', glow: 'shadow-blue-400/20' },
  Epic: { text: 'text-purple-400', border: 'border-purple-400', glow: 'shadow-purple-400/20' },
  Legendary: { text: 'text-amber-400', border: 'border-amber-400', glow: 'shadow-amber-400/20' },
  Mythic: { text: 'text-red-500', border: 'border-red-500', glow: 'shadow-red-500/30' },
};

const typeEmojis: Record<string, string> = {
  fire: '🔥', water: '💧', electric: '⚡', grass: '🌿',
  ice: '❄️', dragon: '🐉', ghost: '👻', fighting: '🥊',
  fairy: '🧚', psychic: '🧠', normal: '⚪', dark: '🌑',
  steel: '⚙️', rock: '🪨', ground: '🏜️', flying: '🪶',
  poison: '☠️', bug: '🐛',
};

export default function HomePage() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedRarity, setSelectedRarity] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [imageLoaded, setImageLoaded] = useState<Record<number, boolean>>({});

  const filteredMonsters = pokemonData.filter(m => {
    const matchesType = !selectedType || m.type === selectedType;
    const matchesRarity = !selectedRarity || m.rarity === selectedRarity;
    const matchesSearch = !searchTerm || m.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesRarity && matchesSearch;
  });

  const types = ['fire', 'water', 'electric', 'grass', 'ice', 'dragon', 'ghost', 'fighting', 'fairy', 'psychic'];
  const rarities = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic'];

  const getPokemonImageUrl = (id: number, variant: 'normal' | 'shiny' = 'normal') => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  };

  const getPokemonSpriteUrl = (id: number) => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
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
              Collect, Battle & Trade Real Pokemon NFT Characters
            </p>

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
            </div>
          </motion.div>
        </div>
      </div>

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
                      onError={() => {
                        // Fallback to sprite if official artwork fails
                        setImageLoaded(prev => ({ ...prev, [pokemon.id]: true }));
                      }}
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
            Images from PokeAPI • Trade with $MNMOON Token
          </p>
        </div>
      </footer>
    </div>
  );
}
