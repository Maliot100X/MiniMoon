'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Your Pokemon team
const myTeam = [
  { id: 6, name: 'Charizard', type: 'fire', power: 500, health: 500, maxHealth: 500, emoji: '🔥' },
  { id: 9, name: 'Blastoise', type: 'water', power: 500, health: 500, maxHealth: 500, emoji: '💧' },
  { id: 130, name: 'Gyarados', type: 'water', power: 550, health: 550, maxHealth: 550, emoji: '🐋' },
  { id: 94, name: 'Gengar', type: 'ghost', power: 500, health: 480, maxHealth: 480, emoji: '👻' },
  { id: 149, name: 'Dragonite', type: 'dragon', power: 600, health: 600, maxHealth: 600, emoji: '🐉' },
  { id: 25, name: 'Pikachu', type: 'electric', power: 120, health: 120, maxHealth: 120, emoji: '⚡' },
];

// Enemy Pokemon
const enemyTeam = [
  { id: 150, name: 'Mewtwo', type: 'psychic', power: 1000, health: 1000, maxHealth: 1000, emoji: '🧬' },
  { id: 149, name: 'Dragonite', type: 'dragon', power: 600, health: 600, maxHealth: 600, emoji: '🐉' },
  { id: 384, name: 'Rayquaza', type: 'dragon', power: 1300, health: 1300, maxHealth: 1300, emoji: '🐲' },
  { id: 144, name: 'Articuno', type: 'ice', power: 900, health: 900, maxHealth: 900, emoji: '❄️' },
  { id: 145, name: 'Zapdos', type: 'electric', power: 900, health: 900, maxHealth: 900, emoji: '⚡' },
  { id: 146, name: 'Moltres', type: 'fire', power: 900, health: 900, maxHealth: 900, emoji: '🔥' },
];

const typeEmojis: Record<string, string> = {
  fire: '🔥', water: '💧', electric: '⚡', grass: '🌿',
  ice: '❄️', dragon: '🐉', ghost: '👻', fighting: '🥊',
  fairy: '🧚', psychic: '🧠', normal: '⚪', dark: '🌑',
};

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
};

