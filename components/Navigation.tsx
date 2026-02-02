'use client';

import { useAccount, useDisconnect, useConnect } from 'wagmi';
import { Loader2, Wallet, LogOut, Copy, Check, ChevronDown, RefreshCw, Link2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navigation() {
  const { address, isConnected, isConnecting, chainId } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect, connectors } = useConnect();
  const [copied, setCopied] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'synced' | 'error'>('idle');
  const pathname = usePathname();

  // Auto-sync wallet on connection
  useEffect(() => {
    if (isConnected && address) {
      setSyncStatus('synced');
      console.log('Wallet synced:', address);
    }
  }, [isConnected, address]);

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Manual sync for FarCaster/Twitter
  const handleSync = async () => {
    setSyncing(true);
    setSyncStatus('idle');
    
    // Simulate sync process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (address) {
      setSyncStatus('synced');
      // Post to FarCaster (would integrate with Neycast API)
      console.log('Synced wallet holdings:', address);
    }
    
    setSyncing(false);
  };

  // Main 5 tabs
  const mainTabs = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/arena', label: 'Arena', icon: '⚔️' },
    { href: '/marketplace', label: 'Market', icon: '🏪' },
    { href: '/afk', label: 'AFK', icon: '⏰' },
    { href: '/profile', label: 'Profile', icon: '👤' },
  ];

  // More dropdown items
  const moreTabs = [
    { href: '/dungeons', label: 'Dungeons', icon: '🏰' },
    { href: '/quests', label: 'Quests', icon: '📅' },
    { href: '/rankings', label: 'Rankings', icon: '🏆' },
    { href: '/share', label: 'Share & Tasks', icon: '📤' },
    { href: '/staking', label: 'Staking & Coin', icon: '🪙' },
    { href: '/subscription', label: 'Premium', icon: '⭐' },
    { href: '/farcaster', label: 'FarCaster', icon: '🦪' },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/90 backdrop-blur-lg">
      <div className="mx-auto max-w-full px-3 sm:px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <span className="text-lg font-bold text-white">M</span>
              </div>
              <div className="absolute -inset-1 rounded-full bg-amber-500/30 blur animate-pulse" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-amber-400 to-pink-500 bg-clip-text text-transparent hidden sm:block">
              MiniMoon
            </span>
          </Link>

          {/* Main Navigation - 5 tabs */}
          <div className="hidden md:flex items-center space-x-1">
            {mainTabs.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all flex items-center space-x-1 ${
                  pathname === tab.href
                    ? 'text-white bg-white/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="hidden lg:inline">{tab.label}</span>
              </Link>
            ))}

            {/* More Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowMore(!showMore)}
                className="px-3 py-2 text-sm font-medium rounded-lg transition-all flex items-center space-x-1 text-gray-300 hover:text-white hover:bg-white/5"
              >
                <span>⋯</span>
                <span className="hidden lg:inline">More</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showMore ? 'rotate-180' : ''}`} />
              </button>

              {showMore && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowMore(false)} />
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-800 border border-white/10 shadow-xl z-20 py-2">
                    {moreTabs.map((tab) => (
                      <Link
                        key={tab.href}
                        href={tab.href}
                        onClick={() => setShowMore(false)}
                        className={`flex items-center space-x-2 px-4 py-2 text-sm transition-colors ${
                          pathname === tab.href
                            ? 'text-white bg-white/10'
                            : 'text-gray-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <span>{tab.icon}</span>
                        <span>{tab.label}</span>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <select
              className="bg-slate-800 text-white rounded-lg px-3 py-2 text-sm"
              onChange={(e) => {
                if (e.target.value) window.location.href = e.target.value;
              }}
              value={pathname}
            >
              <option value="/">🏠 Home</option>
              <option value="/arena">⚔️ Arena</option>
              <option value="/marketplace">🏪 Market</option>
              <option value="/afk">⏰ AFK</option>
              <option value="/profile">👤 Profile</option>
              <option value="/dungeons">🏰 Dungeons</option>
              <option value="/quests">📅 Quests</option>
              <option value="/rankings">🏆 Rankings</option>
              <option value="/share">📤 Share & Tasks</option>
              <option value="/staking">🪙 Staking & Coin</option>
              <option value="/farcaster">🦪 FarCaster</option>
            </select>
          </div>

          {/* Wallet Connection + Sync Button */}
          <div className="flex items-center space-x-2">
            {/* FarCaster Sync Button */}
            <button
              onClick={handleSync}
              disabled={!isConnected || syncing}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                syncStatus === 'synced'
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30'
              } disabled:opacity-50`}
              title="Sync wallet to FarCaster"
            >
              {syncing ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : syncStatus === 'synced' ? (
                <Check className="h-3 w-3" />
              ) : (
                <RefreshCw className="h-3 w-3" />
              )}
              <span className="hidden sm:inline">
                {syncing ? 'Syncing...' : syncStatus === 'synced' ? 'Synced' : 'Sync'}
              </span>
            </button>

            {/* FarCaster Profile Link */}
            <a
              href="https://farcaster.xyz/maliotsol"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-400 border border-purple-500/30 hover:from-purple-500/30 hover:to-indigo-500/30 transition-all"
              title="Follow @maliotsol on FarCaster"
            >
              <Link2 className="h-3 w-3" />
              <span className="hidden sm:inline">@maliotsol</span>
            </a>

            {isConnected && address ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={copyAddress}
                  className="flex items-center space-x-1 rounded-full bg-slate-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700 transition-colors"
                >
                  <div className={`h-2 w-2 rounded-full ${chainId === 8453 ? 'bg-blue-500' : 'bg-yellow-500'}`} />
                  <span className="hidden sm:inline">{formatAddress(address)}</span>
                  {copied ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <Copy className="h-3 w-3 text-gray-400" />
                  )}
                </button>
                <button
                  onClick={() => disconnect()}
                  className="rounded-full bg-slate-800 p-1.5 text-gray-400 hover:text-white hover:bg-slate-700 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  const connector = connectors[0];
                  if (connector) connect({ connector });
                }}
                disabled={isConnecting}
                className="flex items-center space-x-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-1.5 text-xs font-bold text-white hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/25 disabled:opacity-50"
              >
                {isConnecting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Wallet className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">{isConnecting ? 'Connecting...' : 'Connect'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
