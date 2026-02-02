// app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Inter, Roboto_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Navigation } from '@/components/Navigation';
import { FloatingBot } from '@/components/FloatingBot';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
});

// Server component metadata – ✅ allowed
export const metadata: Metadata = {
  metadataBase: new URL('https://mini-moon-ten.vercel.app'),
  title: 'MiniMoon - Pokemon Meta Trading Game',
  description: 'Collect, battle, and trade Pokemon-style monsters on Base Chain. Play on FarCaster Mini App!',
  keywords: ['MiniMoon', 'Meta Trading Game', 'Base Chain', 'Pokemon', 'NFT', 'Web3', 'Gaming'],
  // Base Mini App Verification and FarCaster Frame/Mini App Metadata
  other: {
    'base:app_id': '6980b7dbc6a03f3fe39cb88a',
    'fc:frame': 'vNext',
    'fc:frame:image': 'https://mini-moon-ten.vercel.app/og-image.png',
    'fc:frame:image:aspect_ratio': '1:1',
    'fc:frame:post_url': 'https://mini-moon-ten.vercel.app/api/frame',
    // Fallback frame buttons (required for frame validation)
    'fc:frame:button:1': 'Play MiniMoon',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': 'https://mini-moon-ten.vercel.app',
    'fc:frame:button:2': 'Battle Arena',
    'fc:frame:button:2:action': 'link',
    'fc:frame:button:2:target': 'https://mini-moon-ten.vercel.app/arena',
    'fc:frame:button:3': 'Marketplace',
    'fc:frame:button:3:action': 'link',
    'fc:frame:button:3:target': 'https://mini-moon-ten.vercel.app/marketplace',
    'fc:frame:button:4': 'My Profile',
    'fc:frame:button:4:action': 'link',
    'fc:frame:button:4:target': 'https://mini-moon-ten.vercel.app/profile',
  },
  // Open Graph for sharing
  openGraph: {
    title: 'MiniMoon - Pokemon Meta Trading Game',
    description: 'Collect, battle, and trade Pokemon-style monsters on Base Chain',
    type: 'website',
    siteName: 'MiniMoon',
    images: [
      {
        url: 'https://mini-moon-ten.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MiniMoon Game',
      },
    ],
  },
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'MiniMoon - Pokemon Meta Trading Game',
    description: 'Collect, battle, and trade Pokemon-style monsters on Base Chain',
    images: ['https://mini-moon-ten.vercel.app/og-image.png'],
    creator: '@minimoon',
  },
};

// Viewport for proper mobile/Mini App rendering
export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Base Mini App Verification */}
        <meta name="base:app_id" content="6980b7dbc6a03f3fe39cb88a" />
      </head>
      <body
        className={`${inter.variable} ${robotoMono.variable} font-sans antialiased`}
      >
        <Providers>
          <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
            <Navigation />
            <main>{children}</main>
            <FloatingBot />
          </div>
        </Providers>
      </body>
    </html>
  );
}
