require('dotenv').config();
require('@nomicfoundation/hardhat-verify');
require('hardhat-gas-reporter');

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL || '';
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || '';
const BASE_RPC_URL = process.env.BASE_RPC_URL || '';
const BASESEPOLIA_RPC_URL = process.env.BASESEPOLIA_RPC_URL || '';
const PRIVATE_KEY = process.env.PRIVATE_KEY || '';
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || '';
const BASESCAN_API_KEY = process.env.BASESCAN_API_KEY || '';

module.exports = {
  solidity: {
    version: '0.8.20',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
      allowBlocksWithSameTimestamp: true,
      mining: {
        auto: true,
        interval: 0,
      },
    },
    localhost: {
      chainId: 31337,
      url: 'http://127.0.0.1:8545',
    },
    base: {
      chainId: 8453,
      url: BASE_RPC_URL,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      gasPrice: 1000000000,
    },
    baseSepolia: {
      chainId: 84532,
      url: BASESEPOLIA_RPC_URL,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
    sepolia: {
      chainId: 11155111,
      url: SEPOLIA_RPC_URL,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS === 'true',
    currency: 'USD',
    gasPrice: 100,
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },
  etherscan: {
    apiKey: {
      mainnet: ETHERSCAN_API_KEY,
      sepolia: ETHERSCAN_API_KEY,
      base: BASESCAN_API_KEY,
      baseSepolia: BASESCAN_API_KEY,
    },
    customChains: [
      {
        network: 'base',
        chainId: 8453,
        urls: {
          apiURL: 'https://api.basescan.org/api',
          browserURL: 'https://basescan.org',
        },
      },
      {
        network: 'baseSepolia',
        chainId: 84532,
        urls: {
          apiURL: 'https://api-sepolia.basescan.org/api',
          browserURL: 'https://sepolia.basescan.org',
        },
      },
    ],
  },
  sourcify: {
    enabled: false,
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
};
