'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { Settings, Copy, ExternalLink } from 'lucide-react';

export default function ProfilePage() {
  const { isConnected, address } = useAccount();
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState('Playing MiniMoon on Base | Pokemon Trainer | Web3 Gamer');
  const [selectedAvatar, setSelectedAvatar] = useState(6); // Charizard default
  const [selectedBackground, setSelectedBackground] = useState(0);

  // User profile data
  const profile = {
    username: 'MiniMoonTrainer',
    fid: 12345,
    level: 45,
    experience: 4500,
    monsters: 12,
    totalPower: 8450,
    wins: 156,
    losses: 42,
    tokens: 12500,
    rank: 234,
    subscription: 'premium',
    joinDate: '2024-01-15',
    achievements: 23,
  };

  // Avatar options (using Pokemon IDs)
  const avatars = [
    6,   // Charizard
    9,   // Blastoise
    25,  // Pikachu
    94,  // Gengar
    149, // Dragonite
    150, // Mewtwo
    130, // Gyarados
    282, // Gardevoir
    143, // Snorlax
    65,  // Alakazam
    59,  // Arcanine
    68,  // Machamp
  ];

  const backgrounds = [
    { name: 'Volcanic', color: 'from-red-600 to-orange-700', icon: '🌋' },
    { name: 'Ocean', color: 'from-blue-600 to-cyan-700', icon: '🌊' },
    { name: 'Forest', color: 'from-green-600 to-emerald-700', icon: '🌲' },
    { name: 'Sky', color: 'from-sky-600 to-indigo-700', icon: '☁️' },
    { name: 'Twilight', color: 'from-purple-600 to-pink-700', icon: '🌅' },
    { name: 'Space', color: 'from-slate-900 to-purple-900', icon: '🌌' },
  ];

  const badges = [
    { name: 'Champion', icon: '🏆', earned: true },
    { name: 'Legend', icon: '⭐', earned: true },
    { name: 'Veteran', icon: '🎖️', earned: true },
    { name: 'Collector', icon: '📚', earned: true },
    { name: 'Trader', icon: '💰', earned: true },
    { name: 'Warrior', icon: '⚔️', earned: true },
    { name: 'Scholar', icon: '📖', earned: false },
    { name: 'Master', icon: '👑', earned: false },
  ];

  const achievements = [
    { name: 'First Victory', desc: 'Win your first battle', icon: '🎯', progress: 100 },
    { name: 'Monster Collector', desc: 'Own 10 monsters', icon: '🐉', progress: 100 },
    { name: 'Arena Champion', desc: 'Reach ELO 2000', icon: '⚔️', progress: 82 },
    { name: 'Quest Master', desc: 'Complete 100 quests', icon: '📅', progress: 45 },
    { name: 'Wealthy', desc: 'Earn 50,000 tokens', icon: '💰', progress: 25 },
    { name: 'Hatch Master', desc: 'Hatch 100 eggs', icon: '🥚', progress: 68 },
  ];

  const getAvatarUrl = (id: number) => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  };

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      alert('Address copied!');
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl overflow-hidden mb-8"
        >
          {/* Banner */}
          <div className={`h-48 bg-gradient-to-r ${backgrounds[selectedBackground].color} relative`}>
            <div className="absolute top-4 right-4 flex items-center space-x-2 px-3 py-1 rounded-full bg-black/30">
              <span className="text-sm">Lv.{profile.level}</span>
            </div>
            {profile.subscription === 'premium' && (
              <div className="absolute top-4 left-4 flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/80">
                <span className="text-sm font-bold text-white">⭐ VIP</span>
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="bg-slate-800/50 p-8 relative">
            <div className="flex flex-col md:flex-row md:items-end -mt-20 mb-6 space-y-4 md:space-y-0 md:space-x-6">
              {/* Avatar */}
              <div className="relative">
                <div className="h-32 w-32 rounded-2xl bg-gradient-to-br from-amber-500 to-pink-500 flex items-center justify-center shadow-2xl">
                  <Image
                    src={getAvatarUrl(selectedAvatar)}
                    alt="Avatar"
                    width={120}
                    height={120}
                    className="object-contain"
                  />
                </div>
                <button
                  onClick={() => setEditing(!editing)}
                  className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-slate-700 border-2 border-slate-800 flex items-center justify-center text-white hover:bg-slate-600 transition-colors"
                >
                  <Settings className="h-5 w-5" />
                </button>
              </div>

              {/* Name & Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h1 className="text-3xl font-bold text-white">{profile.username}</h1>
                  {profile.fid && (
                    <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-400 text-sm">
                      FID: {profile.fid}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                  <span>Level {profile.level}</span>
                  <span>•</span>
                  <span>Joined {profile.joinDate}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={copyAddress}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 font-bold text-white hover:opacity-90 transition-opacity flex items-center space-x-2"
                >
                  <Copy className="h-5 w-5" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Bio */}
            <div className="mt-4">
              {editing ? (
                <div className="space-y-3">
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full p-4 rounded-xl bg-slate-700/50 text-white border border-white/10 focus:border-amber-500/50 focus:outline-none"
                    rows={2}
                  />
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setEditing(false)}
                      className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 font-medium"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="px-4 py-2 rounded-lg bg-slate-700 text-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-300">{bio}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Edit Modal */}
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setEditing(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-slate-800 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-white mb-6">Customize Profile</h2>

              {/* Avatar Selection */}
              <div className="mb-6">
                <h3 className="font-bold text-white mb-3 flex items-center space-x-2">
                  <span>🎨</span>
                  <span>Choose Avatar</span>
                </h3>
                <div className="grid grid-cols-6 gap-2">
                  {avatars.map((avatarId) => (
                    <button
                      key={avatarId}
                      onClick={() => setSelectedAvatar(avatarId)}
                      className={`h-16 w-16 rounded-xl flex items-center justify-center transition-all ${
                        selectedAvatar === avatarId
                          ? 'bg-gradient-to-br from-amber-500 to-pink-500 ring-2 ring-white'
                          : 'bg-slate-700 hover:bg-slate-600'
                      }`}
                    >
                      <Image
                        src={getAvatarUrl(avatarId)}
                        alt="Avatar"
                        width={48}
                        height={48}
                        className="object-contain"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Background Selection */}
              <div className="mb-6">
                <h3 className="font-bold text-white mb-3 flex items-center space-x-2">
                  <span>🖼️</span>
                  <span>Profile Background</span>
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {backgrounds.map((bg, index) => (
                    <button
                      key={bg.name}
                      onClick={() => setSelectedBackground(index)}
                      className={`h-16 rounded-xl bg-gradient-to-r ${bg.color} flex items-center justify-center space-x-2 transition-all ${
                        selectedBackground === index ? 'ring-2 ring-white' : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <span>{bg.icon}</span>
                      <span className="text-white text-sm font-medium">{bg.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
                <button
                  onClick={() => setEditing(false)}
                  className="px-6 py-2 rounded-xl bg-slate-700 text-white font-medium hover:bg-slate-600"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 font-bold text-white"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6 mb-8">
          {[
            { icon: '🐉', label: 'Monsters', value: profile.monsters, color: 'text-purple-400' },
            { icon: '💪', label: 'Power', value: profile.totalPower.toLocaleString(), color: 'text-red-400' },
            { icon: '⚔️', label: 'Wins', value: profile.wins, color: 'text-green-400' },
            { icon: '💀', label: 'Losses', value: profile.losses, color: 'text-gray-400' },
            { icon: '💰', label: 'Tokens', value: `${profile.tokens.toLocaleString()} $MNMOON`, color: 'text-amber-400' },
            { icon: '🏆', label: 'Rank', value: `#${profile.rank}`, color: 'text-amber-400' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-xl bg-slate-800/50 border border-white/5 p-4 text-center"
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-slate-800/50 border border-white/5 p-6"
          >
            <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
              <span>🏆</span>
              <span>Achievements ({profile.achievements}/50)</span>
            </h2>
            <div className="space-y-4">
              {achievements.map((achievement) => (
                <div key={achievement.name} className="flex items-center space-x-4 p-3 rounded-xl bg-slate-700/30">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center text-2xl">
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white">{achievement.name}</h4>
                      <span className="text-sm text-gray-400">{achievement.progress}%</span>
                    </div>
                    <p className="text-sm text-gray-400">{achievement.desc}</p>
                    <div className="mt-2 h-2 rounded-full bg-slate-700 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                        style={{ width: `${achievement.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Badges Collection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl bg-slate-800/50 border border-white/5 p-6"
          >
            <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
              <span>🎖️</span>
              <span>Badges Collection</span>
            </h2>
            <div className="grid grid-cols-4 gap-4">
              {badges.map((badge) => (
                <div
                  key={badge.name}
                  className={`p-4 rounded-xl text-center ${
                    badge.earned
                      ? 'bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20'
                      : 'bg-slate-700/30 opacity-50'
                  }`}
                >
                  <div className="text-3xl mb-2">{badge.icon}</div>
                  <div className={`text-sm ${badge.earned ? 'text-white' : 'text-gray-500'}`}>
                    {badge.name}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Experience Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 rounded-2xl bg-slate-800/50 border border-white/5 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-2xl">⭐</span>
              </div>
              <div>
                <h3 className="font-bold text-white">Level {profile.level}</h3>
                <p className="text-sm text-gray-400">Next level in {100 - (profile.experience % 100)} EXP</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-400">{profile.experience}</div>
              <div className="text-sm text-gray-400">Total EXP</div>
            </div>
          </div>
          <div className="h-6 rounded-full bg-slate-700 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
              style={{ width: `${(profile.experience % 100)}%` }}
            />
          </div>
        </motion.div>

        {/* Quick Links */}
        <div className="mt-8 grid gap-4 sm:grid-cols-4">
          {[
            { name: 'My Monsters', icon: '🐉', href: '/dungeons', color: 'from-purple-500 to-pink-500' },
            { name: 'Marketplace', icon: '🏪', href: '/marketplace', color: 'from-amber-500 to-yellow-500' },
            { name: 'Arena Battles', icon: '⚔️', href: '/arena', color: 'from-red-500 to-orange-500' },
            { name: 'AFK Hatch', icon: '🥚', href: '/afk', color: 'from-blue-500 to-cyan-500' },
          ].map((link, index) => (
            <motion.a
              key={link.name}
              href={link.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex flex-col items-center p-6 rounded-xl bg-slate-800/50 border border-white/5 hover:border-white/20 transition-all group"
            >
              <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform`}>
                {link.icon}
              </div>
              <span className="font-medium text-white group-hover:text-amber-400 transition-colors">{link.name}</span>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
}
