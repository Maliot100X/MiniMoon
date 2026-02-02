'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount } from 'wagmi';
import { Sword, Shield, Zap, Flame, Skull, Trophy, Crown, Star, Target, Users } from 'lucide-react';

interface Pokemon {
  id: number;
  name: string;
  type: string;
  power: number;
  health: number;
  maxHealth: number;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
  effects: string[];
}

const myTeam: Pokemon[] = [
  { id: 6, name: 'Charizard', type: 'fire', power: 500, health: 500, maxHealth: 500, rarity: 'Rare', effects: ['burn', 'flying'] },
  { id: 9, name: 'Blastoise', type: 'water', power: 500, health: 550, maxHealth: 550, rarity: 'Rare', effects: ['defense', 'water'] },
  { id: 149, name: 'Dragonite', type: 'dragon', power: 600, health: 600, maxHealth: 600, rarity: 'Epic', effects: ['dragon', 'flying'] },
  { id: 94, name: 'Gengar', type: 'ghost', power: 500, health: 480, maxHealth: 480, rarity: 'Epic', effects: ['ghost', 'poison'] },
  { id: 130, name: 'Gyarados', type: 'water', power: 550, health: 550, maxHealth: 550, rarity: 'Rare', effects: ['water', 'flying'] },
  { id: 25, name: 'Pikachu', type: 'electric', power: 120, health: 120, maxHealth: 120, rarity: 'Common', effects: ['electric'] },
];

const enemyTeam: Pokemon[] = [
  { id: 150, name: 'Mewtwo', type: 'psychic', power: 1000, health: 1000, maxHealth: 1000, rarity: 'Legendary', effects: ['psychic', 'telepathy'] },
  { id: 384, name: 'Rayquaza', type: 'dragon', power: 1300, health: 1300, maxHealth: 1300, rarity: 'Mythic', effects: ['dragon', 'sky'] },
  { id: 144, name: 'Articuno', type: 'ice', power: 900, health: 900, maxHealth: 900, rarity: 'Legendary', effects: ['ice', 'flying'] },
  { id: 145, name: 'Zapdos', type: 'electric', power: 900, health: 900, maxHealth: 900, rarity: 'Legendary', effects: ['electric', 'flying'] },
  { id: 146, name: 'Moltres', type: 'fire', power: 900, health: 900, maxHealth: 900, rarity: 'Legendary', effects: ['fire', 'flying'] },
  { id: 493, name: 'Arceus', type: 'normal', power: 1500, health: 1500, maxHealth: 1500, rarity: 'Mythic', effects: ['god', 'normal'] },
];

const typeEmojis: Record<string, string> = {
  fire: '🔥', water: '💧', electric: '⚡', grass: '🌿',
  ice: '❄️', dragon: '🐉', ghost: '👻', fighting: '🥊',
  fairy: '🧚', psychic: '🧠', normal: '⚪', dark: '🌑',
};

