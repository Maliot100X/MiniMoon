'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Loader2, Coins, Sword, Trophy, Gift, Zap } from 'lucide-react';

interface BotMessage {
  id: number;
  text: string;
  type: 'bot' | 'user';
  timestamp: Date;
}

interface UserStats {
  power: number;
  tokens: number;
  monsters: number;
  level: number;
  wins: number;
  daysPlayed: number;
  stakedAmount: number;
  dailyRewards: number;
}

export function FloatingBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<BotMessage[]>([
    {
      id: 1,
      text: "🌙 Hello! I'm Mini Moon Bot, your personal gaming assistant! I can help you with:\n\n• 💰 Check your token balance & staked amounts\n• ⚔️ View your battle stats and power\n• 🐉 Track your monster collection\n• 🎁 Claim daily rewards\n• 🏆 Check tournament rankings\n• 📊 Calculate optimal staking strategies\n\nHow can I help you today?",
      type: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Simulated user stats (would come from real data in production)
  const [userStats] = useState<UserStats>({
    power: 8450,
    tokens: 12500,
    monsters: 12,
    level: 45,
    wins: 156,
    daysPlayed: 89,
    stakedAmount: 5000,
    dailyRewards: 25.50,
  });

  const quickActions = [
    { icon: Coins, label: 'Check Balance', query: 'balance' },
    { icon: Sword, label: 'Battle Stats', query: 'battle stats' },
    { icon: Trophy, label: 'My Rank', query: 'my rank' },
    { icon: Gift, label: 'Daily Rewards', query: 'daily rewards' },
    { icon: Zap, label: 'Staking Info', query: 'staking' },
  ];

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: BotMessage = {
      id: messages.length + 1,
      text: input,
      type: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const response = generateResponse(input, userStats);
      const botMessage: BotMessage = {
        id: messages.length + 2,
        text: response,
        type: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (query: string) => {
    setInput(query);
    setTimeout(() => handleSend(), 100);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg shadow-amber-500/30 flex items-center justify-center z-50"
      >
        <Bot className="h-7 w-7 text-white" />
        <span className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-slate-900" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-96 h-[32rem] bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-amber-500/20 to-orange-500/20">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Mini Moon Bot</h3>
                  <p className="text-xs text-green-400 flex items-center">
                    <span className="h-2 w-2 rounded-full bg-green-400 mr-1" />
                    Online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-br-md'
                        : 'bg-slate-700/50 text-gray-200 rounded-bl-md border border-white/5'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                    <p className={`text-xs mt-1 ${message.type === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-700/50 rounded-2xl rounded-bl-md px-4 py-3 border border-white/5">
                    <div className="flex space-x-1">
                      <motion.div
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="h-2 w-2 rounded-full bg-amber-400"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                        className="h-2 w-2 rounded-full bg-amber-400"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                        className="h-2 w-2 rounded-full bg-amber-400"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="p-3 border-t border-white/10 bg-slate-800/50">
              <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                {quickActions.map((action) => (
                  <button
                    key={action.query}
                    onClick={() => handleQuickAction(action.query)}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-full bg-slate-700/50 text-xs text-gray-300 hover:bg-slate-700 hover:text-white transition-colors whitespace-nowrap"
                  >
                    <action.icon className="h-3 w-3" />
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1 px-4 py-2 rounded-xl bg-slate-700/50 text-white placeholder-gray-400 border border-white/10 focus:border-amber-500/50 focus:outline-none text-sm"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="p-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isTyping ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Bot response generator
function generateResponse(query: string, stats: UserStats): string {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('balance') || lowerQuery.includes('tokens') || lowerQuery.includes('money')) {
    return `💰 Your Current Balance:

• Wallet: ${stats.tokens.toLocaleString()} $MNMOON
• Staked: ${stats.stakedAmount.toLocaleString()} $MNMOON
• Daily Rewards Rate: ${stats.dailyRewards.toFixed(2)} $MNMOON/day

💡 Tip: Stake your tokens to earn up to 50% APY!`;
  }

  if (lowerQuery.includes('battle') || lowerQuery.includes('power') || lowerQuery.includes('stats')) {
    return `⚔️ Your Battle Stats:

• Total Power: ${stats.power.toLocaleString()} ⚔️
• Arena Wins: ${stats.wins}
• Win Rate: ${((stats.wins / (stats.wins + 42)) * 100).toFixed(1)}%
• Level: ${stats.level}

💡 Tip: Upgrade your monsters to increase power!`;
  }

  if (lowerQuery.includes('rank') || lowerQuery.includes('position')) {
    return `🏆 Your Current Ranking:

• Global Power Rank: #234
• Arena ELO: 1,850
• Weekly Tournament: #156

💡 Tip: Win more battles to climb the rankings!`;
  }

  if (lowerQuery.includes('daily') || lowerQuery.includes('reward')) {
    return `🎁 Daily Rewards:

• Next Reward In: ${Math.floor(Math.random() * 12)}h ${Math.floor(Math.random() * 60)}m
• Pending Rewards: ${(Math.random() * 50).toFixed(2)} $MNMOON
• Streak: ${Math.floor(Math.random() * 30)} days 🔥

💡 Tip: Claim rewards daily to maintain your streak!`;
  }

  if (lowerQuery.includes('stake') || lowerQuery.includes('staking')) {
    return `🪙 Staking Information:

• Currently Staked: ${stats.stakedAmount.toLocaleString()} $MNMOON
• APY: 12% (7-Day Pool)
• Pending Rewards: ${(stats.stakedAmount * 0.12 / 365).toFixed(2)} $MNMOON
• Lock Period: 3 days remaining

💡 Tip: Consider the VIP pool for 50% APY!`;
  }

  if (lowerQuery.includes('monster') || lowerQuery.includes('collection')) {
    return `🐉 Your Monster Collection:

• Total Monsters: ${stats.monsters}
• Common: ${Math.floor(stats.monsters * 0.5)}
• Rare: ${Math.floor(stats.monsters * 0.25)}
• Epic: ${Math.floor(stats.monsters * 0.15)}
• Legendary: ${Math.floor(stats.monsters * 0.08)}
• Mythic: ${Math.floor(stats.monsters * 0.02)}

💡 Tip: Hatch eggs for a chance at Mythic monsters!`;
  }

  return `🌙 I can help you with:

• 💰 Token balances & staking
• ⚔️ Battle stats & power
• 🏆 Rankings & leaderboards
• 🎁 Daily rewards & streaks
• 🐉 Monster collection info
• 📊 Game statistics

What would you like to know more about?`;
}
