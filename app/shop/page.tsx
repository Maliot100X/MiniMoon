'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { ShoppingCart, Star, Coins, Heart, Zap, Crown, Gem, Flame, Shield, Check, Filter, Search } from 'lucide-react';

export default function ShopPage() {
  const { isConnected, address } = useAccount();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [purchasing, setPurchasing] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: '🛒 All Items', icon: '🛒' },
    { id: 'avatars', name: '👤 Avatars', icon: '👤' },
    { id: 'backgrounds', name: '🎨 Backgrounds', icon: '🎨' },
    { id: 'effects', name: '✨ Effects', icon: '✨' },
    { id: 'badges', name: '🏅 Badges', icon: '🏅' },
    { id: 'energy', name: '⚡ Energy', icon: '⚡' },
  ];

  const shopItems = [
    // Avatars
    { id: 'avatar1', name: 'Dragon Avatar Pack', description: '10 exclusive dragon avatars', category: 'avatars', price: 500, emoji: '🐉', popular: true },
    { id: 'avatar2', name: 'Mythic Monsters', description: 'Rare mythic creature avatars', category: 'avatars', price: 1000, emoji: '🌟', popular: false },
    { id: 'avatar3', name: 'Pokemon Collection', description: 'All Pokemon-style avatars', category: 'avatars', price: 2500, emoji: '⚡', popular: false },
    { id: 'avatar4', name: 'Golden Avatars', description: 'Shiny golden avatar variants', category: 'avatars', price: 5000, emoji: '👑', popular: false },
    
    // Backgrounds
    { id: 'bg1', name: 'Sunset Paradise', description: 'Beautiful sunset gradient', category: 'backgrounds', price: 200, emoji: '🌅', popular: false },
    { id: 'bg2', name: 'Galaxy Space', description: 'Deep space nebula background', category: 'backgrounds', price: 500, emoji: '🌌', popular: true },
    { id: 'bg3', name: 'Crystal Cave', description: 'Glowing crystal formations', category: 'backgrounds', price: 800, emoji: '💎', popular: false },
    { id: 'bg4', name: 'Volcanic Lands', description: 'Lava and fire background', category: 'backgrounds', price: 1200, emoji: '🌋', popular: false },
    
    // Effects
    { id: 'effect1', name: 'Fire Aura', description: 'Fiery battle effects', category: 'effects', price: 2500, emoji: '🔥', popular: true },
    { id: 'effect2', name: 'Ice Crystal Shield', description: 'Cool ice defense visual', category: 'effects', price: 3000, emoji: '❄️', popular: false },
    { id: 'effect3', name: 'Lightning Storm', description: 'Electric attack effects', category: 'effects', price: 3500, emoji: '⚡', popular: false },
    { id: 'effect4', name: 'Rainbow Glow', description: 'Colorful aura effects', category: 'effects', price: 5000, emoji: '🌈', popular: false },
    { id: 'effect5', name: 'Shadow Cloak', description: 'Dark stealth effects', category: 'effects', price: 4000, emoji: '🌑', popular: false },
    
    // Badges
    { id: 'badge1', name: 'Champion Badge', description: 'Show off your victories', category: 'badges', price: 5000, emoji: '🏆', popular: true },
    { id: 'badge2', name: 'Veteran Badge', description: 'Long-time player status', category: 'badges', price: 3000, emoji: '🎖️', popular: false },
    { id: 'badge3', name: 'Whale Badge', description: 'Big spender recognition', category: 'badges', price: 10000, emoji: '🐋', popular: false },
    
    // Energy
    { id: 'energy1', name: 'Energy Pack (50)', description: '+50 energy points', category: 'energy', price: 100, emoji: '⚡', popular: true },
    { id: 'energy2', name: 'Energy Pack (200)', description: '+200 energy points', category: 'energy', price: 350, emoji: '🔋', popular: false },
    { id: 'energy3', name: 'Permanent Energy Boost', description: '+10 max energy forever', category: 'energy', price: 10000, emoji: '💪', popular: false },
  ];

  const myItems = {
    tokens: 12500,
    owned: ['bg1', 'effect1', 'avatar1', 'energy1', 'energy2'],
  };

  const filteredItems = selectedCategory === 'all'
    ? shopItems
    : shopItems.filter(item => item.category === selectedCategory);

  const purchaseItem = async (itemId: string) => {
    if (!isConnected) {
      alert('Connect wallet first!');
      return;
    }
    
    const item = shopItems.find(i => i.id === itemId);
    if (!item) return;
    
    if (myItems.owned.includes(itemId)) {
      alert('You already own this item!');
      return;
    }
    
    if (myItems.tokens < item.price) {
      alert('Not enough $MNMOON tokens!');
      return;
    }
    
    setPurchasing(itemId);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setPurchasing(null);
    alert(`Successfully purchased ${item.name}!`);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString();
  };

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white">🛒 Shop</h1>
          <p className="mt-2 text-gray-400">Upgrade your profile with exclusive items!</p>
        </div>

        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 p-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <Coins className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Your Balance</div>
                <div className="text-3xl font-bold text-white">{myItems.tokens.toLocaleString()} $MNMOON</div>
              </div>
            </div>
            <div className="flex space-x-3">
              <a href="/afk" className="px-6 py-2 rounded-xl bg-amber-500/20 text-amber-400 font-medium hover:bg-amber-500/30 transition-colors">
                Earn More ⏰
              </a>
              <a href="/subscription" className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 font-bold text-white hover:opacity-90 transition-opacity">
                Go Premium ⭐
              </a>
            </div>
          </div>
        </motion.div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                  : 'bg-slate-800/50 text-gray-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* Shop Items Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((item, index) => {
            const isOwned = myItems.owned.includes(item.id);
            const isPopular = item.popular;
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`relative rounded-2xl border-2 p-6 transition-all hover:scale-105 ${
                  isOwned
                    ? 'border-green-500/30 bg-green-500/5'
                    : item.popular
                    ? 'border-amber-500/50 bg-gradient-to-b from-amber-500/10 to-transparent'
                    : 'border-white/10 bg-slate-800/50 hover:border-white/20'
                }`}
              >
                {/* Popular Badge */}
                {isPopular && !isOwned && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center space-x-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 text-xs font-bold text-white">
                      <Star className="h-3 w-3" />
                      <span>Popular</span>
                    </span>
                  </div>
                )}

                {/* Owned Badge */}
                {isOwned && (
                  <div className="absolute -top-3 right-4">
                    <span className="inline-flex items-center space-x-1 rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white">
                      <Check className="h-3 w-3" />
                      <span>Owned</span>
                    </span>
                  </div>
                )}

                {/* Item Icon */}
                <div className="flex justify-center mb-4">
                  <div className={`h-20 w-20 rounded-2xl flex items-center justify-center text-5xl ${
                    isOwned ? 'bg-green-500/20' : 'bg-gradient-to-br from-amber-500/20 to-orange-500/20'
                  }`}>
                    {item.emoji}
                  </div>
                </div>

                {/* Item Info */}
                <div className="text-center">
                  <h3 className="font-bold text-white">{item.name}</h3>
                  <p className="mt-1 text-sm text-gray-400">{item.description}</p>
                </div>

                {/* Price & Buy Button */}
                <div className="mt-4">
                  <div className="flex items-center justify-center space-x-2 mb-3">
                    <Coins className="h-5 w-5 text-amber-400" />
                    <span className="text-2xl font-bold text-amber-400">{formatPrice(item.price)}</span>
                  </div>
                  
                  <button
                    onClick={() => purchaseItem(item.id)}
                    disabled={purchasing === item.id || isOwned}
                    className={`w-full py-3 rounded-xl font-bold transition-all ${
                      isOwned
                        ? 'bg-green-500/20 text-green-400 cursor-default'
                        : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90'
                    } disabled:opacity-50`}
                  >
                    {purchasing === item.id ? (
                      <span className="flex items-center justify-center space-x-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Buying...</span>
                      </span>
                    ) : isOwned ? (
                      'Owned ✓'
                    ) : (
                      'Buy Now'
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Premium Exclusive Items */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="text-4xl">⭐</div>
              <div>
                <h3 className="text-xl font-bold text-white">Premium Exclusive Items</h3>
                <p className="text-sm text-gray-400">Only available for premium subscribers</p>
              </div>
            </div>
            <a href="/subscription" className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 font-bold text-white hover:opacity-90 transition-opacity">
              Subscribe Now
            </a>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { emoji: '👑', name: 'Crown Avatar', desc: 'Exclusive royal avatar' },
              { emoji: '💎', name: 'Diamond Shield', desc: 'Premium profile frame' },
              { emoji: '🌈', name: 'Rainbow Aura', desc: 'Animated effect' },
              { emoji: '🔥', name: 'Phoenix Flame', desc: 'Battle effects' },
              { emoji: '❄️', name: 'Ice Crown', desc: 'Exclusive background' },
              { emoji: '🌟', name: 'Legend Badge', desc: 'VIP status symbol' },
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-3 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <div className="text-3xl">{item.emoji}</div>
                <div>
                  <div className="font-bold text-white">{item.name}</div>
                  <div className="text-xs text-gray-400">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Added */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-6">🆕 Recently Added</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {shopItems.slice(0, 4).map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-4 p-4 rounded-xl bg-slate-800/50 border border-white/5"
              >
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center text-2xl">
                  {item.emoji}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-white text-sm">{item.name}</div>
                  <div className="text-xs text-amber-400">{formatPrice(item.price)} $MNMOON</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* How to Earn */}
        <div className="mt-8 rounded-2xl bg-slate-800/50 border border-white/5 p-8">
          <h3 className="text-xl font-bold text-white mb-4">💰 How to Earn More $MNMOON</h3>
          <div className="grid gap-4 sm:grid-cols-4">
            {[
              { icon: '⚔️', title: 'Win Battles', desc: 'Earn from PvP wins', amount: '+50-200' },
              { icon: '🏰', title: 'Complete Dungeons', desc: 'Dungeon rewards', amount: '+100-5000' },
              { icon: '📅', title: 'Daily Quests', desc: 'Complete quests', amount: '+25-500' },
              { icon: '⏰', title: 'AFK Farming', desc: 'Passive drops', amount: 'Variable' },
            ].map((method, index) => (
              <div key={index} className="text-center p-4 rounded-xl bg-slate-700/30">
                <div className="text-3xl mb-2">{method.icon}</div>
                <h4 className="font-bold text-white">{method.title}</h4>
                <p className="text-sm text-gray-400">{method.desc}</p>
                <div className="mt-2 text-amber-400 font-bold">{method.amount}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
