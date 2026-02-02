# MiniMoon - Meta Trading Game

<div align="center">

![MiniMoon Logo](https://via.placeholder.com/200x200/f59e0b/ffffff?text=M)

**Collect. Battle. Conquer.**

A Pokemon-style Meta Trading Game built on Base Chain with blockchain integration.

[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Base](https://img.shields.io/badge/Chain-Base-blue.svg)](https://base.org)
[![Next.js](https://img.shields.io/badge/Framework-Next.js-black.svg)](https://nextjs.org/)

</div>

---

## 🎮 About MiniMoon

MiniMoon is an immersive Meta Trading Game where players collect, battle, and trade mythical creatures on the Base blockchain. Inspired by games like Clankermon and Pokemon, MiniMoon brings true ownership and play-to-earn mechanics to the monster-collecting genre.

### ✨ Features

| Feature | Description |
|---------|-------------|
| 🐉 **Monster Collection** | Collect 6 rarity tiers of unique monsters with varying stats |
| ⚔️ **Epic Battles** | Challenge dungeons with strategic combat |
| 💰 **Play to Earn** | Earn $MNMOON tokens through victories and quests |
| 🏪 **Trading Marketplace** | Buy, sell, and trade monsters with other players |
| 📅 **Quest System** | Daily and weekly quests with exclusive rewards |
| 💀 **Permadeath Mode** | True roguelike experience with permanent consequences |

### 🎯 Rarity Tiers

| Rarity | Drop Rate | Base Power | Special |
|--------|-----------|------------|---------|
| 🟢 Common | 50% | 10 | - |
| 🔵 Uncommon | 25% | 25 | - |
| 🟣 Rare | 15% | 50 | - |
| 🟣 Epic | 7% | 100 | - |
| 🟡 Legendary | 2.5% | 250 | Glowing aura |
| 🔴 Mythic | 0.5% | 500 | Pulsing animation |

---

## 🏗️ Architecture

```
MiniMoon/
├── app/                    # Next.js 14 App Router
│   ├── dungeons/          # Dungeon exploration page
│   ├── quests/            # Quest tracking page
│   ├── marketplace/       # Trading marketplace
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   └── providers.tsx      # Web3 providers
├── components/            # React components
│   ├── MonsterCard.tsx    # Monster display card
│   └── Navigation.tsx     # Navigation bar
├── contracts/             # Solidity smart contracts
│   ├── MonsterNFT.sol     # ERC721 NFT contract
│   ├── MiniMoonToken.sol  # ERC20 token contract
│   └── MiniMoonGame.sol   # Core game logic
├── abis/                  # Contract ABIs
├── lib/                   # Utilities & constants
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
- MetaMask or compatible wallet

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

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in the required values:
   ```env
   # Network URLs
   BASE_RPC_URL=https://mainnet.base.org
   BASESEPOLIA_RPC_URL=https://sepolia.base.org
   
   # Wallet Private Key (for deployments)
   PRIVATE_KEY=your_private_key_here
   
   # API Keys
   BASESCAN_API_KEY=your_basescan_api_key
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_walletconnect_id
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open the game**
   Navigate to [http://localhost:3000](http://localhost:3000)

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

## 🎮 Game Mechanics

### Energy System
- Each action costs energy
- Energy regenerates at 5 points per hour
- Maximum energy: 100

### Dungeon Difficulty

| Dungeon | Energy | Min Power | Win Rate | Rewards |
|---------|--------|-----------|----------|---------|
| Training Grounds | 10 | 0 | 90% | 100-500 $MNMOON |
| Forest of Beginnings | 15 | 50 | 80% | 250-1,000 $MNMOON |
| Crystal Cave | 25 | 150 | 65% | 500-2,500 $MNMOON |
| Volcanic Crater | 40 | 400 | 50% | 1,500-5,000 $MNMOON |
| Shadow Realm | 75 | 1,000 | 30% | 5,000-20,000 $MNMOON |

### Battle System
1. Select a dungeon to enter
2. Choose a monster from your collection
3. Monster fights automatically based on power level
4. Win: Earn $MNMOON tokens and experience
5. Lose: Monster takes damage, reduced rewards

---

## 💻 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **State Management**: Zustand
- **Web3**: Wagmi, Viem, WalletConnect
- **Smart Contracts**: Solidity, Hardhat
- **Testing**: Hardhat Tests
- **Deployment**: Vercel, Base

---

## 📦 Contract Addresses

After deployment, contract addresses will be:

| Contract | Address |
|----------|---------|
| MonsterNFT | `0x...` |
| MiniMoonToken | `0x...` |
| MiniMoonGame | `0x...` |

Update `.env` with these addresses for frontend integration.

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

- [Base](https://base.org) - Ethereum L2 blockchain
- [OpenZeppelin](https://openzeppelin.com) - Smart contract security
- [Wagmi](https://wagmi.sh) - React hooks for Ethereum
- [Clankermon](https://clankermon.com) - Inspiration for the game mechanics

---

<div align="center">

**Built with ❤️ on Base**

</div>
