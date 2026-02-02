'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { Clock, Zap, Gift, Trophy, RefreshCw, Play, Pause, Coins, Gem, Timer } from 'lucide-react';

export default function AFKPage() {
  const { isConnected } = useAccount();
  const [farming, setFarming] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [drops, setDrops] = useState<any[]>([]);
  const [selectedMonster, setSelectedMonster] = useState(0);

  // Mock AFK data
  const myMonsters = [
    { name: 'Moon Dragon', power: 1250, emoji: '🐉', dropRate: 0.5 },
    { name: 'Shadow Wolf', power: 680, emoji: '🐺', dropRate: 0.8 },
    { name: 'Crystal Golem', power: 420, emoji: '🗿', dropRate: 1.2 },
    { name: 'Lightning Fox', power: 180, emoji: '🦊', dropRate: 2.0 },
  ];

  const dropTable = [
    { item: 'Common Chest', rarity: 'Common', chance: 40, value: '50-100 $MNMOON', emoji: '📦' },
    { item: 'Uncommon Chest', rarity: 'Uncommon', chance: 25, value: '100-250 $MNMOON', emoji: '🛍️' },
    { item: 'Rare Chest', rarity: 'Rare', chance: 15, value: '250-500 $MNMOON', emoji: '📿' },
    { item: 'Epic Chest', rarity: 'Epic', chance: 10, value: '500-1,000 $MNMOON', emoji: '💎' },
    { item: 'Legendary Chest', rarity: 'Legendary', chance: 7, value: '1,000-2,500 $MNMOON', emoji: '👑' },
    { item: 'Mythic Chest', rarity: 'Mythic', chance: 3, value: '5,000-10,000 $MNMOON', emoji: '🌟' },
  ];

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (farming) {
        setElapsed(prev => prev + 1);
        
        // Random drop every hour (simulated)
        if (elapsed > 0 && elapsed % 3600 === 0) {
          generateDrop();
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [farming, elapsed]);

  const generateDrop = () => {
    const rand = Math.random() * 100;
    let cumulative = 0;
    let selectedDrop = dropTable[dropTable.length - 1];
    
    for (const drop of dropTable) {
      cumulative += drop.chance;
      if (rand <= cumulative) {
        selectedDrop = drop;
        break;
      }
    }
    
    const newDrop = {
      ...selectedDrop,
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
    };
    
    setDrops(prev => [newDrop, ...prev.slice(0, 9)]);
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const monster = myMonsters[selectedMonster];
  const mythicDropTime = Math.ceil(100 / monster.dropRate);
  const progressToMythic = (elapsed % (mythicDropTime * 3600)) / (mythicDropTime * 3600) * 100;

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white">⏰ AFK Arena</h1>
          <p className="mt-2 text-gray-400">Passive farming with real-time drops! Works even when offline!</p>
        </div>

        {/* Main AFK Panel */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Farming Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-slate-800/50 border border-white/5 p-8"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 mb-4">
                <Clock className="h-12 w-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white">{formatTime(elapsed)}</h2>
              <p className="text-gray-400">Farming Time</p>
            </div>

            {/* Control */}
            <div className="flex justify-center space-x-4 mb-8">
              <button
                onClick={() => setFarming(!farming)}
                className={`flex items-center space-x-2 px-8 py-4 rounded-xl font-bold text-white transition-all ${
                  farming
                    ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500'
                    : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500'
                }`}
              >
                {farming ? (
                  <>
                    <Pause className="h-5 w-5" />
                    <span>Pause Farming</span>
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5" />
                    <span>Resume Farming</span>
                  </>
                )}
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-xl bg-slate-700/50">
                <Coins className="h-6 w-6 mx-auto text-amber-400" />
                <div className="mt-2 text-xl font-bold text-white">
                  {Math.floor(elapsed * 0.5)}
                </div>
                <div className="text-xs text-gray-400">$MNMOON/hr</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-slate-700/50">
                <Zap className="h-6 w-6 mx-auto text-blue-400" />
                <div className="mt-2 text-xl font-bold text-white">
                  {Math.floor(elapsed / 3600 * 10)}
                </div>
                <div className="text-xs text-gray-400">EXP/hr</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-slate-700/50">
                <Gift className="h-6 w-6 mx-auto text-purple-400" />
                <div className="mt-2 text-xl font-bold text-white">
                  {drops.length}
                </div>
                <div className="text-xs text-gray-400">Drops</div>
              </div>
            </div>
          </motion.div>

          {/* Monster Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl bg-slate-800/50 border border-white/5 p-8"
          >
            <h3 className="text-xl font-bold text-white mb-4">🦸 Select Farming Monster</h3>
            <div className="space-y-3">
              {myMonsters.map((m, index) => (
                <button
                  key={m.name}
                  onClick={() => setSelectedMonster(index)}
                  className={`w-full flex items-center space-x-4 p-4 rounded-xl transition-all ${
                    selectedMonster === index
                      ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-2 border-amber-500/50'
                      : 'bg-slate-700/50 border-2 border-transparent hover:border-white/10'
                  }`}
                >
                  <div className="text-4xl">{m.emoji}</div>
                  <div className="flex-1 text-left">
                    <div className="font-bold text-white">{m.name}</div>
                    <div className="text-sm text-gray-400">Power: {m.power.toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-purple-400">{m.dropRate}%</div>
                    <div className="text-xs text-gray-500">Mythic Chance</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Mythic Progress */}
            <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Gem className="h-5 w-5 text-red-400" />
                  <span className="font-bold text-white">Mythic Progress</span>
                </div>
                <span className="text-sm text-gray-400">~{mythicDropTime}h per drop</span>
              </div>
              <div className="h-4 rounded-full bg-slate-700 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-pink-500 transition-all duration-1000"
                  style={{ width: `${progressToMythic}%` }}
                />
              </div>
              <div className="mt-2 text-xs text-gray-400 text-center">
                {progressToMythic.toFixed(1)}% to next guaranteed Mythic drop
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Drops */}
        <div className="mt-8 rounded-2xl bg-slate-800/50 border border-white/5 p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">🎁 Recent Drops</h3>
            <span className="text-sm text-gray-400">{drops.length} drops this session</span>
          </div>

          {drops.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {drops.map((drop) => (
                <motion.div
                  key={drop.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-4 rounded-xl border ${
                    drop.rarity === 'Mythic' ? 'bg-red-500/20 border-red-500/30' :
                    drop.rarity === 'Legendary' ? 'bg-amber-500/20 border-amber-500/30' :
                    drop.rarity === 'Epic' ? 'bg-purple-500/20 border-purple-500/30' :
                    drop.rarity === 'Rare' ? 'bg-blue-500/20 border-blue-500/30' :
                    'bg-slate-700/50 border-white/10'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{drop.emoji}</span>
                    <div>
                      <div className={`font-bold ${
                        drop.rarity === 'Mythic' ? 'text-red-400' :
                        drop.rarity === 'Legendary' ? 'text-amber-400' :
                        drop.rarity === 'Epic' ? 'text-purple-400' :
                        drop.rarity === 'Rare' ? 'text-blue-400' :
                        'text-gray-400'
                      }`}>{drop.item}</div>
                      <div className="text-xs text-gray-400">{drop.timestamp}</div>
                    </div>
                  </div>
                  <div className="mt-2 text-sm text-gray-300">{drop.value}</div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Gift className="h-16 w-16 mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400">No drops yet. Keep farming!</p>
              <p className="text-sm text-gray-500 mt-2">Drops appear every hour of farming time</p>
            </div>
          )}
        </div>

        {/* Drop Table Info */}
        <div className="mt-8 rounded-2xl bg-slate-800/50 border border-white/5 p-8">
          <h3 className="text-xl font-bold text-white mb-6">📊 Drop Rates</h3>
          <div className="grid gap-3">
            {dropTable.map((drop, index) => (
              <div key={drop.item} className="flex items-center space-x-4 p-3 rounded-lg bg-slate-700/30">
                <span className="text-2xl">{drop.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white">{drop.item}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      drop.rarity === 'Mythic' ? 'bg-red-500/20 text-red-400' :
                      drop.rarity === 'Legendary' ? 'bg-amber-500/20 text-amber-400' :
                      drop.rarity === 'Epic' ? 'bg-purple-500/20 text-purple-400' :
                      drop.rarity === 'Rare' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-slate-500/20 text-gray-400'
                    }`}>{drop.rarity}</span>
                  </div>
                  <div className="text-sm text-gray-400">{drop.value}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-white">{drop.chance}%</div>
                  <div className="text-xs text-gray-500">chance</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Premium Bonus */}
        <div className="mt-8 rounded-2xl bg-gradient-to-r from-amber-500/10 to-pink-500/10 border border-amber-500/20 p-8">
          <div className="flex items-center space-x-4">
            <div className="text-5xl">⭐</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white">Premium Bonus!</h3>
              <p className="text-gray-400">Subscribe to get 2x drop rates and exclusive guaranteed Mythic drops!</p>
            </div>
            <a href="/subscription" className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-pink-500 font-bold text-white hover:opacity-90 transition-opacity">
              Subscribe
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
