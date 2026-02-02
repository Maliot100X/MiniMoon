'use client';

import { useAccount, useDisconnect, useConnect, useBalance } from 'wagmi';
import { Loader2, Wallet, LogOut, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navigation() {
  const { address, isConnected, isConnecting } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect, connectors } = useConnect();
  const [copied, setCopied] = useState(false);
  const pathname = usePathname();

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

  const navLinks = [
    { href: '/dungeons', label: '🏰 Dungeons', icon: '🏰' },
    { href: '/arena', label: '⚔️ Arena', icon: '⚔️' },
    { href: '/afk', label: '⏰ AFK', icon: '⏰' },
    { href: '/quests', label: '📅 Quests', icon: '📅' },
    { href: '/marketplace', label: '🏪 Market', icon: '🏪' },
    { href: '/shop', label: '🛒 Shop', icon: '🛒' },
    { href: '/rankings', label: '🏆 Rankings', icon: '🏆' },
    { href: '/profile', label: '👤 Profile', icon: '👤' },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/80 backdrop-blur-lg">
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <span className="text-xl font-bold text-white">M</span>
              </div>
              <div className="absolute -inset-1 rounded-full bg-amber-500/30 blur animate-pulse" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-pink-500 bg-clip-text text-transparent">
              MiniMoon
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden xl:flex items-center space-x-1">
            {navLinks.map((link) => (
              <NavLink 
                key={link.href} 
                href={link.href} 
                label={link.label}
                active={pathname === link.href}
              />
            ))}
          </div>

          {/* Mobile Menu */}
          <div className="xl:hidden">
            <select 
              className="bg-slate-800 text-white rounded-lg px-3 py-2 text-sm"
              onChange={(e) => {
                if (e.target.value) window.location.href = e.target.value;
              }}
              value={pathname}
            >
              <option value="/">Menu</option>
              <option value="/dungeons">🏰 Dungeons</option>
              <option value="/arena">⚔️ Arena</option>
              <option value="/afk">⏰ AFK</option>
              <option value="/quests">📅 Quests</option>
              <option value="/marketplace">🏪 Market</option>
              <option value="/shop">🛒 Shop</option>
              <option value="/rankings">🏆 Rankings</option>
              <option value="/profile">👤 Profile</option>
            </select>
          </div>

          {/* Mini App Links */}
          <div className="hidden md:flex items-center space-x-2 mr-4">
            <a 
              href="/farcaster"
              className="px-3 py-1 text-xs font-medium text-purple-400 bg-purple-400/10 rounded-lg hover:bg-purple-400/20 transition-colors"
            >
              📱 FarCaster
            </a>
            <a 
              href="/base"
              className="px-3 py-1 text-xs font-medium text-blue-400 bg-blue-400/10 rounded-lg hover:bg-blue-400/20 transition-colors"
            >
              🔵 Base
            </a>
          </div>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-3">
            {isConnected && address ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={copyAddress}
                  className="flex items-center space-x-2 rounded-full bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 transition-colors"
                >
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span>{formatAddress(address)}</span>
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4 text-gray-400" />
                  )}
                </button>
                <button
                  onClick={() => disconnect()}
                  className="rounded-full bg-slate-800 p-2 text-gray-400 hover:text-white hover:bg-slate-700 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  const connector = connectors[0];
                  if (connector) connect({ connector });
                }}
                disabled={isConnecting}
                className="flex items-center space-x-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-2 text-sm font-bold text-white hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/25 disabled:opacity-50"
              >
                {isConnecting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Wallet className="h-4 w-4" />
                )}
                <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
        active 
          ? 'text-white bg-white/10' 
          : 'text-gray-300 hover:text-white hover:bg-white/5'
      }`}
    >
      {label}
    </Link>
  );
}
