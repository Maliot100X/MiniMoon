'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Share2, Twitter, Github, Check, ExternalLink, RefreshCw, Copy, Trophy } from 'lucide-react';
import Link from 'next/link';
import { useAccount } from 'wagmi';

type TaskStatus = 'pending' | 'verified' | 'completed';

interface ShareTask {
  id: string;
  title: string;
  description: string;
  platform: 'farcaster' | 'twitter' | 'github';
  points: number;
  status: TaskStatus;
  actionUrl?: string;
  verifyRequired: boolean;
}

const TASKS: ShareTask[] = [
  {
    id: 'share-app',
    title: 'Share MiniMoon on FarCaster',
    description: 'Share your game score and tag @maliotsol to earn rewards!',
    platform: 'farcaster',
    points: 500,
    status: 'pending',
    actionUrl: 'https://farcaster.xyz',
    verifyRequired: true,
  },
  {
    id: 'share-score',
    title: 'Share Your Score',
    description: 'Post your current score with a cool image to FarCaster',
    platform: 'farcaster',
    points: 300,
    status: 'pending',
    verifyRequired: true,
  },
  {
    id: 'follow-farcaster',
    title: 'Follow @maliotsol on FarCaster',
    description: 'Follow the official MiniMoon account',
    platform: 'farcaster',
    points: 200,
    status: 'pending',
    actionUrl: 'https://farcaster.xyz/maliotsol',
    verifyRequired: true,
  },
  {
    id: 'share-twitter',
    title: 'Share on Twitter/X',
    description: 'Tweet about MiniMoon and tag @minimoon_game',
    platform: 'twitter',
    points: 400,
    status: 'pending',
    actionUrl: 'https://x.com/home',
    verifyRequired: true,
  },
  {
    id: 'follow-twitter',
    title: 'Follow @minimoon_game on Twitter',
    description: 'Stay updated with the latest news',
    platform: 'twitter',
    points: 150,
    status: 'pending',
    actionUrl: 'https://x.com/minimoon_game',
    verifyRequired: true,
  },
  {
    id: 'star-github',
    title: 'Star MiniMoon on GitHub',
    description: 'Give our project a star to support development!',
    platform: 'github',
    points: 1000,
    status: 'pending',
    actionUrl: 'https://github.com/Maliot100X/MiniMoon',
    verifyRequired: true,
  },
  {
    id: 'fork-github',
    title: 'Fork MiniMoon on GitHub',
    description: 'Fork the repository to show your support',
    platform: 'github',
    points: 500,
    status: 'pending',
    actionUrl: 'https://github.com/Maliot100X/MiniMoon/fork',
    verifyRequired: true,
  },
];

