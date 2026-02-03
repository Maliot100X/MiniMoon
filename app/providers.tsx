'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http, cookieStorage, createStorage } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { useState, useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

// Get project ID from env, or use empty string (Web3Modal will work in limited mode)
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '';

const metadata = {
  name: 'MiniMoon',
  description: 'Pokemon Meta Trading Game on Base Chain',
  url: 'https://mini-moon-ten.vercel.app',
  icons: ['/icon.svg'],
};

const chains = [base, baseSepolia] as const;

// Base Account connector for Base Mini App support
const baseAccountConnector = {
  id: 'baseAccount',
  name: 'Base Account',
  async connect({ chainId }: { chainId?: number } = {}) {
    // This will be provided by the Base Account SDK in browser context
    if (typeof window !== 'undefined' && (window as any).baseAccountProvider) {
      const provider = (window as any).baseAccountProvider;
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      return {
        accounts,
        chainId: chainId || base.id,
      };
    }
    // Fallback for non-Base Mini App browsers
    throw new Error('Base Account not available. Please open in Base app.');
  },
  async disconnect() {
    // Handle disconnect
  },
  async getAccounts() {
    if (typeof window !== 'undefined' && (window as any).baseAccountProvider) {
      const provider = (window as any).baseAccountProvider;
      return provider.request({ method: 'eth_accounts' });
    }
    return [];
  },
  async getChainId() {
    return base.id;
  },
  async getProvider() {
    if (typeof window !== 'undefined') {
      return (window as any).baseAccountProvider;
    }
  },
  async switchChain(chainId: number) {
    // Handle chain switching
  },
  onAccountsChanged(accounts: string[]) {
    // Handle account changes
  },
  onChainChanged(chainId: string) {
    // Handle chain changes
  },
  onDisconnect() {
    // Handle disconnect
  },
};

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
  const [miniAppContext, setMiniAppContext] = useState<any>(null);
  const [isInMiniApp, setIsInMiniApp] = useState(false);

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

      // Initialize FarCaster SDK and check if running in mini app
      const initFarCaster = async () => {
        try {
          const inMiniApp = await sdk.isInMiniApp();
          setIsInMiniApp(inMiniApp);

          if (inMiniApp) {
            // Get the context which contains user info
            const context = await sdk.context;
            setMiniAppContext(context);

            // Call ready() to hide splash screen
            if (sdk.actions) {
              sdk.actions.ready();
            }
          }
        } catch (error) {
          console.log('FarCaster SDK not available:', error);
        }
      };

      initFarCaster();
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
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
