'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import {
  Search,
  Filter,
  Heart,
  ShoppingCart,
  User,
  Star,
  Sword,
  Shield,
  Zap,
  TrendingUp,
  Clock,
  Loader2,
} from 'lucide-react';

const marketplaceListings = [
  {
    id: 1,
    name: 'Moon Dragon',
    rarity: 'Legendary',
    power: 1250,
    health: 2500,
    attack: 180,
    defense: 120,
    speed: 95,
    level: 45,
    wins: 156,
    price: '2.5 ETH',
    seller: '0x1234...5678',
    listed: '2h ago',
    image: '🦖',
  },
  {
    id: 2,
    name: 'Shadow Wolf',
    rarity: 'Epic',
    power: 680,
    health: 1200,
    attack: 95,
    defense: 65,
    speed: 150,
    level: 28,
    wins: 89,
    price: '0.8 ETH',
    seller: '0xabcd...efgh',
    listed: '5h ago',
    image: '🐺',
  },
  {
    id: 3,
    name: 'Crystal Golem',
    rarity: 'Rare',
    power: 420,
    health: 1800,
    attack: 55,
    defense: 180,
    speed: 20,
    level: 22,
    wins: 45,
    price: '0.15 ETH',
    seller: '0x9876...5432',
    listed: '1d ago',
    image: '🗿',
  },
  {
    id: 4,
    name: 'Lightning Fox',
    rarity: 'Uncommon',
    power: 180,
    health: 450,
    attack: 42,
    defense: 28,
    speed: 120,
    level: 12,
    wins: 23,
    price: '0.05 ETH',
    seller: '0xijkl...mnop',
    listed: '3h ago',
    image: '🦊',
  },
  {
    id: 5,
    name: 'Flame Phoenix',
    rarity: 'Mythic',
    power: 2800,
    health: 3500,
    attack: 350,
    defense: 200,
    speed: 180,
    level: 72,
    wins: 312,
    price: '8.5 ETH',
    seller: '0xqueen...king',
    listed: '30m ago',
    image: '🔥',
  },
  {
    id: 6,
    name: 'Forest Spirit',
    rarity: 'Common',
    power: 85,
    health: 250,
    attack: 22,
    defense: 18,
    speed: 65,
    level: 6,
    wins: 8,
    price: '0.01 ETH',
    seller: '0xnewb...ie',
    listed: '6h ago',
    image: '🧚',
  },
];

const rarityColors = {
  Common: 'text-gray-400 bg-gray-400/10 border-gray-400/20',
  Uncommon: 'text-green-400 bg-green-400/10 border-green-400/20',
  Rare: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  Epic: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  Legendary: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  Mythic: 'text-red-400 bg-red-400/10 border-red-400/20',
};

const rarityGradients = {
  Common: 'from-gray-500 to-gray-600',
  Uncommon: 'from-green-500 to-green-600',
  Rare: 'from-blue-500 to-blue-600',
  Epic: 'from-purple-500 to-purple-600',
  Legendary: 'from-amber-500 to-orange-500',
  Mythic: 'from-red-500 to-pink-500',
};

