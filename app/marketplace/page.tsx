'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const marketplacePokemon = [
  { id: 6, name: 'Charizard', type: 'fire', power: 500, price: 5000, seller: 'Trainer1', rarity: 'Rare', emoji: '🔥' },
  { id: 9, name: 'Blastoise', type: 'water', power: 500, price: 5000, seller: 'WaterPro', rarity: 'Rare', emoji: '💧' },
  { id: 25, name: 'Pikachu', type: 'electric', power: 120, price: 500, seller: 'AshFan', rarity: 'Common', emoji: '⚡' },
  { id: 3, name: 'Venusaur', type: 'grass', power: 500, price: 5000, seller: 'GreenThumb', rarity: 'Rare', emoji: '🌿' },
  { id: 94, name: 'Gengar', type: 'ghost', power: 500, price: 8000, seller: 'SpookyMasta', rarity: 'Epic', emoji: '👻' },
  { id: 149, name: 'Dragonite', type: 'dragon', power: 600, price: 15000, seller: 'DragonLord', rarity: 'Epic', emoji: '🐉' },
  { id: 150, name: 'Mewtwo', type: 'psychic', power: 1000, price: 50000, seller: 'Legendary', rarity: 'Legendary', emoji: '🧬' },
  { id: 282, name: 'Gardevoir', type: 'fairy', power: 450, price: 6000, seller: 'FairyQueen', rarity: 'Epic', emoji: '🧚' },
  { id: 68, name: 'Machamp', type: 'fighting', power: 480, price: 4000, seller: 'FighterX', rarity: 'Rare', emoji: '🥊' },
  { id: 130, name: 'Gyarados', type: 'water', power: 550, price: 7000, seller: 'SeaKing', rarity: 'Rare', emoji: '🐋' },
  { id: 491, name: 'Darkrai', type: 'dark', power: 1100, price: 100000, seller: 'NightMare', rarity: 'Mythic', emoji: '🌑' },
  { id: 493, name: 'Arceus', type: 'normal', power: 1500, price: 200000, seller: 'GodPokemon', rarity: 'Mythic', emoji: '⭐' },
  { id: 384, name: 'Rayquaza', type: 'dragon', power: 1300, price: 150000, seller: 'SkyDragon', rarity: 'Mythic', emoji: '🐲' },
  { id: 257, name: 'Blaziken', type: 'fighting', power: 550, price: 5500, seller: 'FireKick', rarity: 'Rare', emoji: '🔥' },
];

const shopItems = [
  { id: 'egg1', name: 'Pokemon Egg', type: 'egg', price: 100, emoji: '🥚', desc: 'Hatch a random Pokemon!', stock: 999 },
  { id: 'egg10', name: 'Egg Pack (10)', type: 'egg_pack', price: 900, emoji: '🥚🎁', desc: '10 eggs - 10% bonus', stock: 99 },
  { id: 'fire_aura', name: 'Fire Aura', type: 'aura', price: 2000, emoji: '🔥', desc: '+20% Fire damage', stock: 50 },
  { id: 'water_aura', name: 'Water Aura', type: 'aura', price: 2000, emoji: '💧', desc: '+20% Water defense', stock: 50 },
  { id: 'lightning_boost', name: 'Lightning Boost', type: 'boost', price: 1500, emoji: '⚡', desc: '+30% Electric damage', stock: 75 },
  { id: 'grass_crown', name: 'Grass Crown', type: 'cosmetic', price: 3000, emoji: '🌿', desc: 'Green avatar frame', stock: 25 },
  { id: 'dragon_wings', name: 'Dragon Wings', type: 'cosmetic', price: 5000, emoji: '🐉', desc: 'Dragon wings cosmetic', stock: 15 },
  { id: 'energy_pack', name: 'Energy Pack', type: 'consumable', price: 500, emoji: '⚡', desc: '+100 Energy', stock: 200 },
  { id: 'power_gem', name: 'Power Gem', type: 'consumable', price: 1000, emoji: '💎', desc: '+50 Power permanently', stock: 100 },
  { id: 'mystery_box', name: 'Mystery Box', type: 'mystery', price: 2500, emoji: '🎁', desc: 'Random rare item!', stock: 50 },
];

const typeEmojis: Record<string, string> = {
  fire: '🔥', water: '💧', electric: '⚡', grass: '🌿',
  ice: '❄️', dragon: '🐉', ghost: '👻', fighting: '🥊',
  fairy: '🧚', psychic: '🧠', normal: '⚪', dark: '🌑',
};

