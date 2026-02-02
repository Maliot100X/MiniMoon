'use client';

import { useAccount, useDisconnect, useConnect, useBalance } from 'wagmi';
import { Loader2, Wallet, LogOut, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export function Navigation() {
  const { address, isConnected, isConnecting } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect, connectors } = useConnect();
  const [copied, setCopied] = useState(false);

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

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/80 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
          <div className="hidden md:flex items-center space-x-1">
            <NavLink href="/dungeons">Dungeons</NavLink>
            <NavLink href="/quests">Quests</NavLink>
            <NavLink href="/marketplace">Marketplace</NavLink>
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

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
    >
      {children}
    </Link>
  );
}