const rarityColors: Record<string, { text: string; border: string; glow: string; gradient: string; bg: string }> = {
  Common: { text: 'text-gray-400', border: 'border-gray-400', glow: 'shadow-gray-400/20', gradient: 'from-gray-500 to-gray-600', bg: 'bg-gray-500/20' },
  Uncommon: { text: 'text-green-400', border: 'border-green-400', glow: 'shadow-green-400/20', gradient: 'from-green-500 to-emerald-500', bg: 'bg-green-500/20' },
  Rare: { text: 'text-blue-400', border: 'border-blue-400', glow: 'shadow-blue-400/20', gradient: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/20' },
  Epic: { text: 'text-purple-400', border: 'border-purple-400', glow: 'shadow-purple-400/20', gradient: 'from-purple-500 to-pink-500', bg: 'bg-purple-500/20' },
  Legendary: { text: 'text-amber-400', border: 'border-amber-400', glow: 'shadow-amber-400/20', gradient: 'from-amber-500 to-orange-500', bg: 'bg-amber-500/20' },
  Mythic: { text: 'text-red-500', border: 'border-red-500', glow: 'shadow-red-500/30', gradient: 'from-red-500 to-pink-600', bg: 'bg-red-500/30' },
};

export default function ArenaPage() {
  const { isConnected } = useAccount();
  const [inBattle, setInBattle] = useState(false);
  const [myPokemon, setMyPokemon] = useState<Pokemon>(myTeam[0]);
  const [enemyPokemon, setEnemyPokemon] = useState<Pokemon>(enemyTeam[0]);
  const [myHealth, setMyHealth] = useState(500);
  const [enemyHealth, setEnemyHealth] = useState(1000);
  const [battleLog, setBattleLog] = useState<string[]>(['⚔️ Welcome to the Battle Arena!', 'Select a Pokemon to start battling']);
  const [battleTurn, setBattleTurn] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [attackEffect, setAttackEffect] = useState<'my' | 'enemy' | null>(null);
  const [myWins, setMyWins] = useState(15);
  const [enemyWins, setEnemyWins] = useState(8);
  const [showPvPMatchmaking, setShowPvPMatchmaking] = useState(false);
  const [pvpSearching, setPvpSearching] = useState(false);
  const [battleType, setBattleType] = useState<'pve' | 'pvp'>('pve');

  const getPokemonImageUrl = (id: number) => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  };

  const getHealthColor = (current: number, max: number) => {
    const percent = (current / max) * 100;
    if (percent > 50) return 'bg-green-500';
    if (percent > 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const startBattle = (type: 'pve' | 'pvp') => {
    setBattleType(type);
    setInBattle(true);
    setMyHealth(myPokemon.maxHealth);
    setEnemyHealth(enemyPokemon.maxHealth);
    setBattleLog([`⚔️ ${type === 'pvp' ? 'PvP Battle' : 'Duel'} Started!`, `Your ${myPokemon.name} vs ${enemyPokemon.name}`]);
    setBattleTurn(0);
    setWinner(null);
  };

  const attack = () => {
    if (!inBattle || winner) return;

    const newTurn = battleTurn + 1;
    setBattleTurn(newTurn);

    // Calculate damage with rarity bonuses
    const rarityBonus = {
      Common: 1.0, Uncommon: 1.1, Rare: 1.2, Epic: 1.4, Legendary: 1.6, Mythic: 2.0
    };
    
    const myDamage = Math.floor(myPokemon.power * (0.8 + Math.random() * 0.4) * rarityBonus[myPokemon.rarity]);
    const newEnemyHealth = Math.max(0, enemyHealth - myDamage);
    
    setEnemyHealth(newEnemyHealth);
    setBattleLog(prev => [...prev.slice(-4), `🎯 ${myPokemon.name} deals ${myDamage} damage!`, `✨ ${myPokemon.rarity} bonus applied!`]);
    setAttackEffect('my');

    setTimeout(() => setAttackEffect(null), 500);

    if (newEnemyHealth <= 0) {
      setWinner(`Your ${myPokemon.name}`);
      setBattleLog(prev => [...prev, `🏆 ${myPokemon.name} wins!`, `💰 +250 $MNMOON won!`]);
      setMyWins(prev => prev + 1);
      return;
    }

    // Enemy attack (after delay)
    setTimeout(() => {
      const enemyDamage = Math.floor(enemyPokemon.power * (0.6 + Math.random() * 0.3) * rarityBonus[enemyPokemon.rarity]);
      const newMyHealth = Math.max(0, myHealth - enemyDamage);
      setMyHealth(newMyHealth);
      setBattleLog(prev => [...prev.slice(-4), `💥 ${enemyPokemon.name} deals ${enemyDamage} damage!`, `✨ ${enemyPokemon.rarity} bonus applied!`]);
      setAttackEffect('enemy');

      setTimeout(() => setAttackEffect(null), 500);

      if (newMyHealth <= 0) {
        setWinner(`Enemy ${enemyPokemon.name}`);
        setBattleLog(prev => [...prev, `💀 ${enemyPokemon.name} wins!`, `🔥 Streak ended...`]);
        setEnemyWins(prev => prev + 1);
      }
    }, 1000);
  };

  const leaveBattle = () => {
    setInBattle(false);
    setWinner(null);
    setBattleLog(['⚔️ Welcome to the Battle Arena!']);
    setAttackEffect(null);
    setShowPvPMatchmaking(false);
  };

  const selectMyPokemon = (pokemon: Pokemon) => {
    if (inBattle) return;
    setMyPokemon(pokemon);
    setMyHealth(pokemon.maxHealth);
  };

  const selectEnemyPokemon = (pokemon: Pokemon) => {
    if (inBattle) return;
    setEnemyPokemon(pokemon);
    setEnemyHealth(pokemon.maxHealth);
  };

  const startPvPSearch = () => {
    setShowPvPMatchmaking(true);
    setPvpSearching(true);
    
    // Simulate matchmaking
    setTimeout(() => {
      setPvpSearching(false);
      setBattleType('pvp');
      setInBattle(true);
      setMyHealth(myPokemon.maxHealth);
      setEnemyHealth(enemyPokemon.maxHealth);
      setBattleLog(['⚔️ PvP Match Found!', 'Fighting against Trainer_XYZ', `Your ${myPokemon.name} vs Mewtwo`]);
      setBattleTurn(0);
      setWinner(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-white/5 py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-400 hover:text-white">←</Link>
              <h1 className="text-3xl font-bold text-white">⚔️ Battle Arena</h1>
            </div>

            {!inBattle && (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => startBattle('pve')}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 font-bold text-white"
                >
                  <Sword className="h-4 w-4" />
                  <span>Quick Duel</span>
                </button>
                <button
                  onClick={startPvPSearch}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 font-bold text-white"
                >
                  <Users className="h-4 w-4" />
                  <span>Find Match</span>
                </button>
              </div>
            )}
          </div>

          {/* Score Display */}
          {!inBattle && (
            <div className="flex justify-center space-x-12 mt-6">
              <div className="text-center">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-6 w-6 text-amber-400" />
                  <p className="text-2xl font-bold text-green-400">{myWins}</p>
                </div>
                <p className="text-sm text-gray-400">Your Wins</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-500">VS</p>
              </div>
              <div className="text-center">
                <div className="flex items-center space-x-2">
                  <Skull className="h-6 w-6 text-red-400" />
                  <p className="text-2xl font-bold text-red-400">{enemyWins}</p>
                </div>
                <p className="text-sm text-gray-400">Enemy Wins</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {!inBattle ? (
          // Selection Screen
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Your Team */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-400" />
                <span>Your Team</span>
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {myTeam.map((pokemon) => {
                  const rarity = rarityColors[pokemon.rarity];
                  return (
                    <button
                      key={pokemon.id}
                      onClick={() => selectMyPokemon(pokemon)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        myPokemon.id === pokemon.id
                          ? `${rarity.border} bg-gradient-to-br ${rarity.gradient}/20`
                          : 'border-white/10 bg-slate-800/50 hover:border-white/20'
                      }`}
                    >
                      <div className="relative">
                        <Image
                          src={getPokemonImageUrl(pokemon.id)}
                          alt={pokemon.name}
                          width={64}
                          height={64}
                          className="object-contain mx-auto"
                        />
                        {pokemon.rarity === 'Mythic' && (
                          <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 animate-pulse" />
                        )}
                      </div>
                      <p className="font-bold text-white text-xs mt-1 truncate">{pokemon.name}</p>
                      <p className={`text-xs ${rarity.text}`}>{pokemon.power} ⚔️</p>
                      <p className={`text-xs ${rarity.text}`}>{pokemon.rarity}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Enemy Team */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <Target className="h-5 w-5 text-red-400" />
                <span>Opponent</span>
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {enemyTeam.map((pokemon) => {
                  const rarity = rarityColors[pokemon.rarity];
                  return (
                    <button
                      key={pokemon.id}
                      onClick={() => selectEnemyPokemon(pokemon)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        enemyPokemon.id === pokemon.id
                          ? `${rarity.border} bg-gradient-to-br ${rarity.gradient}/20`
                          : 'border-white/10 bg-slate-800/50 hover:border-white/20'
                      }`}
                    >
                      <div className="relative">
                        <Image
                          src={getPokemonImageUrl(pokemon.id)}
                          alt={pokemon.name}
                          width={64}
                          height={64}
                          className="object-contain mx-auto"
                        />
                        {pokemon.rarity === 'Mythic' && (
                          <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 animate-pulse" />
                        )}
                        {pokemon.rarity === 'Legendary' && (
                          <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-amber-500" />
                        )}
                      </div>
                      <p className="font-bold text-white text-xs mt-1 truncate">{pokemon.name}</p>
                      <p className={`text-xs ${rarity.text}`}>{pokemon.power} ⚔️</p>
                      <p className={`text-xs ${rarity.text}`}>{pokemon.rarity}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          // Battle Screen
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Battle Arena */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative bg-slate-800/50 rounded-2xl p-8 border border-white/5 overflow-hidden"
              >
                {/* Battle Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20" />
                
                {/* Enemy Pokemon */}
                <div className="relative z-10 text-center mb-8">
                  <motion.div
                    animate={attackEffect === 'enemy' ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative inline-block">
                      {enemyPokemon.rarity === 'Mythic' && (
                        <motion.div
                          animate={{ opacity: [0.3, 0.6, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="absolute -inset-8 bg-red-500/30 rounded-full blur-2xl"
                        />
                      )}
                      <Image
                        src={getPokemonImageUrl(enemyPokemon.id)}
                        alt={enemyPokemon.name}
                        width={180}
                        height={180}
                        className="object-contain mx-auto"
                      />
                    </div>
                  </motion.div>
                  
                  <div className="mt-4 max-w-xs mx-auto">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white">{enemyPokemon.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${rarityColors[enemyPokemon.rarity].bg} ${rarityColors[enemyPokemon.rarity].text}`}>
                        {enemyPokemon.rarity}
                      </span>
                    </div>
                    <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full ${getHealthColor(enemyHealth, enemyPokemon.maxHealth)}`}
                        animate={{ width: `${(enemyHealth / enemyPokemon.maxHealth) * 100}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{enemyHealth}/{enemyPokemon.maxHealth} HP</p>
                  </div>
                </div>

                {/* VS Divider */}
                <div className="flex items-center justify-center my-4">
                  <span className="text-2xl font-bold text-gray-500">VS</span>
                </div>

                {/* My Pokemon */}
                <div className="relative z-10 text-center">
                  <motion.div
                    animate={attackEffect === 'my' ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative inline-block">
                      {myPokemon.rarity === 'Mythic' && (
                        <motion.div
                          animate={{ opacity: [0.3, 0.6, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="absolute -inset-8 bg-red-500/30 rounded-full blur-2xl"
                        />
                      )}
                      <Image
                        src={getPokemonImageUrl(myPokemon.id)}
                        alt={myPokemon.name}
                        width={160}
                        height={160}
                        className="object-contain mx-auto"
                      />
                    </div>
                  </motion.div>
                  
                  <div className="mt-4 max-w-xs mx-auto">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white">{myPokemon.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${rarityColors[myPokemon.rarity].bg} ${rarityColors[myPokemon.rarity].text}`}>
                        {myPokemon.rarity}
                      </span>
                    </div>
                    <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full ${getHealthColor(myHealth, myPokemon.maxHealth)}`}
                        animate={{ width: `${(myHealth / myPokemon.maxHealth) * 100}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{myHealth}/{myPokemon.maxHealth} HP</p>
                  </div>
                </div>

                {/* Attack Button */}
                {battleType === 'pve' && (
                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={attack}
                      disabled={!!winner}
                      className="px-12 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 font-bold text-white text-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ⚔️ Attack!
                    </button>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Battle Info */}
            <div className="space-y-4">
              {/* Battle Log */}
              <div className="bg-slate-800/50 rounded-2xl p-4 border border-white/5 h-64 overflow-y-auto">
                <h3 className="font-bold text-white mb-2">📜 Battle Log</h3>
                <div className="space-y-1">
                  {battleLog.map((log, i) => (
                    <p key={i} className={`text-sm ${log.includes('wins') ? 'text-amber-400' : log.includes('damage') ? 'text-gray-300' : 'text-gray-400'}`}>
                      {log}
                    </p>
                  ))}
                </div>
              </div>

              {/* Battle Stats */}
              <div className="bg-slate-800/50 rounded-2xl p-4 border border-white/5">
                <h3 className="font-bold text-white mb-2">📊 Battle Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Turn</span>
                    <span className="text-white font-bold">{battleTurn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Battle Type</span>
                    <span className="text-white font-bold">{battleType === 'pve' ? 'PvE Duel' : 'PvP Match'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Win Rate</span>
                    <span className="text-green-400 font-bold">
                      {Math.round((myWins / (myWins + enemyWins)) * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Winner Announcement */}
              {winner && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl p-6 border border-amber-500/30 text-center"
                >
                  <Trophy className="h-12 w-12 text-amber-400 mx-auto mb-2" />
                  <h3 className="text-xl font-bold text-amber-400 mb-2">🏆 {winner}</h3>
                  <p className="text-gray-400 mb-4">Battle Complete!</p>
                  <button
                    onClick={leaveBattle}
                    className="w-full py-3 rounded-xl bg-slate-700 text-white font-bold hover:bg-slate-600 transition-colors"
                  >
                    Return to Arena
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* PvP Matchmaking Modal */}
      <AnimatePresence>
        {showPvPMatchmaking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="text-center p-8"
            >
              {pvpSearching ? (
                <>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 360, 360] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-8xl mb-4"
                  >
                    🔍
                  </motion.div>
                  <h2 className="text-2xl font-bold text-white mb-2">Finding Opponent...</h2>
                  <p className="text-gray-400">Searching for trainers nearby</p>
                  <div className="mt-4 flex justify-center space-x-2">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="h-3 w-3 rounded-full bg-purple-500"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="bg-slate-800 rounded-2xl p-6 max-w-sm w-full">
                  <h2 className="text-xl font-bold text-white mb-4">PvP Battle Ready!</h2>
                  <button
                    onClick={() => {
                      setShowPvPMatchmaking(false);
                      startBattle('pvp');
                    }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 font-bold text-white"
                  >
                    Start Battle
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