const typeColors: Record<string, { bg: string; text: string }> = {
  fire: { bg: 'bg-red-500/20', text: 'text-red-400' },
  water: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
  electric: { bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
  grass: { bg: 'bg-green-500/20', text: 'text-green-400' },
  ice: { bg: 'bg-cyan-500/20', text: 'text-cyan-400' },
  dragon: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
  ghost: { bg: 'bg-indigo-500/20', text: 'text-indigo-400' },
  fighting: { bg: 'bg-orange-500/20', text: 'text-orange-400' },
  fairy: { bg: 'bg-pink-500/20', text: 'text-pink-400' },
  psychic: { bg: 'bg-fuchsia-500/20', text: 'text-fuchsia-400' },
  normal: { bg: 'bg-gray-500/20', text: 'text-gray-400' },
  dark: { bg: 'bg-slate-500/20', text: 'text-slate-400' },
};

const rarityColors: Record<string, { text: string; border: string; glow: string }> = {
  Common: { text: 'text-gray-400', border: 'border-gray-400', glow: 'shadow-gray-400/20' },
  Uncommon: { text: 'text-green-400', border: 'border-green-400', glow: 'shadow-green-400/20' },
  Rare: { text: 'text-blue-400', border: 'border-blue-400', glow: 'shadow-blue-400/20' },
  Epic: { text: 'text-purple-400', border: 'border-purple-400', glow: 'shadow-purple-400/20' },
  Legendary: { text: 'text-amber-400', border: 'border-amber-400', glow: 'shadow-amber-400/20' },
  Mythic: { text: 'text-red-500', border: 'border-red-500', glow: 'shadow-red-500/30' },
};

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState<'marketplace' | 'shop'>('marketplace');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [selectedRarity, setSelectedRarity] = useState<string | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState<{ type: string; item: any } | null>(null);

  const filteredMarketplace = marketplacePokemon.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || p.type === filterType;
    const matchesRarity = !selectedRarity || p.rarity === selectedRarity;
    return matchesSearch && matchesType && matchesRarity;
  });

  const filteredShop = shopItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || item.type === filterType;
    return matchesSearch && matchesType;
  });

  const handlePurchase = (type: string, item: any) => {
    setShowPurchaseModal({ type, item });
  };

  const confirmPurchase = () => {
    if (showPurchaseModal) {
      alert(`Purchased ${showPurchaseModal.item.name} for ${showPurchaseModal.item.price} $MNMOON!`);
      setShowPurchaseModal(null);
    }
  };

  const getPokemonImageUrl = (id: number) => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  };

  const types = ['fire', 'water', 'electric', 'grass', 'ice', 'dragon', 'ghost', 'fighting', 'fairy', 'psychic', 'egg', 'aura', 'boost', 'cosmetic', 'consumable', 'mystery'];
  const rarities = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic'];

  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return `${(price / 1000).toFixed(1)}K`;
    }
    return price.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="bg-slate-800/50 border-b border-white/5 py-6 sticky top-14 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-white">
              {activeTab === 'marketplace' ? '🏪 Pokemon Marketplace' : '🛒 Item Shop'}
            </h1>
            <Link href="/" className="text-gray-400 hover:text-white">← Back</Link>
          </div>

          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                activeTab === 'marketplace'
? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                  : 'bg-slate-700 text-gray-400 hover:text-white'
              }`}
            >
              🏪 Buy Pokemon
            </button>
            <button
              onClick={() => setActiveTab('shop')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                activeTab === 'shop'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-slate-700 text-gray-400 hover:text-white'
              }`}
            >
              🛒 Item Shop
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder={activeTab === 'marketplace' ? 'Search Pokemon...' : 'Search items...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 min-w-48 px-4 py-3 rounded-xl bg-slate-700/50 text-white placeholder-gray-400 border border-white/10 focus:border-amber-500/50 focus:outline-none"
            />
            <select
              value={filterType || ''}
              onChange={(e) => setFilterType(e.target.value || null)}
              className="px-4 py-3 rounded-xl bg-slate-700/50 text-white border border-white/10 focus:border-amber-500/50 focus:outline-none"
            >
              <option value="">All Types</option>
              {activeTab === 'marketplace' ? (
                types.filter(t => !['egg', 'aura', 'boost', 'cosmetic', 'consumable', 'mystery'].includes(t)).map(type => (
                  <option key={type} value={type}>
                    {typeEmojis[type] || '📦'} {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))
              ) : (
                <>
                  <option value="egg">🥚 Eggs</option>
                  <option value="aura">✨ Auras</option>
                  <option value="boost">⚡ Boosts</option>
                  <option value="cosmetic">🎨 Cosmetics</option>
                  <option value="consumable">💊 Consumables</option>
                  <option value="mystery">🎁 Mystery</option>
                </>
              )}
            </select>
            {activeTab === 'marketplace' && (
              <select
                value={selectedRarity || ''}
                onChange={(e) => setSelectedRarity(e.target.value || null)}
                className="px-4 py-3 rounded-xl bg-slate-700/50 text-white border border-white/10 focus:border-amber-500/50 focus:outline-none"
              >
                <option value="">All Rarities</option>
                {rarities.map(rarity => (
                  <option key={rarity} value={rarity}>{rarity}</option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'marketplace' ? (
            <motion.div
              key="marketplace"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Your Balance</p>
                    <p className="text-2xl font-bold text-amber-400">12,500 $MNMOON</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Listed Pokemon</p>
                    <p className="text-2xl font-bold text-white">{filteredMarketplace.length}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredMarketplace.map((pokemon, index) => {
                  const colors = typeColors[pokemon.type] || typeColors.normal;
                  const rarity = rarityColors[pokemon.rarity];

                  return (
                    <motion.div
                      key={`${pokemon.id}-${index}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.03 }}
                      className={`relative bg-slate-800/50 rounded-xl p-4 border-2 ${rarity.border} hover:border-amber-500/50 transition-all hover:scale-105 cursor-pointer`}
                    >
                      <div className="text-center">
                        <div className="relative w-20 h-20 mx-auto mb-3">
                          <Image
                            src={getPokemonImageUrl(pokemon.id)}
                            alt={pokemon.name}
                            width={80}
                            height={80}
                            className="object-contain"
                          />
                        </div>
                        <h3 className="font-bold text-white">{pokemon.name}</h3>
                        <div className={`text-xs px-2 py-0.5 rounded-full inline-block mt-1 ${colors.bg} ${colors.text}`}>
                          {pokemon.rarity}
                        </div>
                        <div className="mt-2 flex items-center justify-center space-x-1 text-gray-400 text-sm">
                          <span>{typeEmojis[pokemon.type]}</span>
                          <span className="capitalize">{pokemon.type}</span>
                        </div>
                        <div className="mt-1 flex items-center justify-center space-x-1 text-amber-400">
                          <span>⚔️</span>
                          <span className="font-bold">{pokemon.power}</span>
                        </div>
                        <div className="mt-3 p-2 rounded-lg bg-slate-700/50">
                          <div className="text-xs text-gray-400 mb-1">Price</div>
                          <div className="text-xl font-bold text-white">{formatPrice(pokemon.price)} $MNMOON</div>
                          <div className="text-xs text-gray-500">@{pokemon.seller}</div>
                        </div>
                        <button
                          onClick={() => handlePurchase('pokemon', pokemon)}
                          className="mt-3 w-full py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 font-bold text-white hover:opacity-90 transition-opacity"
                        >
                          Buy Now
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {filteredMarketplace.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-bold text-white mb-2">No Pokemon Found</h3>
                  <p className="text-gray-400">Try adjusting your search or filters</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="shop"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Your Balance</p>
                    <p className="text-2xl font-bold text-amber-400">12,500 $MNMOON</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Available Items</p>
                    <p className="text-2xl font-bold text-white">{filteredShop.length}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredShop.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className="relative bg-slate-800/50 rounded-xl p-4 border border-white/5 hover:border-purple-500/30 transition-all hover:scale-105 cursor-pointer"
                  >
                    <div className="text-center">
                      <div className="text-5xl mb-3">{item.emoji}</div>
                      <h3 className="font-bold text-white">{item.name}</h3>
                      <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
                      <div className="mt-3 p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                        <div className="text-xs text-purple-300 mb-1">Price</div>
                        <div className="text-xl font-bold text-amber-400">{formatPrice(item.price)} $MNMOON</div>
                        <div className="text-xs text-gray-500">{item.stock} in stock</div>
                      </div>
                      <button
                        onClick={() => handlePurchase('item', item)}
                        className="mt-3 w-full py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 font-bold text-white hover:opacity-90 transition-opacity"
                      >
                        Buy
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredShop.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-bold text-white mb-2">No Items Found</h3>
                  <p className="text-gray-400">Try adjusting your search or filters</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showPurchaseModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowPurchaseModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-slate-800 rounded-2xl p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">
                  {showPurchaseModal.type === 'pokemon' ? '🐉' : '🛒'}
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">{showPurchaseModal.item.name}</h2>
                <p className="text-gray-400 mb-4">{showPurchaseModal.item.desc}</p>
                <div className="p-4 rounded-xl bg-slate-700/50 mb-4">
                  <p className="text-sm text-gray-400">Price</p>
                  <p className="text-3xl font-bold text-amber-400">{showPurchaseModal.item.price.toLocaleString()} $MNMOON</p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowPurchaseModal(null)}
                    className="flex-1 py-3 rounded-xl bg-slate-700 text-white font-bold hover:bg-slate-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmPurchase}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 font-bold text-white hover:opacity-90 transition-opacity"
                  >
                    Confirm
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
