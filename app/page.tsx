'use client';

import { useAccount } from 'wagmi';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sword,
  Shield,
  Sparkles,
  Users,
  Trophy,
  Zap,
  Skull,
  Coins,
  Star,
  ArrowRight,
  Sparkle,
} from 'lucide-react';

const features = [
  {
    icon: Sword,
    title: 'Epic Battles',
    description: 'Challenge dungeons with your monsters. Strategic combat with real rewards.',
    color: 'from-red-500 to-red-600',
  },
  {
    icon: Coins,
    title: 'Play to Earn',
    description: 'Earn $MNMOON tokens through victories, quests, and marketplace trading.',
    color: 'from-amber-500 to-amber-600',
  },
  {
    icon: Skull,
    title: 'Permadeath Mode',
    description: 'True roguelike experience. Risk everything for legendary loot.',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: Users,
    title: 'Trading Economy',
    description: 'Buy, sell, and trade monsters on the decentralized marketplace.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: Sparkles,
    title: '6 Rarity Tiers',
    description: 'Common to Mythic. Each rarity brings more power and prestige.',
    color: 'from-pink-500 to-pink-600',
  },
  {
    icon: Trophy,
    title: 'Quest System',
    description: 'Daily and weekly quests with exclusive rewards and bonuses.',
    color: 'from-green-500 to-green-600',
  },
];

const rarityTiers = [
  { name: 'Common', color: 'text-gray-400', bg: 'bg-gray-500', chance: '50%' },
  { name: 'Uncommon', color: 'text-green-400', bg: 'bg-green-500', chance: '25%' },
  { name: 'Rare', color: 'text-blue-400', bg: 'bg-blue-500', chance: '15%' },
  { name: 'Epic', color: 'text-purple-400', bg: 'bg-purple-500', chance: '7%' },
  { name: 'Legendary', color: 'text-amber-400', bg: 'bg-amber-500', chance: '2.5%' },
  { name: 'Mythic', color: 'text-red-400', bg: 'bg-red-500', chance: '0.5%' },
];

export default function HomePage() {
  const { isConnected } = useAccount();

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative px-4 pt-20 pb-32 sm:px-6 lg:px-8">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/4 h-96 w-96 rounded-full bg-amber-500/20 blur-3xl" />
          <div className="absolute -bottom-1/2 -right-1/4 h-96 w-96 rounded-full bg-pink-500/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 rounded-full bg-amber-500/10 px-4 py-2 text-sm text-amber-400 border border-amber-500/20 mb-8"
            >
              <Sparkle className="h-4 w-4" />
              <span>Now Live on Base Chain</span>
            </motion.div>

            {/* Title */}
            <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight sm:text-7xl">
              <span className="bg-gradient-to-r from-white via-amber-100 to-amber-400 bg-clip-text text-transparent">
                Collect. Battle.
              </span>
              <br />
              <span className="bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500 bg-clip-text text-transparent moon-glow">
                Conquer.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400 sm:text-xl">
              The ultimate Meta Trading Game on Base. Collect mythical creatures,
              conquer dungeons, and build your legend in a player-owned economy.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dungeons"
                className="group relative flex items-center space-x-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-amber-500/25 hover:from-amber-400 hover:to-amber-500 transition-all"
              >
                <Sword className="h-5 w-5" />
                <span>Start Playing</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/marketplace"
                className="flex items-center space-x-2 rounded-full bg-slate-800 px-8 py-4 text-lg font-medium text-white hover:bg-slate-700 transition-colors border border-slate-700"
              >
                <Shield className="h-5 w-5" />
                <span>Explore Marketplace</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
              {[
                { value: '10K+', label: 'Active Players' },
                { value: '50K+', label: 'Monsters Bred' },
                { value: '$2M+', label: 'Volume Traded' },
                { value: '5', label: 'Dungeons' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold text-white sm:text-4xl">{stat.value}</div>
                  <div className="mt-1 text-sm text-gray-500">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Game Features
            </h2>
            <p className="mt-4 text-lg text-gray-400">
              Everything you need for the ultimate monster-collecting experience
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group card-hover relative overflow-hidden rounded-2xl bg-slate-800/50 p-8 border border-white/5"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 transition-opacity group-hover:opacity-10`} />
                <div className={`inline-flex rounded-xl bg-gradient-to-br ${feature.color} p-3 shadow-lg`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Rarity Section */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Monster Rarities
            </h2>
            <p className="mt-4 text-lg text-gray-400">
              Discover all six rarity tiers. Higher rarity means more power!
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rarityTiers.map((rarity, index) => (
              <motion.div
                key={rarity.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`relative overflow-hidden rounded-2xl ${rarity.bg} p-6 text-white`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Star className={`h-6 w-6 ${index === 5 ? 'animate-pulse' : ''}`} />
                    <span className="text-xl font-bold">{rarity.name}</span>
                  </div>
                  <span className="rounded-full bg-white/20 px-3 py-1 text-sm font-medium">
                    {rarity.chance} drop rate
                  </span>
                </div>
                <div className="mt-4 h-2 rounded-full bg-white/20">
                  <div
                    className="h-full rounded-full bg-white/80 transition-all"
                    style={{ width: `${(index + 1) * 15}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 to-pink-500 p-12 text-center"
          >
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Ready to Begin Your Adventure?
              </h2>
              <p className="mt-4 text-lg text-white/80">
                Connect your wallet and start collecting monsters today!
              </p>
              <div className="mt-8">
                <Link
                  href="/dungeons"
                  className="inline-flex items-center space-x-2 rounded-full bg-white px-8 py-4 text-lg font-bold text-amber-600 hover:bg-gray-100 transition-colors"
                >
                  <Zap className="h-5 w-5" />
                  <span>Start Playing Now</span>
                </Link>
              </div>
            </div>
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <span className="text-sm font-bold text-white">M</span>
              </div>
              <span className="font-bold text-white">MiniMoon</span>
            </div>
            <p className="text-sm text-gray-500">
              Built on Base Chain. Powered by Ethereum.
            </p>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Twitter
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Discord
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
