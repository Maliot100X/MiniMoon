'use client';

import { motion } from 'framer-motion';
import { Sword, Shield, Zap, Heart } from 'lucide-react';

interface MonsterCardProps {
  name: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
  power: number;
  health: number;
  attack: number;
  defense: number;
  speed: number;
  level: number;
  image?: string;
  energy?: number;
  maxEnergy?: number;
  onClick?: () => void;
  selected?: boolean;
}

const rarityColors = {
  Common: {
    gradient: 'from-gray-500 to-gray-600',
    border: 'border-gray-500/50',
    glow: 'shadow-gray-500/30',
    text: 'text-gray-400',
  },
  Uncommon: {
    gradient: 'from-green-500 to-green-600',
    border: 'border-green-500/50',
    glow: 'shadow-green-500/30',
    text: 'text-green-400',
  },
  Rare: {
    gradient: 'from-blue-500 to-blue-600',
    border: 'border-blue-500/50',
    glow: 'shadow-blue-500/30',
    text: 'text-blue-400',
  },
  Epic: {
    gradient: 'from-purple-500 to-purple-600',
    border: 'border-purple-500/50',
    glow: 'shadow-purple-500/30',
    text: 'text-purple-400',
  },
  Legendary: {
    gradient: 'from-amber-500 to-orange-500',
    border: 'border-amber-500/50',
    glow: 'shadow-amber-500/30',
    text: 'text-amber-400',
  },
  Mythic: {
    gradient: 'from-red-500 to-pink-500',
    border: 'border-red-500/50',
    glow: 'shadow-red-500/30',
    text: 'text-red-400',
  },
};

export function MonsterCard({
  name,
  rarity,
  power,
  health,
  attack,
  defense,
  speed,
  level,
  image,
  energy,
  maxEnergy,
  onClick,
  selected = false,
}: MonsterCardProps) {
  const colors = rarityColors[rarity];
  const energyPercent = energy && maxEnergy ? (energy / maxEnergy) * 100 : 100;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl bg-slate-800/50 border-2 transition-all cursor-pointer ${
        selected ? `${colors.border} ring-2 ring-amber-500/50` : 'border-white/5'
      } ${onClick ? 'card-hover' : ''}`}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-5`} />

      {/* Header */}
      <div className={`relative bg-gradient-to-br ${colors.gradient} p-4`}>
        <div className="flex items-center justify-between">
          <span className={`rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold text-white`}>
            {rarity}
          </span>
          <div className="flex items-center space-x-1 rounded-full bg-white/10 px-2 py-1">
            <span className="text-xs text-white">Lv.{level}</span>
          </div>
        </div>

        {/* Monster Image/Icon */}
        <div className="mt-4 flex items-center justify-center">
          <div className="relative">
            <div className={`h-20 w-20 rounded-full bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-4xl shadow-lg`}>
              {image || '🐉'}
            </div>
            {rarity === 'Mythic' && (
              <div className="absolute -inset-2 rounded-full animate-ping bg-red-500/50" />
            )}
          </div>
        </div>

        {/* Name */}
        <div className="mt-3 text-center">
          <h3 className="text-lg font-bold text-white">{name}</h3>
        </div>
      </div>

      {/* Stats */}
      <div className="p-4">
        {/* Power & Health */}
        <div className="space-y-3">
          {/* Power */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sword className={`h-4 w-4 ${colors.text}`} />
              <span className="text-sm text-gray-400">Power</span>
            </div>
            <span className="font-bold text-white">{power.toLocaleString()}</span>
          </div>

          {/* Health */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className={`h-4 w-4 ${colors.text}`} />
              <span className="text-sm text-gray-400">Health</span>
            </div>
            <span className="font-bold text-white">{health.toLocaleString()}</span>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-slate-700/50 p-3">
          <div className="text-center">
            <div className="text-xs text-gray-500">ATK</div>
            <div className="font-bold text-white">{attack}</div>
          </div>
          <div className="text-center border-l border-r border-white/10">
            <div className="text-xs text-gray-500">DEF</div>
            <div className="font-bold text-white">{defense}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500">SPD</div>
            <div className="font-bold text-white">{speed}</div>
          </div>
        </div>

        {/* Energy Bar */}
        {energy !== undefined && maxEnergy && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-amber-400" />
                <span className="text-gray-400">Energy</span>
              </div>
              <span className="text-white">{energy}/{maxEnergy}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-400"
                initial={{ width: 0 }}
                animate={{ width: `${energyPercent}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Selection Ring */}
      {selected && (
        <div className="absolute inset-0 rounded-2xl border-2 border-amber-500 animate-pulse pointer-events-none" />
      )}

      {/* Glow Effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 transition-opacity group-hover:opacity-10 blur-xl pointer-events-none`} />
    </motion.div>
  );
}

interface MonsterCardSkeletonProps {
  showEnergy?: boolean;
}

export function MonsterCardSkeleton({ showEnergy = false }: MonsterCardSkeletonProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-slate-800/50 border border-white/5">
      <div className="p-4 skeleton h-48" />
      <div className="p-4 space-y-3">
        <div className="h-4 rounded skeleton w-3/4" />
        <div className="h-4 rounded skeleton w-1/2" />
        <div className="h-16 rounded skeleton" />
        {showEnergy && <div className="h-8 rounded skeleton" />}
      </div>
    </div>
  );
}