export default function MarketplacePage() {
  const { isConnected } = useAccount();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRarity, setSelectedRarity] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [buying, setBuying] = useState<number | null>(null);
  const [liked, setLiked] = useState<Set<number>>(new Set());

  const filteredListings = marketplaceListings.filter((listing) => {
    const matchesSearch = listing.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRarity = selectedRarity === 'All' || listing.rarity === selectedRarity;
    return matchesSearch && matchesRarity;
  });

  const handleBuy = async (listingId: number) => {
    if (!isConnected) {
      alert('Please connect your wallet first!');
      return;
    }
    setBuying(listingId);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setBuying(null);
    alert('Purchase successful! Monster transferred to your wallet.');
  };

  const toggleLike = (id: number) => {
    const newLiked = new Set(liked);
    if (newLiked.has(id)) {
      newLiked.delete(id);
    } else {
      newLiked.add(id);
    }
    setLiked(newLiked);
  };

  const stats = {
    totalListings: marketplaceListings.length,
    avgPrice: '0.45 ETH',
    volume24h: '125 ETH',
    floorPrice: '0.01 ETH',
  };

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">Marketplace</h1>
          <p className="mt-2 text-gray-400">
            Buy, sell, and trade monsters with other players
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-4 mb-8">
          <div className="rounded-xl bg-slate-800/50 p-6 border border-white/5">
            <div className="flex items-center space-x-3">
              <div className="rounded-lg bg-blue-500/20 p-2">
                <ShoppingCart className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Total Listings</div>
                <div className="text-2xl font-bold text-white">{stats.totalListings}</div>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-slate-800/50 p-6 border border-white/5">
            <div className="flex items-center space-x-3">
              <div className="rounded-lg bg-amber-500/20 p-2">
                <TrendingUp className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Avg Price</div>
                <div className="text-2xl font-bold text-white">{stats.avgPrice}</div>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-slate-800/50 p-6 border border-white/5">
            <div className="flex items-center space-x-3">
              <div className="rounded-lg bg-green-500/20 p-2">
                <Zap className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <div className="text-sm text-gray-400">24h Volume</div>
                <div className="text-2xl font-bold text-white">{stats.volume24h}</div>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-slate-800/50 p-6 border border-white/5">
            <div className="flex items-center space-x-3">
              <div className="rounded-lg bg-purple-500/20 p-2">
                <Star className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Floor Price</div>
                <div className="text-2xl font-bold text-white">{stats.floorPrice}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search monsters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl bg-slate-800 py-3 pl-12 pr-4 text-white placeholder-gray-500 border border-white/5 focus:border-amber-500/50 focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-4">
            {/* Rarity Filter */}
            <select
              value={selectedRarity}
              onChange={(e) => setSelectedRarity(e.target.value)}
              className="rounded-xl bg-slate-800 py-3 px-4 text-white border border-white/5 focus:border-amber-500/50 focus:outline-none"
            >
              <option value="All">All Rarities</option>
              <option value="Common">Common</option>
              <option value="Uncommon">Uncommon</option>
              <option value="Rare">Rare</option>
              <option value="Epic">Epic</option>
              <option value="Legendary">Legendary</option>
              <option value="Mythic">Mythic</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl bg-slate-800 py-3 px-4 text-white border border-white/5 focus:border-amber-500/50 focus:outline-none"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="power">Power</option>
            </select>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredListings.map((listing, index) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl bg-slate-800/50 border border-white/5 card-hover"
            >
              {/* Card Header with Monster Image */}
              <div className={`relative bg-gradient-to-br ${rarityGradients[listing.rarity as keyof typeof rarityGradients]} p-8`}>
                <div className="flex items-center justify-between">
                  <span className={`rounded-full border px-3 py-1 text-xs font-bold ${rarityColors[listing.rarity as keyof typeof rarityColors]}`}>
                    {listing.rarity}
                  </span>
                  <button
                    onClick={() => toggleLike(listing.id)}
                    className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
                  >
                    <Heart className={`h-5 w-5 ${liked.has(listing.id) ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                </div>
                <div className="mt-6 flex items-center justify-center">
                  <span className="text-8xl filter drop-shadow-lg">{listing.image}</span>
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-2xl font-bold text-white">{listing.name}</h3>
                  <p className="text-white/70">Level {listing.level}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="p-6">
                {/* Power & Health */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Sword className="h-4 w-4 text-red-400" />
                    <span className="text-sm text-gray-400">Power</span>
                  </div>
                  <span className="font-bold text-white">{listing.power.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-green-400" />
                    <span className="text-sm text-gray-400">Health</span>
                  </div>
                  <span className="font-bold text-white">{listing.health.toLocaleString()}</span>
                </div>

                {/* Secondary Stats */}
                <div className="grid grid-cols-3 gap-4 py-4 border-t border-white/5">
                  <div className="text-center">
                    <div className="text-xs text-gray-500">ATK</div>
                    <div className="font-bold text-white">{listing.attack}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">DEF</div>
                    <div className="font-bold text-white">{listing.defense}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-500">SPD</div>
                    <div className="font-bold text-white">{listing.speed}</div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/5">
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <User className="h-4 w-4" />
                    <span>{listing.seller}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span>{listing.listed}</span>
                  </div>
                </div>

                {/* Buy Button */}
                <button
                  onClick={() => handleBuy(listing.id)}
                  disabled={buying === listing.id}
                  className="mt-6 w-full flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-4 font-bold text-white hover:from-amber-400 hover:to-amber-500 transition-all disabled:opacity-50"
                >
                  {buying === listing.id ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Buying...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5" />
                      <span>Buy for {listing.price}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${rarityGradients[listing.rarity as keyof typeof rarityGradients]} opacity-0 transition-opacity group-hover:opacity-10 blur-xl`} />
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredListings.length === 0 && (
          <div className="text-center py-16">
            <ShoppingCart className="mx-auto h-16 w-16 text-gray-600" />
            <h3 className="mt-4 text-xl font-bold text-white">No monsters found</h3>
            <p className="mt-2 text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