export default function ArenaPage() {
  const [inBattle, setInBattle] = useState(false);
  const [myPokemon, setMyPokemon] = useState(myTeam[0]);
  const [enemyPokemon, setEnemyPokemon] = useState(enemyTeam[0]);
  const [myHealth, setMyHealth] = useState(500);
  const [enemyHealth, setEnemyHealth] = useState(1000);
  const [battleLog, setBattleLog] = useState<string[]>(['⚔️ Welcome to the Battle Arena!']);
  const [battleTurn, setBattleTurn] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [attackEffect, setAttackEffect] = useState<'my' | 'enemy' | null>(null);
  const [myWins, setMyWins] = useState(15);
  const [enemyWins, setEnemyWins] = useState(8);

  const getPokemonImageUrl = (id: number) => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  };

  const getHealthColor = (current: number, max: number) => {
    const percent = (current / max) * 100;
    if (percent > 50) return 'bg-green-500';
    if (percent > 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const startBattle = () => {
    setInBattle(true);
    setMyHealth(myPokemon.maxHealth);
    setEnemyHealth(enemyPokemon.maxHealth);
    setBattleLog(['⚔️ Battle Started!', `Your ${myPokemon.name} vs ${enemyPokemon.name}`]);
    setBattleTurn(0);
    setWinner(null);
  };

  const attack = () => {
    if (!inBattle || winner) return;

    const newTurn = battleTurn + 1;
    setBattleTurn(newTurn);

    // My attack
    const myDamage = Math.floor(myPokemon.power * (0.8 + Math.random() * 0.4));
    const newEnemyHealth = Math.max(0, enemyHealth - myDamage);
    setEnemyHealth(newEnemyHealth);
    setBattleLog(prev => [...prev.slice(-4), `🎯 ${myPokemon.name} deals ${myDamage} damage!`]);
    setAttackEffect('my');

    setTimeout(() => setAttackEffect(null), 500);

    if (newEnemyHealth <= 0) {
      setWinner(`Your ${myPokemon.name}`);
      setBattleLog(prev => [...prev, `🏆 ${myPokemon.name} wins!`]);
      setMyWins(prev => prev + 1);
      return;
    }

    // Enemy attack (after delay)
    setTimeout(() => {
      const enemyDamage = Math.floor(enemyPokemon.power * (0.6 + Math.random() * 0.3));
      const newMyHealth = Math.max(0, myHealth - enemyDamage);
      setMyHealth(newMyHealth);
      setBattleLog(prev => [...prev.slice(-4), `💥 ${enemyPokemon.name} deals ${enemyDamage} damage!`]);
      setAttackEffect('enemy');

      setTimeout(() => setAttackEffect(null), 500);

      if (newMyHealth <= 0) {
        setWinner(`Enemy ${enemyPokemon.name}`);
        setBattleLog(prev => [...prev, `💀 ${enemyPokemon.name} wins!`]);
        setEnemyWins(prev => prev + 1);
      }
    }, 1000);
  };

  const leaveBattle = () => {
    setInBattle(false);
    setWinner(null);
    setBattleLog(['⚔️ Welcome to the Battle Arena!']);
    setAttackEffect(null);
  };

  const selectMyPokemon = (pokemon: any) => {
    if (inBattle) return;
    setMyPokemon(pokemon);
    setMyHealth(pokemon.maxHealth);
  };

  const selectEnemyPokemon = (pokemon: any) => {
    if (inBattle) return;
    setEnemyPokemon(pokemon);
    setEnemyHealth(pokemon.maxHealth);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-white/5 py-6">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-gray-400 hover:text-white">←</Link>
            <h1 className="text-3xl font-bold text-white">⚔️ 3D Battle Arena</h1>
          </div>
          {!inBattle && (
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <p className="text-sm text-gray-400">Entry Fee</p>
                <p className="text-amber-400 font-bold">50 $MNMOON</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400">Prize Pool</p>
                <p className="text-green-400 font-bold">2x Entry</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Battle Arena */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {!inBattle ? (
          // Selection Screen
          <div className="space-y-8">
            {/* Score Display */}
            <div className="flex justify-center space-x-12">
              <div className="text-center">
                <div className="text-4xl mb-2">🟢</div>
                <p className="text-2xl font-bold text-green-400">{myWins}</p>
                <p className="text-sm text-gray-400">Your Wins</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-500">VS</div>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">🔴</div>
                <p className="text-2xl font-bold text-red-400">{enemyWins}</p>
                <p className="text-sm text-gray-400">Enemy Wins</p>
              </div>
            </div>

            {/* Your Team */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Your Team</h2>
              <div className="flex flex-wrap gap-3">
                {myTeam.map((pokemon) => {
                  const colors = typeColors[pokemon.type];
                  return (
                    <button
                      key={pokemon.id}
                      onClick={() => selectMyPokemon(pokemon)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        myPokemon.id === pokemon.id
                          ? 'border-green-500 bg-green-500/10'
                          : 'border-white/10 bg-slate-800/50 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Image
                          src={getPokemonImageUrl(pokemon.id)}
                          alt={pokemon.name}
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                        <div className="text-left">
                          <p className="font-bold text-white text-sm">{pokemon.name}</p>
                          <p className={`text-xs ${colors.text}`}>{pokemon.power} ⚔️</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Enemy Selection */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Select Opponent</h2>
              <div className="flex flex-wrap gap-3">
                {enemyTeam.map((pokemon) => {
                  const colors = typeColors[pokemon.type];
                  return (
                    <button
                      key={pokemon.id}
                      onClick={() => selectEnemyPokemon(pokemon)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        enemyPokemon.id === pokemon.id
                          ? 'border-red-500 bg-red-500/10'
                          : 'border-white/10 bg-slate-800/50 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Image
                          src={getPokemonImageUrl(pokemon.id)}
                          alt={pokemon.name}
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                        <div className="text-left">
                          <p className="font-bold text-white text-sm">{pokemon.name}</p>
                          <p className={`text-xs ${colors.text}`}>{pokemon.power} ⚔️</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Start Battle Button */}
            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startBattle}
                className="px-12 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-2xl font-bold text-white hover:opacity-90 transition-opacity shadow-lg shadow-amber-500/25"
              >
                ⚔️ START BATTLE
              </motion.button>
            </div>
          </div>
        ) : (
          // Active Battle Screen
          <div className="space-y-8">
            {/* 3D Battle Arena */}
            <div className="relative h-96 rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border border-white/10 overflow-hidden">
              {/* Arena Floor */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  background: 'repeating-linear-gradient(45deg, transparent, transparent 20px, #f59e0b 20px, #f59e0b 40px)',
                  transform: 'perspective(500px) rotateX(60deg)',
                  bottom: '-30%',
                }}
              />

              {/* Battle Circle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-80 h-80 rounded-full border-4 border-amber-500/30 animate-pulse" />
                <div className="absolute w-64 h-64 rounded-full border-4 border-orange-500/20" />
              </div>

              {/* Combatants */}
              <div className="relative z-10 flex items-center justify-between h-full px-8 md:px-20">
                {/* My Pokemon */}
                <motion.div
                  animate={
                    attackEffect === 'my'
                      ? { x: 50, scale: 1.1 }
                      : winner === `Your ${myPokemon.name}`
                      ? { x: 30, scale: 1.05 }
                      : { x: 0, scale: 1 }
                  }
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <div className="relative">
                    {winner === `Your ${myPokemon.name}` && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="absolute -top-8 -right-8 text-5xl z-20"
                      >
                        🏆
                      </motion.div>
                    )}
                    <Image
                      src={getPokemonImageUrl(myPokemon.id)}
                      alt={myPokemon.name}
                      width={180}
                      height={180}
                      className="object-contain filter drop-shadow-2xl"
                    />
                  </div>
                  <h3 className="mt-2 text-xl font-bold text-white">{myPokemon.name}</h3>
                  <div className="w-40 mx-auto mt-2">
                    <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getHealthColor(myHealth, myPokemon.maxHealth)} transition-all duration-500`}
                        style={{ width: `${(myHealth / myPokemon.maxHealth) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-white text-sm mt-1">
                      <span>{myHealth}/{myPokemon.maxHealth} HP</span>
                    </div>
                  </div>
                </motion.div>

                {/* VS */}
                <div className="text-3xl font-bold text-amber-500">VS</div>

                {/* Enemy Pokemon */}
                <motion.div
                  animate={
                    attackEffect === 'enemy'
                      ? { x: -50, scale: 1.1 }
                      : winner === `Enemy ${enemyPokemon.name}`
                      ? { x: -30, scale: 1.05 }
                      : { x: 0, scale: 1 }
                  }
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <div className="relative">
                    {winner === `Enemy ${enemyPokemon.name}` && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="absolute -top-8 -left-8 text-5xl z-20"
                      >
                        🏆
                      </motion.div>
                    )}
                    <Image
                      src={getPokemonImageUrl(enemyPokemon.id)}
                      alt={enemyPokemon.name}
                      width={180}
                      height={180}
                      className="object-contain filter drop-shadow-2xl"
                    />
                  </div>
                  <h3 className="mt-2 text-xl font-bold text-white">{enemyPokemon.name}</h3>
                  <div className="w-40 mx-auto mt-2">
                    <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getHealthColor(enemyHealth, enemyPokemon.maxHealth)} transition-all duration-500`}
                        style={{ width: `${(enemyHealth / enemyPokemon.maxHealth) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-white text-sm mt-1">
                      <span>{enemyHealth}/{enemyPokemon.maxHealth} HP</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Attack Effects */}
              {attackEffect && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1.5 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <div className="text-8xl animate-ping">💥</div>
                </motion.div>
              )}
            </div>

            {/* Battle Controls */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Battle Log */}
              <div className="bg-slate-800/50 rounded-xl p-4 h-48 overflow-y-auto">
                <h3 className="font-bold text-white mb-2 flex items-center space-x-2">
                  <span>📜</span>
                  <span>Battle Log</span>
                </h3>
                <div className="space-y-1">
                  {battleLog.map((log, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-sm text-gray-300"
                    >
                      {log}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                {winner ? (
                  <div className="text-center p-6 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-3xl font-bold text-amber-400 mb-4"
                    >
                      {winner} Wins! 🏆
                    </motion.div>
                    <div className="flex space-x-4 justify-center">
                      <button
                        onClick={leaveBattle}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 font-bold text-white hover:opacity-90 transition-opacity"
                      >
                        Return to Arena
                      </button>
                      <button
                        onClick={startBattle}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 font-bold text-white hover:opacity-90 transition-opacity"
                      >
                        Rematch
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={attack}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-xl font-bold text-white hover:opacity-90 transition-opacity animate-pulse shadow-lg shadow-red-500/25"
                  >
                    ⚔️ ATTACK!
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Leaderboard */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-white mb-4">🏆 Top Fighters</h2>
        <div className="bg-slate-800/50 rounded-xl overflow-hidden">
          {[
            { rank: 1, name: 'PokemonMaster', wins: 245, avatar: '🐉' },
            { rank: 2, name: 'ArenaKing', wins: 198, avatar: '👑' },
            { rank: 3, name: 'BattlePro', wins: 187, avatar: '⚔️' },
            { rank: 4, name: 'DragonSlayer', wins: 156, avatar: '🐲' },
            { rank: 5, name: 'MiniMoonPro', wins: 142, avatar: '🌙' },
            { rank: 6, name: 'GymLeader', wins: 128, avatar: '🏅' },
            { rank: 7, name: 'PokeChamp', wins: 115, avatar: '⭐' },
            { rank: 8, name: 'EliteFour', wins: 98, avatar: '🎖️' },
          ].map((fighter, index) => (
            <div
              key={fighter.rank}
              className={`flex items-center space-x-4 p-4 ${index !== 7 ? 'border-b border-white/5' : ''}`}
            >
              <div className="text-2xl">
                {fighter.rank === 1 ? '🥇' : fighter.rank === 2 ? '🥈' : fighter.rank === 3 ? '🥉' : `#${fighter.rank}`}
              </div>
              <div className="text-3xl">{fighter.avatar}</div>
              <div className="flex-1">
                <div className="font-bold text-white">{fighter.name}</div>
              </div>
              <div className="text-amber-400 font-bold">{fighter.wins} Wins</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
