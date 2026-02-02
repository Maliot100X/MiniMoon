'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { Star, Clock, Zap, Crown, Gift, Check, Sparkles, CreditCard, Shield } from 'lucide-react';

export default function SubscriptionPage() {
  const { isConnected, address } = useAccount();
  const [selectedPlan, setSelectedPlan] = useState<'24h' | '30d' | null>(null);
  const [processing, setProcessing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [daysLeft, setDaysLeft] = useState(0);

  const plans = [
    {
      id: '24h',
      name: '🕐 24-Hour Pass',
      price: 1,
      period: '24 hours',
      popular: false,
      features: [
        '✨ 2x Token Rewards',
        '💫 Premium Battle Effects',
        '🎁 Daily Mystery Box',
        '⚡ 2x Energy Regen',
        '🏆 VIP Badge',
      ],
    },
    {
      id: '30d',
      name: '⭐ Monthly Premium',
      price: 20,
      period: '30 days',
      popular: true,
      features: [
        '✨ 2x Token Rewards',
        '💫 Premium Battle Effects',
        '🎁 Daily Mystery Box',
        '⚡ 2x Energy Regen',
        '🏆 VIP Badge',
        '👑 Exclusive Shop Items',
        '🎯 Priority Matchmaking',
        '📊 Advanced Analytics',
        '💬 Premium Support',
      ],
    },
  ];

  const handleSubscribe = async (planId: string) => {
    if (!isConnected) {
      alert('Connect wallet first!');
      return;
    }
    
    setProcessing(true);
    setSelectedPlan(planId as '24h' | '30d');
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSubscribed(true);
    setDaysLeft(planId === '24h' ? 1 : 30);
    setProcessing(false);
    setSelectedPlan(null);
  };

  const currentPlan = subscribed ? (daysLeft === 1 ? '24h' : '30d') : null;

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 rounded-full bg-gradient-to-r from-amber-500/10 to-pink-500/10 px-4 py-2 text-sm text-amber-400 border border-amber-500/20 mb-4">
            <Star className="h-4 w-4" />
            <span>Premium Membership</span>
          </div>
          <h1 className="text-4xl font-bold text-white">Unlock Premium Features!</h1>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            Subscribe to get exclusive benefits, boost your earnings, and stand out from the crowd!
          </p>
        </div>

        {/* Current Subscription Status */}
        {subscribed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded-2xl bg-gradient-to-r from-amber-500/20 to-pink-500/20 border border-amber-500/30 p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-500 to-pink-500 flex items-center justify-center">
                  <Crown className="h-8 w-8 text-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xl font-bold text-white">Premium Active!</h3>
                    <Sparkles className="h-5 w-5 text-amber-400 animate-pulse" />
                  </div>
                  <p className="text-gray-300">
                    {daysLeft === 1 ? 'Expires in 24 hours' : `Expires in ${daysLeft} days`}
                  </p>
                </div>
              </div>
              <button className="px-6 py-2 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors">
                Extend Subscription
              </button>
            </div>
          </motion.div>
        )}

        {/* Pricing Plans */}
        <div className="grid gap-8 lg:grid-cols-2">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-2xl border-2 p-8 ${
                plan.popular
                  ? 'border-amber-500 bg-gradient-to-b from-amber-500/10 to-transparent'
                  : 'border-white/10 bg-slate-800/50'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center space-x-1 rounded-full bg-gradient-to-r from-amber-500 to-pink-500 px-4 py-1 text-sm font-bold text-white">
                    <Star className="h-4 w-4" />
                    <span>Most Popular</span>
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <div className="text-5xl mb-4">{plan.id === '24h' ? '🕐' : '⭐'}</div>
                <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                <div className="mt-4 flex items-baseline justify-center space-x-2">
                  <span className="text-5xl font-bold text-white">${plan.price}</span>
                  <span className="text-gray-400">/ {plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={processing || (subscribed && currentPlan === plan.id)}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-r from-amber-500 to-pink-500 text-white hover:opacity-90'
                    : 'bg-slate-700 text-white hover:bg-slate-600'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {processing && selectedPlan === plan.id ? (
                  <span className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Processing...</span>
                  </span>
                ) : subscribed && currentPlan === plan.id ? (
                  'Current Plan'
                ) : (
                  `Subscribe for $${plan.price}`
                )}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Premium Benefits Detail */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-white text-center mb-8">🎁 Premium Benefits</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: '💰', title: '2x Rewards', desc: 'Double $MNMOON from battles, dungeons, and quests' },
              { icon: '⚡', title: '2x Energy', desc: 'Energy regenerates twice as fast' },
              { icon: '✨', title: 'Premium Effects', desc: 'Exclusive battle animations and visual effects' },
              { icon: '🎁', title: 'Daily Boxes', desc: 'Mystery boxes with rare items every day' },
              { icon: '🏆', title: 'VIP Badge', desc: 'Show off your premium status' },
              { icon: '👑', title: 'Exclusive Items', desc: 'Access to premium-only shop items' },
              { icon: '🎯', title: 'Priority Queue', desc: 'Faster matchmaking in Arena' },
              { icon: '📊', title: 'Analytics', desc: 'Detailed battle stats and insights' },
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-xl bg-slate-800/50 border border-white/5 p-6 text-center"
              >
                <div className="text-4xl mb-3">{benefit.icon}</div>
                <h3 className="font-bold text-white">{benefit.title}</h3>
                <p className="mt-2 text-sm text-gray-400">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-12 rounded-2xl bg-slate-800/50 border border-white/5 p-8">
          <h3 className="text-xl font-bold text-white text-center mb-6">💳 Payment Methods</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {['💳 Credit Card', '🪙 Crypto (USDC)', '🔄 PayPal', '🍎 Apple Pay', '🤖 Google Pay'].map((method) => (
              <div key={method} className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-slate-700/50 text-gray-300">
                <span>{method.split(' ')[0]}</span>
                <span className="text-sm">{method.substring(2)}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-400">
            <Shield className="h-4 w-4" />
            <span>Secure payment powered by Stripe</span>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white text-center mb-8">❓ Frequently Asked Questions</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { q: 'Can I cancel anytime?', a: 'Yes, cancel anytime. Your benefits continue until the period ends.' },
              { q: 'Is it refundable?', a: 'We offer a 7-day money-back guarantee if you are not satisfied.' },
              { q: 'Do I keep my items?', a: 'Yes! All items and progress are saved after subscription ends.' },
              { q: 'Can I gift a subscription?', a: 'Yes! Gift premium to friends from the shop section.' },
              { q: 'Does it work on mobile?', a: 'Yes, premium benefits work on all devices including mobile.' },
              { q: 'What about taxes?', a: 'Prices exclude applicable taxes based on your location.' },
            ].map((faq, index) => (
              <div key={index} className="rounded-xl bg-slate-800/30 border border-white/5 p-6">
                <h4 className="font-bold text-white">{faq.q}</h4>
                <p className="mt-2 text-gray-400 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Money Back Guarantee */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 p-8 text-center">
          <div className="text-5xl mb-4">🛡️</div>
          <h3 className="text-xl font-bold text-white">7-Day Money-Back Guarantee</h3>
          <p className="mt-2 text-gray-300 max-w-2xl mx-auto">
            Not satisfied? Get a full refund within 7 days of purchase, no questions asked.
          </p>
        </div>
      </div>
    </div>
  );
}
