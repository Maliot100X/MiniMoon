'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount } from 'wagmi';

// Placeholder - In production, fetch from smart contract
const marketplacePokemon: any[] = [];

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

const rarityColors: Record<string, { text: string; border: string; glow: string; bg: string }> = {
  Common: { text: 'text-gray-400', border: 'border-gray-400', glow: 'shadow-gray-400/20', bg: 'bg-gray-500/20' },
  Uncommon: { text: 'text-green-400', border: 'border-green-400', glow: 'shadow-green-400/20', bg: 'bg-green-500/20' },
  Rare: { text: 'text-blue-400', border: 'border-blue-400', glow: 'shadow-blue-400/20', bg: 'bg-blue-500/20' },
  Epic: { text: 'text-purple-400', border: 'border-purple-400', glow: 'shadow-purple-400/20', bg: 'bg-purple-500/20' },
  Legendary: { text: 'text-amber-400', border: 'border-amber-400', glow: 'shadow-amber-400/20', bg: 'bg-amber-500/20' },
  Mythic: { text: 'text-red-500', border: 'border-red-500', glow: 'shadow-red-500/30', bg: 'bg-red-500/30' },
};

export default function MarketplacePage() {
  const { isConnected } = useAccount();
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="bg-slate-800/50 border-b border-white/5 py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center space-x-3">
              <Link href="/" className="text-gray-400 hover:text-white">←</Link>
              <h1 className="text-3xl font-bold text-white">🏪 Marketplace</h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('marketplace')}
                className={`px-6 py-2 rounded-xl font-bold transition-all ${
                  activeTab === 'marketplace'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                    : 'bg-slate-700 text-gray-400 hover:text-white'
                }`}
              >
                Pokemon
              </button>
              <button
                onClick={() => setActiveTab('shop')}
                className={`px-6 py-2 rounded-xl font-bold transition-all ${
                  activeTab === 'shop'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                    : 'bg-slate-700 text-gray-400 hover:text-white'
                }`}
              >
                Shop
              </button>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap gap-4">
            <input
              type="text"
              placeholder={`Search ${activeTab === 'marketplace' ? 'Pokemon' : 'items'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 min-w-[200px] px-4 py-2 rounded-xl bg-slate-700/50 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 border border-white/10"
            />
            <select
              value={filterType || ''}
              onChange={(e) => setFilterType(e.target.value || null)}
              className="px-4 py-2 rounded-xl bg-slate-700/50 text-white focus:outline-none border border-white/10"
            >
              <option value="">All Types</option>
              {Object.keys(typeEmojis).map((type) => (
                <option key={type} value={type}>{typeEmojis[type]} {type}</option>
              ))}
            </select>
            {activeTab === 'marketplace' && (
              <select
                value={selectedRarity || ''}
                onChange={(e) => setSelectedRarity(e.target.value || null)}
                className="px-4 py-2 rounded-xl bg-slate-700/50 text-white focus:outline-none border border-white/10"
              >
                <option value="">All Rarities</option>
                {Object.keys(rarityColors).map((rarity) => (
                  <option key={rarity} value={rarity}>{rarity}</option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'marketplace' ? (
            <motion.div
              key="marketplace"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {filteredMarketplace.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">🏪</div>
                  <h2 className="text-2xl font-bold text-white mb-2">No Pokemon Listed</h2>
                  <p className="text-gray-400 mb-4">Be the first to list your Pokemon for sale!</p>
                  <p className="text-sm text-gray-500">Connect your wallet and list Pokemon from your inventory</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredMarketplace.map((pokemon) => {
                    const colors = typeColors[pokemon.type] || typeColors.normal;
                    const rarity = rarityColors[pokemon.rarity];
                    return (
                      <motion.div
                        key={pokemon.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`p-4 rounded-xl border ${rarity.border} ${rarity.bg} bg-slate-800/50`}
                      >
                        <div className="relative mb-3">
                          <Image
                            src={getPokemonImageUrl(pokemon.id)}
                            alt={pokemon.name}
                            width={96}
                            height={96}
                            className="mx-auto"
                          />
                          <span className={`absolute top-0 right-0 px-2 py-1 rounded-full text-xs font-bold ${colors.bg} ${colors.text}`}>
                            {typeEmojis[pokemon.type]}
                          </span>
                        </div>
                        <h3 className="font-bold text-white text-center">{pokemon.name}</h3>
                        <div className="flex items-center justify-between mt-2 text-sm">
                          <span className={`font-bold ${rarity.text}`}>{pokemon.rarity}</span>
                          <span className="text-amber-400">⚔️ {pokemon.power}</span>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-gray-400 text-sm">@{pokemon.seller}</span>
                          <button
                            onClick={() => handlePurchase('pokemon', pokemon)}
                            className="px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm"
                          >
                            {pokemon.price.toLocaleString()} 🪙
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {filteredShop.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-xl bg-slate-800/50 border border-white/5 hover:border-amber-500/30 transition-colors"
                  >
                    <div className="text-4xl mb-3 text-center">{item.emoji}</div>
                    <h3 className="font-bold text-white text-center text-sm">{item.name}</h3>
                    <p className="text-gray-400 text-xs text-center mt-1">{item.desc}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-gray-500 text-xs">{item.stock} left</span>
                      <button
                        onClick={() => handlePurchase('item', item)}
                        className="px-3 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm"
                      >
                        {item.price.toLocaleString()} 🪙
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Purchase Modal */}
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
              <h2 className="text-xl font-bold text-white mb-4">Confirm Purchase</h2>
              <div className="text-center py-4">
                {showPurchaseModal.type === 'pokemon' ? (
                  <>
                    <Image
                      src={getPokemonImageUrl(showPurchaseModal.item.id)}
                      alt={showPurchaseModal.item.name}
                      width={100}
                      height={100}
                      className="mx-auto mb-4"
                    />
                    <h3 className="text-lg font-bold text-white">{showPurchaseModal.item.name}</h3>
                    <p className="text-gray-400">{showPurchaseModal.item.rarity} • ⚔️ {showPurchaseModal.item.power}</p>
                  </>
                ) : (
                  <>
                    <div className="text-6xl mb-4">{showPurchaseModal.item.emoji}</div>
                    <h3 className="text-lg font-bold text-white">{showPurchaseModal.item.name}</h3>
                    <p className="text-gray-400">{showPurchaseModal.item.desc}</p>
                  </>
                )}
              </div>
              <div className="bg-slate-700/50 rounded-xl p-4 mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Price</span>
                  <span className="text-amber-400 font-bold">{showPurchaseModal.item.price.toLocaleString()} $MNMOON</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Stock</span>
                  <span className="text-white">{showPurchaseModal.item.stock}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPurchaseModal(null)}
                  className="flex-1 py-3 rounded-xl bg-slate-700 text-white font-bold hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmPurchase}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 font-bold text-white"
                >
                  Buy Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

