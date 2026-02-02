'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http, cookieStorage, createStorage } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { useState, useEffect } from 'react';

// Optional WalletConnect project ID - works without it for basic functionality
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '';

const metadata = {
  name: 'MiniMoon',
  description: 'Meta Trading Game on Base Chain',
  url: 'https://minimoon.game',
  icons: ['/icon.svg'],
};

const chains = [base, baseSepolia] as const;

export const wagmiConfig = createConfig({
  chains,
  transports: {
    [base.id]: http(process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org'),
    [baseSepolia.id]: http(process.env.NEXT_PUBLIC_BASESCAN_RPC_URL || 'https://sepolia.base.org'),
  },
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
});

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  }));

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Only initialize Web3Modal if projectId is available
    if (projectId && typeof window !== 'undefined') {
      import('@web3modal/wagmi/react').then(({ createWeb3Modal }) => {
        createWeb3Modal({
          wagmiConfig,
          projectId,
          chains,
          metadata,
          enableAnalytics: true,
          themeMode: 'dark',
          themeVariables: {
            '--w3m-color-primary': '#f59e0b',
            '--w3m-color-accent': '#ec4899',
            '--w3m-font-family': 'Inter, sans-serif',
            '--w3m-border-radius': '12px',
          },
        });
      });
    }
  }, []);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
