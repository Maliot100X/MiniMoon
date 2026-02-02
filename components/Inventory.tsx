'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount } from 'wagmi';
import { Sparkles, AlertTriangle, CheckCircle, XCircle, Zap, ArrowUp, Hammer } from 'lucide-react';

interface InventoryItem {
  id: number;
  pokemonId: number;
  name: string;
  rarity: string;
  level: number;
  power: number;
  image: string;
  shiny: boolean;
  wins: number;
}

interface Item {
  id: string;
  name: string;
  type: 'material' | 'upgrade' | 'consumable';
  rarity: string;
  quantity: number;
  image: string;
  description: string;
  effect: string;
}

export default function Inventory({ showHeader = true }: { showHeader?: boolean }) {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<'pokemon' | 'items' | 'compose'>('pokemon');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState<InventoryItem | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [upgrading, setUpgrading] = useState(false);
  const [upgradeResult, setUpgradeResult] = useState<'success' | 'fail' | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    if (isConnected && address) {
      loadInventory();
    }
  }, [isConnected, address]);

  const loadInventory = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockInventory: InventoryItem[] = [
      { id: 1, pokemonId: 25, name: 'Pikachu', rarity: 'rare', level: 15, power: 1500, image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png', shiny: false, wins: 12 },
      { id: 2, pokemonId: 150, name: 'Mewtwo', rarity: 'mythic', level: 50, power: 10000, image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png', shiny: true, wins: 45 },
      { id: 3, pokemonId: 4, name: 'Charmander', rarity: 'common', level: 5, power: 200, image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png', shiny: false, wins: 3 },
      { id: 4, pokemonId: 7, name: 'Squirtle', rarity: 'uncommon', level: 12, power: 800, image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png', shiny: false, wins: 8 },
      { id: 5, pokemonId: 149, name: 'Dragonite', rarity: 'legendary', level: 45, power: 8500, image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/149.png', shiny: false, wins: 38 },
      { id: 6, pokemonId: 130, name: 'Gyarados', rarity: 'epic', level: 35, power: 5000, image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/130.png', shiny: false, wins: 28 },
    ];
    const mockItems: Item[] = [
      { id: 'stardust', name: 'Stardust', type: 'material', rarity: 'common', quantity: 150, image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/stardust.png', description: 'Basic upgrade material', effect: '+5% success' },
      { id: 'rarerare', name: 'Rare Candy', type: 'upgrade', rarity: 'rare', quantity: 25, image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/rare-candy.png', description: 'Instant level up', effect: '+1 Level' },
      { id: 'evstone', name: 'Evolution Stone', type: 'upgrade', rarity: 'epic', quantity: 8, image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/evolution-stone.png', description: 'Evolve to higher rarity', effect: 'Rarity +1' },
      { id: 'shard', name: 'Shiny Shard', type: 'material', rarity: 'legendary', quantity: 3, image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/shiny-charm.png', description: 'Rare crafting material', effect: '+15% success' },
      { id: 'megastone', name: 'Mega Stone', type: 'upgrade', rarity: 'mythic', quantity: 2, image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mega-ring.png', description: 'Unlock mega evolution', effect: 'Power x2' },
    ];
    setInventory(mockInventory);
    setItems(mockItems);
    setLoading(false);
  };

  const getRarityColor = (rarity: string) => {
    const colors: Record<string, string> = {
      common: 'from-gray-400 to-gray-600', uncommon: 'from-green-400 to-green-600',
      rare: 'from-blue-400 to-blue-600', epic: 'from-purple-400 to-purple-600',
      legendary: 'from-yellow-400 to-orange-500', mythic: 'from-pink-400 to-rose-600',
    };
    return colors[rarity] || colors.common;
  };

  const getRarityBorder = (rarity: string) => {
    const colors: Record<string, string> = {
      common: 'border-gray-400', uncommon: 'border-green-400',
      rare: 'border-blue-400', epic: 'border-purple-400',
      legendary: 'border-yellow-400', mythic: 'border-pink-400',
    };
    return colors[rarity] || 'border-gray-400';
  };

  const getRarityGlow = (rarity: string) => {
    const colors: Record<string, string> = {
      common: 'shadow-gray-400/50', uncommon: 'shadow-green-400/50',
      rare: 'shadow-blue-400/50', epic: 'shadow-purple-400/50',
      legendary: 'shadow-yellow-400/50', mythic: 'shadow-pink-400/50',
    };
    return colors[rarity] || 'shadow-gray-400/50';
  };

  const upgradePokemon = async () => {
    if (!selectedPokemon || !selectedItem) return;
    
    setUpgrading(true);
    setUpgradeResult(null);
    
    // Simulate upgrade animation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
// 70% success rate
    const success = Math.random() < 0.7;
    setUpgradeResult(success ? 'success' : 'fail');
    
    if (success) {
      setInventory(prev => prev.map(p => 
        p.id === selectedPokemon.id 
          ? { ...p, level: p.level + 1, power: Math.floor(p.power * 1.1) }
          : p
      ));
    }
    
    setUpgrading(false);
  };

  const composeItems = () => {
    if (selectedItems.length < 3) {
      alert('Select at least 3 items to compose');
      return;
    }
    
    // Simulate compose
    alert('Items composed! New item created.');
    setSelectedItems([]);
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl border border-slate-700/50">
        <div className="text-6xl mb-4">🎒</div>
        <h3 className="text-xl font-bold text-white mb-2">Connect Wallet</h3>
        <p className="text-slate-400 text-center">Connect to view inventory</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {showHeader && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Your Inventory</h2>
          <p className="text-slate-400 text-sm">View and upgrade your Pokemon, collect items</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-xl p-4 border border-blue-500/30">
          <div className="text-2xl mb-1">⚔️</div>
          <div className="text-2xl font-bold text-white">{inventory.length}</div>
          <div className="text-xs text-blue-300">Pokemon</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-xl p-4 border border-purple-500/30">
          <div className="text-2xl mb-1">⚡</div>
          <div className="text-2xl font-bold text-white">{inventory.reduce((sum, i) => sum + i.power, 0).toLocaleString()}</div>
          <div className="text-xs text-purple-300">Power</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 rounded-xl p-4 border border-yellow-500/30">
          <div className="text-2xl mb-1">🏆</div>
          <div className="text-2xl font-bold text-white">{inventory.reduce((sum, i) => sum + i.wins, 0)}</div>
          <div className="text-xs text-yellow-300">Wins</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-xl p-4 border border-green-500/30">
          <div className="text-2xl mb-1">🎒</div>
          <div className="text-2xl font-bold text-white">{items.reduce((sum, i) => sum + i.quantity, 0)}</div>
          <div className="text-xs text-green-300">Items</div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {[
          { id: 'pokemon', icon: '⚽', label: 'Pokemon' },
          { id: 'items', icon: '🎒', label: 'Items' },
          { id: 'compose', icon: '🔮', label: 'Compose' },
        ].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)} className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${activeTab === tab.id ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg' : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50'}`}>
            <span>{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && <div className="flex items-center justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div></div>}

      {/* Pokemon Grid */}
      {!loading && activeTab === 'pokemon' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence>
            {inventory.map((pokemon, index) => (
              <motion.div key={pokemon.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ delay: index * 0.05 }} onClick={() => setSelectedPokemon(pokemon)} className={`relative bg-gradient-to-br ${getRarityColor(pokemon.rarity)} rounded-2xl p-4 cursor-pointer transform hover:scale-105 transition-all shadow-lg border-2 ${getRarityBorder(pokemon.rarity)}`}>
                {pokemon.shiny && <div className="absolute -top-2 -right-2 text-xl animate-pulse">✨</div>}
                <div className="relative w-20 h-20 mx-auto mb-3">
                  <Image src={pokemon.image} alt={pokemon.name} fill className="object-contain drop-shadow-lg" />
                </div>
                <h3 className="text-white font-bold text-center text-sm mb-1">{pokemon.name}</h3>
                <div className="flex justify-center gap-1 mb-2">
                  <span className="px-2 py-0.5 bg-black/30 rounded text-xs text-white font-medium capitalize">{pokemon.rarity}</span>
                  <span className="px-2 py-0.5 bg-black/30 rounded text-xs text-white">Lv.{pokemon.level}</span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <div className="text-center bg-black/20 rounded py-1"><div className="text-yellow-300">{pokemon.power.toLocaleString()}</div><div className="text-slate-300 text-[10px]">POWER</div></div>
                  <div className="text-center bg-black/20 rounded py-1"><div className="text-green-300">{pokemon.wins}</div><div className="text-slate-300 text-[10px]">WINS</div></div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Items Grid */}
      {!loading && activeTab === 'items' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {items.map((item) => (
            <motion.div key={item.id} onClick={() => setSelectedItem(item)} className={`relative bg-gradient-to-br ${getRarityColor(item.rarity)} rounded-2xl p-4 cursor-pointer transform hover:scale-105 transition-all shadow-lg border-2 ${getRarityBorder(item.rarity)} ${getRarityGlow(item.rarity)}`}>
              <div className="relative w-16 h-16 mx-auto mb-3">
                <Image src={item.image} alt={item.name} fill className="object-contain" />
              </div>
              <h3 className="text-white font-bold text-center text-sm mb-1">{item.name}</h3>
              <div className="flex justify-center gap-1 mb-2">
                <span className="px-2 py-0.5 bg-black/30 rounded text-xs text-white capitalize">{item.rarity}</span>
                <span className="px-2 py-0.5 bg-black/30 rounded text-xs text-white">x{item.quantity}</span>
              </div>
              <p className="text-xs text-center text-slate-300">{item.effect}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Compose Grid */}
      {!loading && activeTab === 'compose' && (
        <div className="space-y-6">
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-white/5">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-400" />
              Compose Rarity Items
            </h3>
            <p className="text-sm text-gray-400 mb-4">Select 3+ items to compose into higher rarity items. 70% success rate!</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
              {items.map((item) => (
                <motion.div key={item.id} onClick={() => toggleItemSelection(item.id)} className={`relative rounded-xl p-3 cursor-pointer transition-all border-2 ${selectedItems.includes(item.id) ? 'border-purple-500 bg-purple-500/10' : 'border-white/10 bg-slate-700/50 hover:border-white/30'}`}>
                  <div className="flex items-center gap-2">
                    <div className="relative w-10 h-10">
                      <Image src={item.image} alt={item.name} fill className="object-contain" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-bold">{item.name}</p>
                      <p className="text-gray-400 text-xs">x{item.quantity}</p>
                    </div>
                  </div>
                  {selectedItems.includes(item.id) && (
                    <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-purple-500 flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-white" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            <button onClick={composeItems} disabled={selectedItems.length < 3} className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <Hammer className="h-5 w-5" />
              Compose ({selectedItems.length}/3 minimum)
            </button>
          </div>
        </div>
      )}

      {/* Pokemon Modal */}
      <AnimatePresence>
        {selectedPokemon && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => { setSelectedPokemon(null); setUpgradeResult(null); }}>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className={`bg-gradient-to-br ${getRarityColor(selectedPokemon.rarity)} rounded-3xl p-6 max-w-md w-full border-4 ${getRarityBorder(selectedPokemon.rarity)}`} onClick={(e) => e.stopPropagation()}>
              {/* Upgrade Result Overlay */}
              {upgrading && (
                <div className="absolute inset-0 bg-black/80 rounded-3xl flex flex-col items-center justify-center z-10">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500 mb-4"></div>
                  <p className="text-white font-bold">Upgrading...</p>
                </div>
              )}
              
              {upgradeResult && !upgrading && (
                <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="absolute inset-0 rounded-3xl flex flex-col items-center justify-center z-10 bg-black/80">
                  {upgradeResult === 'success' ? (
                    <>
                      <CheckCircle className="h-20 w-20 text-green-400 mb-4" />
                      <p className="text-2xl font-bold text-green-400 mb-2">Upgrade Success!</p>
                      <p className="text-white">+1 Level, +10% Power</p>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-20 w-20 text-red-400 mb-4" />
                      <p className="text-2xl font-bold text-red-400 mb-2">Upgrade Failed!</p>
                      <p className="text-white">No changes</p>
                    </>
                  )}
                  <button onClick={() => setUpgradeResult(null)} className="mt-4 px-6 py-2 rounded-xl bg-slate-700 text-white font-bold">Close</button>
                </motion.div>
              )}

              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedPokemon.name}</h2>
                  <div className="flex gap-2 mt-1">
                    <span className="px-3 py-1 bg-black/30 rounded-full text-sm text-white capitalize">{selectedPokemon.rarity}</span>
                    {selectedPokemon.shiny && <span className="px-3 py-1 bg-yellow-500/50 rounded-full text-sm text-white">✨ Shiny</span>}
                  </div>
                </div>
                <button onClick={() => { setSelectedPokemon(null); setUpgradeResult(null); }} className="p-2 bg-black/30 rounded-full text-white hover:bg-black/50">✕</button>
              </div>
              <div className="relative w-40 h-40 mx-auto mb-6">
                <Image src={selectedPokemon.image} alt={selectedPokemon.name} fill className="object-contain drop-shadow-2xl" />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-black/30 rounded-xl p-4 text-center"><div className="text-3xl font-bold text-white">{selectedPokemon.level}</div><div className="text-sm text-slate-300">Level</div></div>
                <div className="bg-black/30 rounded-xl p-4 text-center"><div className="text-3xl font-bold text-yellow-400">{selectedPokemon.power.toLocaleString()}</div><div className="text-sm text-slate-300">Power</div></div>
                <div className="bg-black/30 rounded-xl p-4 text-center"><div className="text-3xl font-bold text-green-400">{selectedPokemon.wins}</div><div className="text-sm text-slate-300">Wins</div></div>
                <div className="bg-black/30 rounded-xl p-4 text-center"><div className="text-3xl font-bold text-blue-400">#{selectedPokemon.pokemonId}</div><div className="text-sm text-slate-300">Pokedex</div></div>
              </div>

              {/* Upgrade Section */}
              <div className="bg-black/20 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-bold flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-400" />
                    Upgrade Pokemon
                  </span>
                  <span className="text-amber-400 text-sm">70% Success Rate</span>
                </div>
                <p className="text-xs text-gray-400 mb-3">Select an item from your inventory to upgrade this Pokemon</p>
                
                {selectedItem ? (
                  <div className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <div className="relative w-10 h-10">
                        <Image src={selectedItem.image} alt={selectedItem.name} fill className="object-contain" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-bold">{selectedItem.name}</p>
                        <p className="text-gray-400 text-xs">{selectedItem.effect}</p>
                      </div>
                    </div>
                    <button onClick={() => setSelectedItem(null)} className="text-gray-400 hover:text-white">✕</button>
                  </div>
                ) : (
                  <button onClick={() => setActiveTab('items')} className="w-full py-2 rounded-lg bg-slate-700/50 text-gray-400 text-sm hover:bg-slate-700">
                    Select Item from Inventory
                  </button>
                )}
              </div>

              <div className="flex gap-2">
                <button className="flex-1 py-3 bg-white/20 hover:bg-white/30 rounded-xl font-bold text-white">⚔️ Battle</button>
                <button onClick={upgradePokemon} disabled={!selectedItem || upgrading} className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 font-bold text-white rounded-xl disabled:opacity-50 flex items-center justify-center gap-2">
                  <ArrowUp className="h-5 w-5" />
                  Upgrade
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
