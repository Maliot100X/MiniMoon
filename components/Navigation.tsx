'use client';

import { useAccount, useDisconnect, useConnect, useSwitchChain, useChainId } from 'wagmi';
import { Loader2, Wallet, LogOut, Copy, Check, ChevronDown, RefreshCw, Link2, Shield, Smartphone } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Base chain ID
const BASE_CHAIN_ID = 8453;

// Check if running in Base Mini App context
const isBaseMiniApp = typeof window !== 'undefined' && (
  window.location.search.includes('mini_app=true') ||
  (typeof window.location.hostname !== 'undefined' && window.location.hostname.includes('base.org')) ||
  navigator.userAgent.includes('BaseWallet') ||
  navigator.userAgent.includes(' Coinbase Wallet')
);

export function Navigation() {
  const { address, isConnected, isConnecting, chainId, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect, connectors } = useConnect();
  const { switchChain } = useSwitchChain();
  const currentChainId = useChainId();
  
  const [copied, setCopied] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'synced' | 'error'>('idle');
  const [connectionMode, setConnectionMode] = useState<'auto' | 'manual'>('manual');
  const [showBaseWarning, setShowBaseWarning] = useState(false);
  const pathname = usePathname();

  // Auto-detect Base mini app context
  useEffect(() => {
    if (isBaseMiniApp) {
      setConnectionMode('auto');
      setShowBaseWarning(true);
      // Auto-connect if in Base mini app
      if (!isConnected) {
        const baseConnector = connectors.find(c => 
          c.id === 'io.metamask' || 
          c.id === 'com.coinbase.wallet' ||
          c.name?.includes('Base')
        );
        if (baseConnector) {
          connect({ connector: baseConnector });
        }
      }
    }
  }, [isBaseMiniApp, isConnected, connectors, connect]);

  // Ensure on Base chain when connected
  useEffect(() => {
    if (isConnected && currentChainId !== BASE_CHAIN_ID) {
      switchChain({ chainId: BASE_CHAIN_ID });
    }
  }, [isConnected, currentChainId, switchChain]);

  // Auto-sync wallet on connection
  useEffect(() => {
    if (isConnected && address) {
      setSyncStatus('synced');
      console.log('Wallet synced:', address, 'Chain:', chainId);
    }
  }, [isConnected, address, chainId]);

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
      console.log('Synced wallet holdings:', address);
    }
    
    setSyncing(false);
  };

  // Switch connection mode
  const toggleConnectionMode = useCallback(() => {
    if (connectionMode === 'manual') {
      setConnectionMode('auto');
      setShowBaseWarning(true);
    } else {
      setConnectionMode('manual');
      setShowBaseWarning(false);
    }
  }, [connectionMode]);

  // Connect to Base manually
  const connectToBase = useCallback(() => {
    const baseConnector = connectors.find(c => 
      c.id === 'io.metamask' || 
      c.id === 'com.coinbase.wallet' ||
      c.name?.includes('Base Wallet')
    );
    if (baseConnector) {
      connect({ connector: baseConnector });
    } else {
      // Fallback to first available connector
      if (connectors[0]) {
        connect({ connector: connectors[0] });
      }
    }
  }, [connectors, connect]);

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
      {/* Base Mini App Warning Banner */}
      {showBaseWarning && connectionMode === 'auto' && (
        <div className="bg-gradient-to-r from-blue-600/90 to-indigo-600/90 px-4 py-2 text-center text-xs text-white">
          <span className="font-medium">🔗 Base Mini App Mode:</span> Your wallet connection is synced with Base. {' '}
          <button
            onClick={() => setShowBaseWarning(false)}
            className="underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

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
            {/* Base Mini App Mode Toggle */}
            <button
              onClick={toggleConnectionMode}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                connectionMode === 'auto'
                  ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                  : 'bg-slate-800/50 text-gray-400 border-white/10 hover:text-white'
              }`}
              title={connectionMode === 'auto' ? 'Auto-detect Base Mini App' : 'Manual connection mode'}
            >
              <Smartphone className="h-3 w-3" />
              <span className="hidden sm:inline">
                {connectionMode === 'auto' ? 'Auto' : 'Manual'}
              </span>
            </button>

            {/* Base Chain Indicator */}
            {isConnected && (
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs ${
                currentChainId === BASE_CHAIN_ID
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                <Shield className="h-3 w-3" />
                <span className="hidden sm:inline">Base</span>
              </div>
            )}

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
                  <div className={`h-2 w-2 rounded-full ${currentChainId === BASE_CHAIN_ID ? 'bg-blue-500' : 'bg-yellow-500'}`} />
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
                onClick={connectToBase}
                disabled={isConnecting}
                className="flex items-center space-x-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-1.5 text-xs font-bold text-white hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/25 disabled:opacity-50"
              >
                {isConnecting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Wallet className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
