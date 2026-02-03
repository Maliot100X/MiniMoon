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
  const { isConnected, address } = useAccount();
  const [inBattle, setInBattle] = useState(false);
  const [myPokemon, setMyPokemon] = useState<Pokemon | null>(null);
  const [enemyPokemon, setEnemyPokemon] = useState<Pokemon | null>(null);
  const [myHealth, setMyHealth] = useState(0);
  const [enemyHealth, setEnemyHealth] = useState(0);
  const [battleLog, setBattleLog] = useState<string[]>(['⚔️ Welcome to the Battle Arena!', 'Connect your wallet to start battling']);
  const [battleTurn, setBattleTurn] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [attackEffect, setAttackEffect] = useState<'my' | 'enemy' | null>(null);
  const [myWins, setMyWins] = useState(0);
  const [enemyWins, setEnemyWins] = useState(0);
  const [showPvPMatchmaking, setShowPvPMatchmaking] = useState(false);
  const [pvpSearching, setPvpSearching] = useState(false);
  const [battleType, setBattleType] = useState<'pve' | 'pvp'>('pve');

  // Load user's real Pokemon team from chain/localStorage
  const [myTeam, setMyTeam] = useState<Pokemon[]>([]);
  const [userStats, setUserStats] = useState({ wins: 0, losses: 0 });

  // Fetch user data
  useEffect(() => {
    if (isConnected && address) {
      // In production, fetch real Pokemon team and stats from chain
      // For now, show empty state until real data is available
      setMyTeam([]);
      setUserStats({ wins: 0, losses: 0 });
      setMyWins(0);
      setEnemyWins(0);
    }
  }, [isConnected, address]);

  const getPokemonImageUrl = (id: number) => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  };

  const getHealthColor = (current: number, max: number) => {
    const percent = max > 0 ? (current / max) * 100 : 0;
    if (percent > 50) return 'bg-green-500';
    if (percent > 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const generateEnemy = (): Pokemon => {
    // In production, generate or fetch real enemy from chain
    return {
      id: Math.floor(Math.random() * 150) + 1,
      name: 'Wild Pokemon',
      type: 'normal',
      power: Math.floor(Math.random() * 500) + 100,
      health: 300,
      maxHealth: 300,
      rarity: 'Common',
      effects: [],
    };
  };

  const startBattle = (type: 'pve' | 'pvp') => {
    if (myTeam.length === 0) {
      setBattleLog(['⚔️ No Pokemon found!', 'Hatch eggs in the AFK page to get your team']);
      return;
    }

    const selectedPokemon = myTeam[0];
    const enemy = generateEnemy();

    setBattleType(type);
    setInBattle(true);
    setMyPokemon(selectedPokemon);
    setEnemyPokemon(enemy);
    setMyHealth(selectedPokemon.maxHealth);
    setEnemyHealth(enemy.maxHealth);
    setBattleLog([`⚔️ ${type === 'pvp' ? 'PvP Battle' : 'Duel'} Started!`, `Your ${selectedPokemon.name} vs ${enemy.name}`]);
    setBattleTurn(0);
    setWinner(null);
    setAttackEffect(null);
  };

  const attack = () => {
    if (!inBattle || !myPokemon || !enemyPokemon || winner) return;

    const newTurn = battleTurn + 1;
    setBattleTurn(newTurn);

    // Calculate damage with rarity bonuses
    const rarityBonus: Record<string, number> = {
      Common: 1.0, Uncommon: 1.1, Rare: 1.2, Epic: 1.4, Legendary: 1.6, Mythic: 2.0,
    };

    const playerDamage = Math.floor(myPokemon.power * (0.8 + Math.random() * 0.4) * (rarityBonus[myPokemon.rarity] || 1));
    const enemyDamage = Math.floor(enemyPokemon.power * (0.8 + Math.random() * 0.4));

    const newEnemyHealth = Math.max(0, enemyHealth - playerDamage);
    setEnemyHealth(newEnemyHealth);
    setAttackEffect('my');

    setBattleLog((prev) => [
      ...prev,
      `Turn ${newTurn}: Your ${myPokemon.name} deals ${playerDamage} damage!`,
    ]);

    setTimeout(() => setAttackEffect(null), 300);

    if (newEnemyHealth <= 0) {
      setWinner(`Your ${myPokemon.name} Wins!`);
      setMyWins((w) => w + 1);
      setBattleLog((prev) => [...prev, `🎉 Victory! You earned rewards!`]);
      return;
    }

    setTimeout(() => {
      const newPlayerHealth = Math.max(0, myHealth - enemyDamage);
      setMyHealth(newPlayerHealth);
      setAttackEffect('enemy');

      setBattleLog((prev) => [
        ...prev,
        `Turn ${newTurn}: ${enemyPokemon.name} deals ${enemyDamage} damage!`,
      ]);

      setTimeout(() => setAttackEffect(null), 300);

      if (newPlayerHealth <= 0) {
        setWinner(`${enemyPokemon.name} Wins!`);
        setEnemyWins((w) => w + 1);
        setBattleLog((prev) => [...prev, `💀 Defeat! Try again!`]);
      }
    }, 600);
  };

  const leaveBattle = () => {
    setInBattle(false);
    setMyPokemon(null);
    setEnemyPokemon(null);
    setWinner(null);
    setBattleLog(['⚔️ Welcome to the Battle Arena!', 'Connect your wallet to start battling']);
  };

  const surrender = () => {
    if (!enemyPokemon || !myPokemon) return;
    setWinner(`${enemyPokemon.name} Wins!`);
    setEnemyWins((w) => w + 1);
    setBattleLog((prev) => [...prev, `🏳️ You surrendered!`]);
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen py-8">
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex flex-col items-center justify-center p-12 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-slate-700/50">
            <Sword className="h-16 w-16 text-cyan-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Connect Wallet</h3>
            <p className="text-gray-400 text-center mb-4">Connect your wallet to access the Battle Arena</p>
            <p className="text-sm text-gray-500">Battle other trainers and earn rewards!</p>
          </div>
        </div>
      </div>
    );
  }

  if (inBattle && myPokemon && enemyPokemon) {
    return (
      <div className="min-h-screen py-4">
        <div className="mx-auto max-w-4xl px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-slate-900/50 rounded-3xl p-6 border border-slate-700/50"
          >
            {/* Battle Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={leaveBattle}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <span className="text-xl">←</span>
                </button>
                <h1 className="text-xl font-bold text-white">⚔️ Battle Arena</h1>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-400">Turn: <span className="text-white font-bold">{battleTurn}</span></span>
                <span className={`px-3 py-1 rounded-full ${battleType === 'pvp' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                  {battleType === 'pvp' ? 'PvP' : 'PvE'}
                </span>
              </div>
            </div>

            {/* Battle Scene */}
            <div className="relative h-80 rounded-2xl bg-gradient-to-b from-slate-800/50 to-slate-900/50 mb-6 overflow-hidden">
              {/* Environment */}
              <div className="absolute inset-0 bg-[url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/back/6.gif')] bg-cover bg-center opacity-20" />

              {/* Enemy Pokemon */}
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="absolute top-10 right-20"
              >
                <div className="relative">
                  <Image
                    src={getPokemonImageUrl(enemyPokemon.id)}
                    alt={enemyPokemon.name}
                    width={160}
                    height={160}
                    className={`transform scale-x-[-1] ${attackEffect === 'my' ? 'animate-pulse' : ''}`}
                  />
                  {attackEffect === 'my' && (
                    <motion.div
                      initial={{ scale: 0, opacity: 1 }}
                      animate={{ scale: 2, opacity: 0 }}
                      className="absolute inset-0 bg-red-500 rounded-full blur-xl"
                    />
                  )}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 bg-slate-700 rounded-full h-3">
                    <div
                      className={`h-full rounded-full ${getHealthColor(enemyHealth, enemyPokemon.maxHealth)} transition-all duration-300`}
                      style={{ width: `${(enemyHealth / enemyPokemon.maxHealth) * 100}%` }}
                    />
                  </div>
                </div>
              </motion.div>

              {/* My Pokemon */}
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="absolute bottom-10 left-20"
              >
                <div className="relative">
                  <Image
                    src={getPokemonImageUrl(myPokemon.id)}
                    alt={myPokemon.name}
                    width={140}
                    height={140}
                    className={attackEffect === 'enemy' ? 'animate-pulse' : ''}
                  />
                  {attackEffect === 'enemy' && (
                    <motion.div
                      initial={{ scale: 0, opacity: 1 }}
                      animate={{ scale: 2, opacity: 0 }}
                      className="absolute inset-0 bg-red-500 rounded-full blur-xl"
                    />
                  )}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-28 bg-slate-700 rounded-full h-3">
                    <div
                      className={`h-full rounded-full ${getHealthColor(myHealth, myPokemon.maxHealth)} transition-all duration-300`}
                      style={{ width: `${(myHealth / myPokemon.maxHealth) * 100}%` }}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Health Bars */}
              <div className="absolute top-4 left-4 right-4 flex justify-between">
                <div className="bg-slate-800/80 px-4 py-2 rounded-xl">
                  <p className="text-white font-bold">{enemyPokemon.name}</p>
                  <p className="text-gray-400 text-sm">{enemyPokemon.power} ⚔️</p>
                </div>
                <div className="bg-slate-800/80 px-4 py-2 rounded-xl text-right">
                  <p className="text-white font-bold">{myPokemon.name}</p>
                  <p className="text-gray-400 text-sm">{myPokemon.power} ⚔️</p>
                </div>
              </div>
            </div>

            {/* Battle Log */}
            <div className="bg-slate-800/50 rounded-xl p-4 mb-4 h-32 overflow-y-auto">
              {battleLog.map((log, i) => (
                <p key={i} className="text-sm text-gray-300 mb-1">{log}</p>
              ))}
            </div>

            {/* Winner Announcement */}
            {winner ? (
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
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={attack}
                  className="flex-1 py-4 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-lg hover:opacity-90 transition-opacity"
                >
                  ⚔️ Attack
                </button>
                <button
                  onClick={surrender}
                  className="px-6 py-4 rounded-xl bg-slate-700 text-gray-300 font-bold hover:bg-slate-600 transition-colors"
                >
                  🏳️
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white">⚔️ Battle Arena</h1>
              <p className="text-gray-400 text-sm mt-1">Challenge other trainers!</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl p-4 border border-green-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-green-400" />
                <span className="text-gray-300 text-sm">Wins</span>
              </div>
              <p className="text-3xl font-bold text-white">{myWins}</p>
            </div>
            <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl p-4 border border-red-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Skull className="w-5 h-5 text-red-400" />
                <span className="text-gray-300 text-sm">Losses</span>
              </div>
              <p className="text-3xl font-bold text-white">{enemyWins}</p>
            </div>
          </div>

          {/* Battle Modes */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => startBattle('pve')}
              className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-6 border border-blue-500/30 hover:opacity-90 transition-opacity text-left"
            >
              <Target className="w-10 h-10 text-blue-400 mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">PvE Duel</h3>
              <p className="text-gray-400 text-sm">Challenge AI opponents</p>
            </button>
            <button
              onClick={() => {
                setShowPvPMatchmaking(true);
                setPvpSearching(true);
              }}
              className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-500/30 hover:opacity-90 transition-opacity text-left"
            >
              <Users className="w-10 h-10 text-purple-400 mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">PvP Battle</h3>
              <p className="text-gray-400 text-sm">Challenge real players</p>
            </button>
          </div>

          {/* My Team */}
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">Your Team</h2>
            {myTeam.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">🥚</div>
                <p className="text-gray-400 mb-2">No Pokemon in your team</p>
                <p className="text-gray-500 text-sm">Hatch eggs in the AFK page to build your team!</p>
                <Link
                  href="/afk"
                  className="inline-block mt-4 px-6 py-2 bg-cyan-500/20 text-cyan-400 rounded-xl hover:bg-cyan-500/30 transition-colors"
                >
                  Go to AFK Page
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {myTeam.map((pokemon, i) => (
                  <div
                    key={i}
                    className={`bg-slate-700/50 rounded-xl p-4 border ${rarityColors[pokemon.rarity].border}`}
                  >
                    <Image
                      src={getPokemonImageUrl(pokemon.id)}
                      alt={pokemon.name}
                      width={64}
                      height={64}
                      className="mx-auto mb-2"
                    />
                    <p className="text-white font-bold text-center text-sm">{pokemon.name}</p>
                    <p className={`text-xs text-center ${rarityColors[pokemon.rarity].text}`}>{pokemon.rarity}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
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
                  <button
                    onClick={() => {
                      setShowPvPMatchmaking(false);
                      setPvpSearching(false);
                    }}
                    className="mt-6 px-6 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600"
                  >
                    Cancel
                  </button>
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
