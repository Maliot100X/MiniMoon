import type { Metadata } from 'next';
import { Inter, Roboto_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Navigation } from '@/components/Navigation';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
});

export const metadata: Metadata = {
  title: 'MiniMoon - Meta Trading Game',
  description: 'Collect, battle, and trade monsters on Base Chain. A Pokemon-style meta trading game with blockchain integration.',
  keywords: ['MiniMoon', 'Meta Trading Game', 'Base Chain', 'Pokemon', 'NFT', 'Web3', 'Gaming'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${robotoMono.variable} font-sans antialiased`}>
        <Providers>
          <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
            <Navigation />
            <main>{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
