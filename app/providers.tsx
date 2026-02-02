'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http, cookieStorage, createStorage } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { useState, useEffect } from 'react';

// Get project ID from env, or use empty string (Web3Modal will work in limited mode)
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '';

const metadata = {
  name: 'MiniMoon',
  description: 'Pokemon Meta Trading Game on Base Chain',
  url: 'https://mini-moon-ten.vercel.app',
  icons: ['/icon.svg'],
};

const chains = [base, baseSepolia] as const;

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 5000, refetchOnWindowFocus: false },
        },
      })
  );

  const [wagmiConfig, setWagmiConfig] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Create Wagmi config with default RPC URLs (works without env keys)
      const config = createConfig({
        chains,
        transports: {
          [base.id]: http('https://mainnet.base.org'),
          [baseSepolia.id]: http('https://sepolia.base.org'),
        },
        ssr: true,
        storage: createStorage({ storage: cookieStorage }),
      });

      setWagmiConfig(config);

      // Initialize Web3Modal only if projectId exists
      if (projectId) {
        import('@web3modal/wagmi/react').then(({ createWeb3Modal }) => {
          createWeb3Modal({
            wagmiConfig: config,
            projectId,
            metadata,
            enableAnalytics: true,
            themeMode: 'dark',
            themeVariables: {
              '--w3m-color-primary': '#f59e0b',
              '--w3m-color-accent': '#ec4899',
              '--w3m-color-mix-strength': 60,
              '--w3m-font-family': 'Inter, sans-serif',
              '--w3m-border-radius': 12,
            } as any,
          });
        });
      }

      // Call FarCaster SDK ready() to hide splash screen
      // @ts-ignore - Neynar SDK may not be installed
      if (window.sdk && window.sdk.actions) {
        // @ts-ignore
        window.sdk.actions.ready();
      }
    }
  }, []);

  // Show loading state while initializing
  if (!wagmiConfig) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading MiniMoon...</p>
        </div>
      </div>
    );
  }

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
