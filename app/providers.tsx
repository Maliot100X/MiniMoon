'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { http, cookieStorage, createStorage } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { useState, useEffect } from 'react';

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '';

const metadata = {
  name: 'MiniMoon',
  description: 'Meta Trading Game on Base Chain',
  url: 'https://minimoon.game',
  icons: ['https://avatars.mywebsite.com/'],
};

const chains = [base, baseSepolia] as const;

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  }));

  const [wagmiConfig] = useState(() => {
    const config = {
      chains,
      transports: {
        [base.id]: http(),
        [baseSepolia.id]: http(),
      },
      ssr: true,
      storage: createStorage({
        storage: cookieStorage,
      }),
    };
    return config;
  });

  useEffect(() => {
    if (projectId) {
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
    }
  }, [wagmiConfig, projectId]);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
