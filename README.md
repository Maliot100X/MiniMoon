# MiniMoon - Meta Trading Game

<div align="center">

<!-- SVG Logo -->
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="moonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#fbbf24;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#f59e0b;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#b45309;stop-opacity:1" />
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <circle cx="100" cy="100" r="90" fill="url(#moonGradient)" filter="url(#glow)"/>
  <circle cx="70" cy="80" r="15" fill="#b45309" opacity="0.3"/>
  <circle cx="130" cy="120" r="20" fill="#b45309" opacity="0.3"/>
  <circle cx="85" cy="140" r="10" fill="#b45309" opacity="0.2"/>
  <text x="100" y="125" font-family="Arial Black, sans-serif" font-size="80" font-weight="bold" fill="white" text-anchor="middle" filter="url(#glow)">M</text>
  <polygon points="160,30 163,38 172,38 165,44 168,52 160,47 152,52 155,44 148,38 157,38" fill="#fbbf24"/>
  <polygon points="40,170 42,175 47,175 43,178 45,183 40,180 35,183 37,178 33,175 38,175" fill="#fbbf24"/>
</svg>

**Collect. Battle. Conquer.**

A Pokemon-style Meta Trading Game built on Base Chain with blockchain integration.

[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Base](https://img.shields.io/badge/Chain-Base-blue.svg)](https://base.org)
[![Next.js](https://img.shields.io/badge/Framework-Next.js-black.svg)](https://nextjs.org/)
[![Web3](https://img.shields.io/badge/Web3-Wagmi-8B5CF6.svg)](https://wagmi.sh/)
[![Farcaster](https://img.shields.io/badge/Farcaster-Mini%20App-purple.svg)](https://farcaster.xyz/)
[![MiniApp](https://img.shields.io/badge/Base-Mini%20App-blue.svg)](https://base.org/mini-apps)

</div>

---

## 🎮 About MiniMoon

MiniMoon is an immersive Meta Trading Game where players collect, battle, and trade mythical creatures on the Base blockchain. Inspired by games like Clankermon and Pokemon, MiniMoon brings true ownership and play-to-earn mechanics to the monster-collecting genre.

### ✨ Features

| Feature | Description |
|---------|-------------|
| 🐉 **Monster Collection** | Collect 100+ Pokemon-style monsters with 6 rarity tiers |
| ⚔️ **Epic Battles** | Challenge dungeons + Arena PvP battles against other players |
| 💰 **Play to Earn** | Earn $MNMOON tokens through victories, quests, and marketplace |
| 🏪 **Trading Marketplace** | Buy, sell, and trade monsters with real prices |
| 📅 **Quest System** | Daily and weekly quests with exclusive rewards |
| 🏆 **Rankings** | Real-time global leaderboards and seasonal rankings |
| 💀 **Permadeath Mode** | True roguelike experience with permanent consequences |
| ⏰ **AFK Arena** | Passive farming with real-time drops and auto-battles |
| 🌟 **Subscription** | Premium membership with exclusive perks ($1/24h or $20/month) |

### 🎯 Rarity Tiers

| Rarity | Drop Rate | Base Power | Special |
|--------|-----------|------------|---------|
| 🟢 Common | 50% | 10 | Basic monster |
| 🔵 Uncommon | 25% | 25 | Uncommon variant |
| 🟣 Rare | 15% | 50 | Rare variant |
| 🟣 Epic | 7% | 100 | Epic glow effect |
| 🟡 Legendary | 2.5% | 250 | Golden aura |
| 🔴 Mythic | 0.5% | 500 | Pulsing animation + special skills |

---

## 🎰 Compatible Platforms

| Platform | Status | Features |
|----------|--------|----------|
| �� **Web App** | ✅ Live | Full game experience |
| 📱 **Farcaster Mini App** | ✅ Ready | Frame integration, FID sync |
| 📱 **Base Mini App** | ✅ Ready | Native Base wallet support |
| 📱 **Mobile Web** | ✅ Ready | Responsive design |

---

## 🏗️ Architecture

```
MiniMoon/
├── app/                    # Next.js 14 App Router
│   ├── dungeons/          # Dungeon exploration
│   ├── arena/             # PvP battles against players
│   ├── afk/               # AFK farming arena
│   ├── quests/            # Quest tracking
│   ├── marketplace/       # Trading marketplace
│   ├── shop/              # Character items shop
│   ├── profile/           # User profile & customization
│   ├── rankings/          # Global leaderboards
│   ├── subscription/      # Premium membership
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   └── providers.tsx      # Web3 providers (Wagmi + FarCaster)
├── components/            # React components
│   ├── MonsterCard.tsx    # Monster display card
│   ├── Navigation.tsx     # Navigation bar
│   ├── BattleArena.tsx    # PvP battle system
│   ├── AFKFarming.tsx     # AFK arena component
│   ├── RankingsBoard.tsx  # Leaderboard display
│   ├── SubscriptionModal.tsx # Premium membership
│   └── ShopCard.tsx       # Shop item display
├── contracts/             # Solidity smart contracts
│   ├── MonsterNFT.sol     # ERC721 NFT contract
│   ├── MiniMoonToken.sol  # ERC20 token contract
│   ├── MiniMoonGame.sol   # Core game logic
│   └── Subscription.sol   # Subscription management
├── abis/                  # Contract ABIs
├── lib/                   # Utilities & constants
│   ├── gameData.ts        # Game configuration
│   ├── farcaster.ts       # FarCaster integration
│   └── rankings.ts        # Rankings logic
├── store/                 # Zustand state management
├── scripts/               # Deployment scripts
├── hardhat.config.ts      # Hardhat configuration
└── package.json           # Dependencies
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MetaMask, Coinbase Wallet, or FarCaster app
- Base wallet (for Base Mini App)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Maliot100X/MiniMoon.git
   cd MiniMoon
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables (optional for testing)**
   ```bash
   cp .env.example .env
   ```
   
   The app works without env vars for testing! Add them later:
   ```env
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_walletconnect_id
   NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
   FARCASTER_API_KEY=your_farcaster_api_key
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open the game**
   Navigate to [http://localhost:3000](http://localhost:3000)

### FarCaster Mini App
Deploy to Vercel, then add to your FarCaster frame:
- URL: `https://your-app.vercel.app/farcaster`
- Actions: `challenge`, `battle`, `trade`

### Base Mini App
Access via Base Mini App browser:
- URL: `https://your-app.vercel.app/base`
- Features: Native wallet sync, FID auto-connect

---

## ⛓️ Smart Contract Deployment

### Compile Contracts
```bash
npm run compile
```

### Deploy to Base Sepolia (Testnet)
```bash
npm run deploy:testnet
```

### Deploy to Base (Mainnet)
```bash
npm run deploy:mainnet
```

### Verify Contracts
```bash
npx hardhat verify --network base <contract_address>
```

---

## 🎮 Game Features

### 🏰 Dungeons

| Dungeon | Energy | Min Power | Win Rate | Rewards |
|---------|--------|-----------|----------|---------|
| 🌱 Training Grounds | 10 | 0 | 90% | 100-500 $MNMOON |
| 🌲 Forest of Beginnings | 15 | 50 | 80% | 250-1,000 $MNMOON |
| 💎 Crystal Cave | 25 | 150 | 65% | 500-2,500 $MNMOON |
| 🌋 Volcanic Crater | 40 | 400 | 50% | 1,500-5,000 $MNMOON |
| 🌑 Shadow Realm | 75 | 1,000 | 30% | 5,000-20,000 $MNMOON |

**How Dungeons Work:**
1. 💥 Select a dungeon to enter
2. 🦸 Choose a monster from your collection
3. ⚔️ Monster fights automatically based on power level
4. 🏆 Win: Earn $MNMOON tokens and experience
5. 💀 Lose: Monster takes damage, reduced rewards

### ⚔️ Arena PvP Battles

Challenge other players in real-time battles!

- 🎯 Ranked matches with ELO system
- 🏆 Weekly tournaments with big prizes
- 💰 Entry fee: 50 $MNMOON
- 🎁 Winner takes 90% of pool

### ⏰ AFK Arena

Passive farming with real-time drops!

- 🤖 Auto-battle system
- 💎 Real-time loot drops every hour
- 📦 Guaranteed mythic drop every 100 hours
- ⚡ Works even when offline!

### 📅 Quest System

| Quest Type | Rewards | Reset |
|------------|---------|-------|
| Daily Quests | 25-500 $MNMOON + EXP | Every 24h |
| Weekly Quests | 500-5,000 $MNMOON + EXP | Every 7 days |
| Achievements | One-time rewards | Permanent |

### 💎 Subscription System

| Plan | Price | Benefits |
|------|-------|----------|
| 🕐 24-Hour Pass | $1 | 2x rewards, exclusive items, premium effects |
| 🌟 Monthly Premium | $20 | All 24h benefits + VIP rankings + exclusive shop items |

**Premium Benefits:**
- ✨ Exclusive monster variants with special effects
- 🏆 VIP badge on leaderboard
- 🎁 Monthly mystery box
- ⚡ Faster energy regeneration
- 💰 2x token rewards

---

## 🐉 Monster Collection

### Generation 1 Pokemon-Style Monsters

**🔥 Fire Type**
- 🔥 Charmander → Charmeleon → Charizard
- 🦎 Bulbasaur → Ivysaur → Venusaur
- 🔥 Cyndaquil → Quilava → Typhlosion

**💧 Water Type**
- 💧 Squirtle → Wartortle → Blastoise
- 💧 Mudkip → Marshtomp → Swampert
- 🌊 Totodile → Croconaw → Feraligatr

**⚡ Electric Type**
- ⚡ Pichu → Pikachu → Raichu
- ⚡ Elekid → Electabuzz → Electivire
- 🔌 Mareep → Flaaffy → Ampharos

**🌿 Grass Type**
- 🌿 Chikorita → Bayleef → Meganium
- 🍃 Treecko → Grovyle → Sceptile
-🌻 Seedot → Nuzleaf → Shiftry

**❄️ Ice Type**
- ❄️ Snorunt → Glalie / Froslass
- 🐺 Cubchoo → Beartic
- ❄️ Spheal → Sealeo → Walrein

**👊 Fighting Type**
- 👊 Machop → Machoke → Machamp
- 🥊 Hitmonlee / Hitmonchan / Hitmontop
- 🦍 Grookey → Thwackey → Rillaboom

**👻 Ghost Type**
- 👻 Gastly → Haunter → Gengar
- 💀 Misdreavus → Mismagius
- 🦇 Yamask → Cofagrigus

**🐲 Dragon Type**
- 🐲 Dratini → Dragonair → Dragonite
- 🐉 Bagon → Shelgon → Salamence
- 🌊 Gible → Gabite → Kyurem

**⭐ Fairy Type**
- ⭐ Ralts → Kirlia → Gardevoir / Gallade
- 🧚 Jigglypuff → Wigglytuff
- 🌸 Clefairy → Clefable

**🌑 Dark Type**
- 🌑 Umbreon → Darkrai
- 🦇 Purrloin → Liepard
- 🌑 Inkay → Malamar

**🦅 Flying Type**
- 🦅 Pidgey → Pidgeotto → Pidgeot
- 🪶 Fletchling → Fletchinder → Talonflame
- 🦅 Swablu → Altaria

**☠️ Poison Type**
- ☠️ Ekans → Arbok
- 🐛 Caterpie → Metapod → Butterfree
- ☠️ Zubat → Golbat → Crobat

**🪨 Rock Type**
- 🪨 Geodude → Graveler → Golem
- 🦴 Aron → Lairon → Aggron
- 🪨 Roggenrola → Boldore → Gigalith

**🐛 Bug Type**
- 🐛 Weedle → Kakuna → Beedrill
- 🐝 Pinsir → Scizor
- 🦋 Wurmple → Silcoon → Beautifly

**⚙️ Steel Type**
- ⚙️ Magnemite → Magneton → Magnezone
- 🦴 Steelix → Mawile
- ⚙️ Solrock → Lunatone

---

## 🏆 Rankings & Leaderboards

### Global Rankings

| Rank | Player | Monsters | Total Power | Wins |
|------|--------|----------|-------------|------|
| 🥇 #1 | Champion | 42 | 52,450 | 1,247 |
| 🥈 #2 | DragonMaster | 38 | 48,200 | 1,089 |
| 🥉 #3 | PokemonPro | 35 | 44,800 | 956 |
| 4 | BattleKing | 31 | 41,200 | 847 |
| 5 | NFTCollector | 28 | 38,500 | 723 |

### Arena Rankings (ELO)

| Rank | Player | ELO | Win/Loss |
|------|--------|-----|----------|
| 🥇 #1 | ArenaLegend | 2,450 | 245/23 |
| 🥈 #2 | PvPMaster | 2,280 | 198/31 |
| 🥉 #3 | BattlePro | 2,150 | 187/42 |
| 4 | FighterKing | 2,020 | 156/38 |
| 5 | ChampNewbie | 1,890 | 142/45 |

### Weekly Tournament

**🔥 Fire Cup** - Currently Active!
- 📅 Ends: Sunday, 23:59 UTC
- 🎁 Prize Pool: 50,000 $MNMOON
- 🏆 Top 10 earn exclusive rewards

---

## 💰 Economy

### Tokenomics

| Metric | Value |
|--------|-------|
| Total Supply | 1,000,000,000 $MNMOON |
| Initial Mint | 100,000,000 $MNMOON |
| Game Rewards | 500,000,000 $MNMOON |
| Staking Rewards | 200,000,000 $MNMOON |
| Team Reserve | 100,000,000 $MNMOON |
| Community Treasury | 100,000,000 $MNMOON |

### Marketplace Prices (Real USD)

| Monster | Common | Uncommon | Rare | Epic | Legendary | Mythic |
|---------|--------|----------|------|------|-----------|--------|
| Fire Type | $2 | $5 | $15 | $50 | $200 | $1,000 |
| Water Type | $2 | $5 | $15 | $50 | $200 | $1,000 |
| Electric Type | $2 | $5 | $15 | $50 | $200 | $1,000 |
| Dragon Type | $10 | $25 | $75 | $250 | $1,000 | $5,000 |
| Mythic Any | - | - | - | - | - | $10,000 |

---

## 👤 Profile & Customization

### Profile Features

- 🖼️ **Avatar** - Custom character or monster avatar
- 🎨 **Background** - Unlockable profile backgrounds
- 🏅 **Badges** - Achievement badges (100+ unlockables)
- 📊 **Stats** - Win/loss ratio, total earnings, battles
- 🎯 **Favorite Monster** - Showcase your best monster
- 💬 **Bio** - Custom bio text
- 🔗 **Social Links** - Twitter, Warpcast, website

### Shop Items

| Item | Price | Effect |
|------|-------|--------|
| 🎨 Avatar Pack 1 | 500 $MNMOON | 10 new avatars |
| 🌈 Rainbow Background | 1,000 $MNMOON | Profile glow effect |
| 👑 Crown Badge | 5,000 $MNMOON | VIP status symbol |
| 🔥 Fire Aura | 2,500 $MNMOON | Battle effects |
| 💎 Diamond Shield | 2,500 $MNMOON | Profile frame |
| ⭐ Star Particles | 1,500 $MNMOON | Always-visible effects |

---

## 💻 Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | Next.js 14, React 18, TypeScript |
| Styling | Tailwind CSS, Framer Motion |
| State Management | Zustand |
| Web3 | Wagmi, Viem, WalletConnect, FarCaster SDK |
| Smart Contracts | Solidity, Hardhat, OpenZeppelin |
| Testing | Hardhat Tests, Foundry |
| Deployment | Vercel, Base |
| Analytics | PostHog, WalletConnect Analytics |

---

## 📱 FarCaster Integration

### Mini App Features

- ✅ **FID Auto-Sync** - Automatically connect using FarCaster FID
- 👤 **Profile Sync** - Use FarCaster username and avatar
- 💬 **Cast Integration** - Share achievements to Warpcast
- 🎁 **Farcaster Points** - Earn points for engagement
- 🏆 **Frame Rankings** - Show leaderboard in frames

### Setup

```typescript
import { useFarcaster } from '@farcaster/auth-react';

// In your component
const { connect, user } = useFarcaster();

if (user) {
  console.log('Connected:', user.displayName);
  console.log('FID:', user.fid);
}
```

---

## 📦 Contract Addresses

After deployment, contract addresses will be:

| Contract | Address |
|----------|---------|
| MonsterNFT | `0x...` |
| MiniMoonToken | `0x...` |
| MiniMoonGame | `0x...` |
| Subscription | `0x...` |

Update `.env` with these addresses for frontend integration.

---

## 🔧 API Reference

### Monster Data

```typescript
interface Monster {
  tokenId: number;
  name: string;
  type: 'fire' | 'water' | 'electric' | 'grass' | 'ice' | 'fighting' | 'ghost' | 'dragon' | 'fairy' | 'dark' | 'flying' | 'poison' | 'rock' | 'bug' | 'steel' | 'normal';
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
  power: number;
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  speed: number;
  level: number;
  experience: number;
  isAlive: boolean;
  owner: string;
}
```

### Battle Result

```typescript
interface BattleResult {
  winner: string;
  loser: string;
  winnerPower: number;
  loserPower: number;
  reward: number;
  expGained: number;
  timestamp: number;
}
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- 🔵 [Base](https://base.org) - Ethereum L2 blockchain
- 🔐 [OpenZeppelin](https://openzeppelin.com) - Smart contract security
- ⚛️ [Wagmi](https://wagmi.sh) - React hooks for Ethereum
- 🎮 [Clankermon](https://clankermon.com) - Inspiration for game mechanics
- 📱 [FarCaster](https://farcaster.xyz) - Decentralized social protocol
- 🎯 [Pokemon](https://pokemon.com) - Monster collection inspiration

---

## 💼 Sponsored By

<div align="center">

### 🏛️ Infrastructure & Investment

| Paradigm | Ithaca | Stripe | zkSync | Linea | Gemini |
|:---:|:---:|:---:|:---:|:---:|:---:|
| 💰 | 💼 | 💳 | ⛓️ | 🟣 | 👑 |

---

### 🏢 Enterprise Partners

| Large Enterprises | Small Enterprises | Context | Family |
|:---:|:---:|:---:|:---:|
| 🏢 | 🏪 | 📊 | 👨‍👩‍👧‍👦 |

---

### 🔧 Development & Tools

| WalletConnect | PartyDAO | SushiSwap | Dynamic | Privy |
|:---:|:---:|:---:|:---:|:---:|
| 🔗 | 🎉 | 🍣 | 🎯 | 🔐 |

| PancakeSwap | Celo | Rainbow | Pimlico | Zora |
|:---:|:---:|:---:|:---:|:---:|
| 🥞 | 🌱 | 🌈 | 💎 | 🎨 |

| Lattice | Supa | Syndicate | Reservoir | Uniswap |
|:---:|:---:|:---:|:---:|:---:|
| 🕸️ | 🚀 | 🤝 | 📦 | 🦄 |

| Biconomy | Thirdweb | Polymarket | Sequence | Routescan |
|:---:|:---:|:---:|:---:|:---:|
| ⚡ | 🎯 | 📊 | 📱 | 🔍 |

---

## 🚀 New Features (v2.0)

### 💼 User Inventory System
- View all Pokemon/winnings in one place
- Filter by rarity (Common → Mythic)
- See power levels, wins, and statistics
- Quick actions: Battle, Upgrade, Sell
- Shiny indicator for rare finds

### 🔗 Wallet Connection Modes
- **Auto Mode**: Automatic detection for Base Mini App context
- **Manual Mode**: User decides when to connect with real Base holdings
- Chain indicator showing current network (Base ETH)
- Seamless switching between modes

### 🪙 Real $MNMOON Token Integration
- Native integration with Streme.fun
- Token contract: `0x184f03750171f9eF32B6267271a7FEE59cb5F387`
- Real-time price and market data
- Staking rewards with APY up to 50%
- Portfolio value tracking

### 🏆 Real Prize System
**Weekly Power Rankings:**
| Place | Prize |
|-------|-------|
| 🥇 1st | $50 USDC |
| 🥈 2nd | $25 USDC |
| 🥉 3rd | Free Hatch + 1 Mythic + 24h Premium |

**Task Rewards Pool:**
- Weekly 50,000 $MNMOON rewards pool
- Top 3 weekly task completers get bonus rewards

### ⏱️ Real-Time Features
- Auto-refresh rankings every 30 seconds
- Countdown timer for next refresh
- Manual refresh option
- User search by wallet address, FID, or FarCaster name
- Instant search results

### 🎮 Floating Mini Moon Bot
- AI-powered assistant with context awareness
- Shows real-time user stats (power, tokens, monsters, wins)
- Quick actions: Check Balance, Battle Stats, My Rank, Daily Rewards
- Smart responses about game mechanics

### 📊 Real Holdings Display
- Native Base ETH balance
- $MNMOON token balance from chain
- Total portfolio value
- Quick links to Basescan for verification
- Real-time price updates

### ✨ Rarity Effects
Each Pokemon rarity has unique visual effects:
- **Common**: Standard glow
- **Uncommon**: Green shimmer
- **Rare**: Blue aura
- **Epic**: Purple energy
- **Legendary**: Golden radiating effect
- **Mythic**: Pulsing pink/red animation with particle effects

### 📤 Auto-Share Score
- One-click share to FarCaster with proper URL (https://mini-moon-ten.vercel.app)
- Twitter/X sharing with preview
- Copy score to clipboard
- Tag @maliotsol automatically
- Verification for completed shares

### 📅 24-Hour Task Refresh
- Tasks reset every 24 hours
- Countdown timer showing next refresh
- Prevent double collection
- Progressive rewards for streaks

---

### 🤝 Want to Sponsor?

<a href="mailto:sponsors@minimoon.game" style="display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #f59e0b, #ec4899); color: white; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px;">
  💼 Become a Sponsor
</a>

---

**Thank you to all our sponsors for supporting the MiniMoon ecosystem!**

</div>

---

<div align="center">

**Built with ❤️ on Base**

**Compatible with FarCaster Mini App & Base Mini App**

🚀 Deploy Now: [Vercel](https://vercel.com) | 📱 FarCaster | 📱 Base Mini App

</div>