export default function SharePage() {
  const { isConnected, address } = useAccount();
  const [tasks, setTasks] = useState<ShareTask[]>(TASKS);
  const [verifying, setVerifying] = useState<string | null>(null);
  const [totalPoints, setTotalPoints] = useState(0);
  const [dailyRefresh, setDailyRefresh] = useState(0);

  // Calculate total points earned
  useEffect(() => {
    const completed = tasks.filter(t => t.status === 'completed');
    setTotalPoints(completed.reduce((sum, t) => sum + t.points, 0));
  }, [tasks]);

  // Daily refresh countdown
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const updateRefresh = () => {
      const diff = tomorrow.getTime() - new Date().getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setDailyRefresh(diff);
    };
    
    updateRefresh();
    const interval = setInterval(updateRefresh, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAction = (task: ShareTask) => {
    if (task.actionUrl) {
      window.open(task.actionUrl, '_blank');
    }
  };

  const verifyTask = async (taskId: string) => {
    if (!isConnected) {
      alert('Please connect your wallet first!');
      return;
    }

    setVerifying(taskId);
    
    // Simulate verification process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setTasks(prev => prev.map(t => 
      t.id === taskId 
        ? { ...t, status: 'completed'}
        : t
    ));
    
    setVerifying(null);
  };

  const shareToFarCaster = () => {
    const castUrl = `https://farcaster.xyz/?text=${encodeURIComponent('Playing MiniMoon on Base! Join me at https://mini-moon-ten.vercel.app #MiniMoon #Base #Web3Gaming @maliotsol')}`;
    window.open(castUrl, '_blank');
  };

  const shareToTwitter = () => {
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent('Playing MiniMoon on Base! Join me at https://mini-moon-ten.vercel.app #MiniMoon #Base #Web3Gaming')}`;
    window.open(tweetUrl, '_blank');
  };

  const copyScore = async () => {
    const scoreText = `MiniMoon - Play at https://mini-moon-ten.vercel.app #MiniMoon #Base #Web3Gaming @maliotsol`;
    await navigator.clipboard.writeText(scoreText);
    alert('Copied! Connect wallet for real stats.');
  };

  const platformIcons = {
    farcaster: '🦪',
    twitter: '🐦',
    github: '🐙',
  };

  const platformColors = {
    farcaster: 'from-purple-500 to-indigo-500',
    twitter: 'from-blue-400 to-blue-600',
    github: 'from-gray-700 to-gray-900',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-white/5 py-6">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-400 hover:text-white">←</Link>
              <h1 className="text-3xl font-bold text-white">📤 Share & Tasks</h1>
            </div>
          </div>

          {/* Points Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl p-4 border border-amber-500/20 text-center">
              <p className="text-3xl font-bold text-amber-400">{totalPoints.toLocaleString()}</p>
              <p className="text-sm text-gray-400">Points Earned</p>
            </div>
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-green-500/20 text-center">
              <p className="text-3xl font-bold text-green-400">{tasks.filter(t => t.status === 'completed').length}/{tasks.length}</p>
              <p className="text-sm text-gray-400">Tasks Completed</p>
            </div>
            <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl p-4 border border-blue-500/20 text-center">
              <p className="text-3xl font-bold text-blue-400">{Math.floor(dailyRefresh / (1000 * 60 * 60))}:{Math.floor((dailyRefresh % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0')}</p>
              <p className="text-sm text-gray-400">Daily Refresh</p>
            </div>
          </div>

          {/* Quick Share */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={shareToFarCaster}
              disabled={!isConnected}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold hover:opacity-90 disabled:opacity-50"
            >
              <Share2 className="h-4 w-4" />
              <span>Share on FarCaster</span>
            </button>
            <button
              onClick={shareToTwitter}
              disabled={!isConnected}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold hover:opacity-90 disabled:opacity-50"
            >
              <Twitter className="h-4 w-4" />
              <span>Share on Twitter</span>
            </button>
            <button
              onClick={copyScore}
              disabled={!isConnected}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-700 text-white font-bold hover:bg-slate-600 disabled:opacity-50"
            >
              <Copy className="h-4 w-4" />
              <span>Copy Score</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-xl font-bold text-white mb-6">🎯 Available Tasks</h2>

          <div className="space-y-4">
            {tasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`relative bg-slate-800/50 rounded-xl p-4 border border-white/5 transition-all ${
                  task.status === 'completed' ? 'border-green-500/30' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  {/* Platform Icon */}
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-r ${platformColors[task.platform]} flex items-center justify-center text-2xl flex-shrink-0`}>
                    {platformIcons[task.platform]}
                  </div>

                  {/* Task Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-white">{task.title}</h3>
                      {task.status === 'completed' && (
                        <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-bold">
                          ✓ Completed
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{task.description}</p>
                    
                    {/* Points Badge */}
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-sm font-bold">
                        +{task.points} pts
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => handleAction(task)}
                      disabled={task.status === 'completed'}
                      className={`flex items-center space-x-1 px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                        task.status === 'completed'
                          ? 'bg-slate-700 text-gray-500 cursor-not-allowed'
                          : `bg-gradient-to-r ${platformColors[task.platform]} text-white hover:opacity-90`
                      }`}
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>Open</span>
                    </button>
                    
                    {task.verifyRequired && task.status !== 'completed' && (
                      <button
                        onClick={() => verifyTask(task.id)}
                        disabled={verifying === task.id || !isConnected}
                        className="flex items-center justify-center space-x-1 px-4 py-2 rounded-lg bg-green-500/20 text-green-400 border border-green-500/30 font-bold text-sm hover:bg-green-500/30 disabled:opacity-50"
                      >
                        {verifying === task.id ? (
                          <>
                            <RefreshCw className="h-3 w-3 animate-spin" />
                            <span>Verifying...</span>
                          </>
                        ) : (
                          <>
                            <Check className="h-3 w-3" />
                            <span>Verify</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* How it Works */}
          <div className="mt-8 bg-slate-800/50 rounded-xl p-6 border border-white/5">
            <h3 className="text-lg font-bold text-white mb-4">💡 How Verification Works</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-4xl mb-2">1️⃣</div>
                <p className="font-bold text-white">Complete Action</p>
                <p className="text-gray-400">Follow links and complete the task</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">2️⃣</div>
                <p className="font-bold text-white">Click Verify</p>
                <p className="text-gray-400">We check if you actually did it</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">3️⃣</div>
                <p className="font-bold text-white">Get Points</p>
                <p className="text-gray-400">Earn $MNMOON rewards!</p>
              </div>
            </div>
          </div>

          {/* Rewards Info */}
          <div className="mt-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl p-6 border border-amber-500/20">
            <div className="flex items-center space-x-3 mb-4">
              <Trophy className="h-6 w-6 text-amber-400" />
              <h3 className="text-lg font-bold text-white">🏆 Rewards Pool</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Complete tasks to earn points from our weekly 50,000 $MNMOON rewards pool!
              Top earners get bonus rewards every Sunday.
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-amber-400">1st</p>
                <p className="text-sm text-gray-400">5,000 $MNMOON</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-300">2nd</p>
                <p className="text-sm text-gray-400">2,500 $MNMOON</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-400">3rd</p>
                <p className="text-sm text-gray-400">1,000 $MNMOON</p>
              </div>
            </div>
          </div>

          {/* Leaderboard Preview */}
          <div className="mt-6 bg-slate-800/50 rounded-xl p-6 border border-white/5">
            <h3 className="text-lg font-bold text-white mb-4">📊 Weekly Leaderboard</h3>
            <div className="space-y-3">
              {[
                { rank: 1, user: 'PokemonKing', points: 4500 },
                { rank: 2, user: 'BattlePro', points: 3800 },
                { rank: 3, user: 'Collector99', points: 3200 },
                { rank: 4, user: 'ShadowHunter', points: 2800 },
                { rank: 5, user: 'You', points: totalPoints, isYou: true },
              ].map((entry) => (
                <div
                  key={entry.rank}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    entry.isYou ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-slate-700/30'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={`font-bold w-6 ${
                      entry.rank === 1 ? 'text-amber-400' :
                      entry.rank === 2 ? 'text-gray-300' :
                      entry.rank === 3 ? 'text-orange-400' :
                      'text-gray-400'
                    }`}>
                      #{entry.rank}
                    </span>
                    <span className={`font-bold ${entry.isYou ? 'text-amber-400' : 'text-white'}`}>
                      {entry.user}
                    </span>
                  </div>
                  <span className="font-bold text-amber-400">{entry.points.toLocaleString()} pts</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
