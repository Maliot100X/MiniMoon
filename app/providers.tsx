'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http, cookieStorage, createStorage } from 'wagmi';
import { createWeb3Modal } from '@web3modal/wagmi/react';
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

export const wagmiConfig = createConfig({
  chains,
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
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

  useEffect(() => {
    if (projectId && typeof window !== 'undefined') {
      createWeb3Modal({
        wagmiConfig,
        projectId,
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
