'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount } from 'wagmi';

// Pokemon marketplace listings with prices in $MNMOON based on rarity
const marketplacePokemon = [
  // Mythic Pokemon - Highest prices
  { id: 150, name: 'Mewtwo', type: 'psychic', rarity: 'Mythic', power: 10000, price: 500000, seller: 'PokemonMaster', level: 50 },
  { id: 149, name: 'Dragonite', type: 'dragon', rarity: 'Mythic', power: 9500, price: 450000, seller: 'DragonKing', level: 48 },
  { id: 145, name: 'Zapdos', type: 'electric', rarity: 'Mythic', power: 9800, price: 480000, seller: 'BirdCatcher', level: 50 },
  { id: 146, name: 'Moltres', type: 'fire', rarity: 'Mythic', power: 9700, price: 470000, seller: 'FireLord', level: 50 },
  { id: 144, name: 'Articuno', type: 'ice', rarity: 'Mythic', power: 9600, price: 460000, seller: 'IceKing', level: 50 },
  
  // Legendary Pokemon - High prices
  { id: 384, name: 'Rayquaza', type: 'dragon', rarity: 'Legendary', power: 8500, price: 350000, seller: 'SkyDiver', level: 45 },
  { id: 383, name: 'Groudon', type: 'ground', rarity: 'Legendary', power: 8400, price: 340000, seller: 'EarthShaker', level: 45 },
  { id: 382, name: 'Kyogre', type: 'water', rarity: 'Legendary', power: 8300, price: 330000, seller: 'OceanMaster', level: 45 },
  { id: 380, name: 'Latias', type: 'dragon', rarity: 'Legendary', power: 8200, price: 320000, seller: 'DragonRider', level: 44 },
  { id: 379, name: 'Latios', type: 'dragon', rarity: 'Legendary', power: 8200, price: 320000, seller: 'DragonRider', level: 44 },
  { id: 243, name: 'Raikou', type: 'electric', rarity: 'Legendary', power: 8100, price: 310000, seller: 'ThunderGod', level: 43 },
  { id: 244, name: 'Entei', type: 'fire', rarity: 'Legendary', power: 8100, price: 310000, seller: 'FlameGod', level: 43 },
  { id: 245, name: 'Suicune', type: 'water', rarity: 'Legendary', power: 8000, price: 300000, seller: 'WaterSpirit', level: 43 },
  { id: 251, name: 'Celebi', type: 'psychic', rarity: 'Legendary', power: 8900, price: 380000, seller: 'TimeWalker', level: 46 },

  // Epic Pokemon - Medium-high prices
  { id: 6, name: 'Charizard', type: 'fire', rarity: 'Epic', power: 6000, price: 150000, seller: 'FireTrainer', level: 36 },
  { id: 9, name: 'Blastoise', type: 'water', rarity: 'Epic', power: 5800, price: 140000, seller: 'WaterTrainer', level: 36 },
  { id: 65, name: 'Alakazam', type: 'psychic', rarity: 'Epic', power: 5900, price: 145000, seller: 'MindReader', level: 35 },
  { id: 94, name: 'Gengar', type: 'ghost', rarity: 'Epic', power: 5700, price: 135000, seller: 'GhostHunter', level: 34 },
  { id: 130, name: 'Gyarados', type: 'water', rarity: 'Epic', power: 5600, price: 130000, seller: 'SeaSerpent', level: 33 },
  { id: 143, name: 'Snorlax', type: 'normal', rarity: 'Epic', power: 5500, price: 125000, seller: 'SleepyBear', level: 32 },
  { id: 181, name: 'Ampharos', type: 'electric', rarity: 'Epic', power: 5400, price: 120000, seller: 'LightBulb', level: 31 },
  { id: 214, name: 'Heracross', type: 'fighting', rarity: 'Epic', power: 5300, price: 115000, seller: 'HornHunter', level: 30 },
  { id: 230, name: 'Kingdra', type: 'dragon', rarity: 'Epic', power: 5900, price: 148000, seller: 'DragonBreeder', level: 35 },
  { id: 257, name: 'Blaziken', type: 'fire', rarity: 'Epic', power: 6100, price: 155000, seller: 'FireFighter', level: 37 },
  { id: 260, name: 'Swampert', type: 'water', rarity: 'Epic', power: 6000, price: 150000, seller: 'MudSmasher', level: 36 },
  { id: 282, name: 'Gardevoir', type: 'psychic', rarity: 'Epic', power: 5800, price: 142000, seller: 'Guardian', level: 35 },
  { id: 310, name: 'Manectric', type: 'electric', rarity: 'Epic', power: 5500, price: 128000, seller: 'ThunderBolt', level: 32 },
  { id: 319, name: 'Sharpedo', type: 'water', rarity: 'Epic', power: 5400, price: 122000, seller: 'DeepSea', level: 31 },
  { id: 323, name: 'Camerupt', type: 'fire', rarity: 'Epic', power: 5300, price: 118000, seller: 'Volcano', level: 30 },
  { id: 334, name: 'Altaria', type: 'dragon', rarity: 'Epic', power: 5200, price: 115000, seller: 'CloudDragon', level: 29 },
  { id: 350, name: 'Milotic', type: 'water', rarity: 'Epic', power: 5800, price: 140000, seller: 'Beauty', level: 34 },
  { id: 358, name: 'Absol', type: 'dark', rarity: 'Epic', power: 5600, price: 132000, seller: 'Disaster', level: 33 },
  { id: 373, name: 'Salamence', type: 'dragon', rarity: 'Epic', power: 6500, price: 175000, seller: 'DragonFly', level: 40 },
  { id: 376, name: 'Metagross', type: 'psychic', rarity: 'Epic', power: 6200, price: 160000, seller: 'MeteorBrain', level: 38 },
  { id: 384, name: 'Rayquaza', type: 'dragon', rarity: 'Epic', power: 6500, price: 170000, seller: 'SkyGod', level: 39 },

  // Rare Pokemon - Medium prices
  { id: 3, name: 'Venusaur', type: 'grass', rarity: 'Rare', power: 3500, price: 50000, seller: 'PlantMaster', level: 25 },
  { id: 5, name: 'Charmeleon', type: 'fire', rarity: 'Rare', power: 3400, price: 48000, seller: 'FireGrower', level: 24 },
  { id: 8, name: 'Wartortle', type: 'water', rarity: 'Rare', power: 3300, price: 46000, seller: 'TurtleKing', level: 23 },
  { id: 17, name: 'Pidgeot', type: 'flying', rarity: 'Rare', power: 3200, price: 44000, seller: 'BirdWatcher', level: 22 },
  { id: 18, name: 'Pidgeot', type: 'flying', rarity: 'Rare', power: 3200, price: 44000, seller: 'SkyHunter', level: 22 },
  { id: 24, name: 'Arbok', type: 'poison', rarity: 'Rare', power: 3100, price: 42000, seller: 'SnakeCharmer', level: 21 },
  { id: 38, name: 'Ninetales', type: 'fire', rarity: 'Rare', power: 3400, price: 47000, seller: 'FoxSpirit', level: 24 },
  { id: 51, name: 'Dugtrio', type: 'ground', rarity: 'Rare', power: 3000, price: 40000, seller: 'EarthDigger', level: 20 },
  { id: 53, name: 'Persian', type: 'normal', rarity: 'Rare', power: 2900, price: 38000, seller: 'CatLover', level: 19 },
  { id: 62, name: 'Poliwrath', type: 'water', rarity: 'Rare', power: 3500, price: 49000, seller: 'FistWater', level: 25 },
  { id: 68, name: 'Machamp', type: 'fighting', rarity: 'Rare', power: 3600, price: 52000, seller: 'FistMaster', level: 26 },
  { id: 71, name: 'Victreebel', type: 'grass', rarity: 'Rare', power: 3300, price: 45000, seller: 'PlantEater', level: 23 },
  { id: 76, name: 'Golem', type: 'ground', rarity: 'Rare', power: 3400, price: 48000, seller: 'RockBreaker', level: 24 },
  { id: 78, name: 'Rapidash', type: 'fire', rarity: 'Rare', power: 3500, price: 50000, seller: 'HorseRider', level: 25 },
  { id: 89, name: 'Muk', type: 'poison', rarity: 'Rare', power: 3200, price: 43000, seller: 'Sludge', level: 22 },
  { id: 91, name: 'Cloyster', type: 'water', rarity: 'Rare', power: 3700, price: 54000, seller: 'ShellBreaker', level: 27 },
  { id: 103, name: 'Exeggutor', type: 'grass', rarity: 'Rare', power: 3200, price: 44000, seller: 'TreeHead', level: 22 },
  { id: 110, name: 'Weezing', type: 'poison', rarity: 'Rare', power: 3000, price: 39000, seller: 'GasBag', level: 20 },
  { id: 112, name: 'Rhydon', type: 'ground', rarity: 'Rare', power: 3400, price: 47000, seller: 'HornRock', level: 24 },
  { id: 113, name: 'Chansey', type: 'normal', rarity: 'Rare', power: 3800, price: 58000, seller: 'EggGiver', level: 28 },
  { id: 121, name: 'Starmie', type: 'water', rarity: 'Rare', power: 3500, price: 51000, seller: 'StarFish', level: 26 },
  { id: 122, name: 'MrMime', type: 'psychic', rarity: 'Rare', power: 3600, price: 53000, seller: 'MimeMaster', level: 27 },
  { id: 124, name: 'Jynx', type: 'ice', rarity: 'Rare', power: 3400, price: 48000, seller: 'IceDancer', level: 24 },
  { id: 125, name: 'Electabuzz', type: 'electric', rarity: 'Rare', power: 3500, price: 50000, seller: 'Electrician', level: 25 },
  { id: 126, name: 'Magmar', type: 'fire', rarity: 'Rare', power: 3500, price: 50000, seller: 'FireBreath', level: 25 },
  { id: 127, name: 'Pinsir', type: 'bug', rarity: 'Rare', power: 3300, price: 45000, seller: 'HornBug', level: 23 },
  { id: 128, name: 'Tauros', type: 'normal', rarity: 'Rare', power: 3200, price: 42000, seller: 'BullRider', level: 21 },
  { id: 131, name: 'Lapras', type: 'water', rarity: 'Rare', power: 3700, price: 55000, seller: 'WaterTaxi', level: 27 },
  { id: 132, name: 'Ditto', type: 'normal', rarity: 'Rare', power: 3000, price: 40000, seller: 'ShapeShifter', level: 20 },
  { id: 135, name: 'Jolteon', type: 'electric', rarity: 'Rare', power: 3500, price: 50000, seller: 'SpikeDog', level: 25 },
  { id: 136, name: 'Flareon', type: 'fire', rarity: 'Rare', power: 3500, price: 50000, seller: 'FluffyDog', level: 25 },
  { id: 142, name: 'Aerodactyl', type: 'rock', rarity: 'Rare', power: 3600, price: 52000, seller: 'AncientOne', level: 26 },
  { id: 150, name: 'Mewtwo', type: 'psychic', rarity: 'Rare', power: 3800, price: 58000, seller: 'CloneMaster', level: 28 },
  { id: 154, name: 'Meganium', type: 'grass', rarity: 'Rare', power: 3400, price: 46000, seller: 'FlowerKing', level: 23 },
  { id: 156, name: 'Typhlosion', type: 'fire', rarity: 'Rare', power: 3500, price: 48000, seller: 'Explosion', level: 24 },
  { id: 158, name: 'Feraligatr', type: 'water', rarity: 'Rare', power: 3400, price: 46000, seller: 'BigJaw', level: 23 },
  { id: 160, name: 'Furret', type: 'normal', rarity: 'Rare', power: 2800, price: 35000, seller: 'LongBody', level: 18 },
  { id: 162, name: 'Furret', type: 'normal', rarity: 'Rare', power: 2800, price: 35000, seller: 'Stretchy', level: 18 },
  { id: 164, name: 'Noctowl', type: 'flying', rarity: 'Rare', power: 3100, price: 40000, seller: 'NightOwl', level: 20 },
  { id: 169, name: 'Crobat', type: 'poison', rarity: 'Rare', power: 3300, price: 44000, seller: 'NightWing', level: 22 },
  { id: 172, name: 'Pichu', type: 'electric', rarity: 'Rare', power: 2500, price: 28000, seller: 'TinySpark', level: 15 },
  { id: 173, name: 'Cleffa', type: 'fairy', rarity: 'Rare', power: 2400, price: 26000, seller: 'StarBaby', level: 14 },
  { id: 174, name: 'Igglybuff', type: 'normal', rarity: 'Rare', power: 2300, price: 24000, seller: 'PinkPuff', level: 13 },
  { id: 175, name: 'Togepi', type: 'fairy', rarity: 'Rare', power: 2600, price: 30000, seller: 'LuckyCharm', level: 16 },
  { id: 176, name: 'Togetic', type: 'fairy', rarity: 'Rare', power: 3000, price: 38000, seller: 'WingAngel', level: 19 },
  { id: 177, name: 'Natu', type: 'psychic', rarity: 'Rare', power: 2700, price: 32000, seller: 'LittleBird', level: 17 },
  { id: 178, name: 'Xatu', type: 'psychic', rarity: 'Rare', power: 3200, price: 42000, seller: 'MysticBird', level: 21 },
  { id: 185, name: 'Sudowoodo', type: 'rock', rarity: 'Rare', power: 3100, price: 39000, seller: 'FakeTree', level: 20 },
  { id: 186, name: 'Politoed', type: 'water', rarity: 'Rare', power: 3300, price: 44000, seller: 'FrogKing', level: 22 },
  { id: 187, name: 'Hoppip', type: 'grass', rarity: 'Rare', power: 2200, price: 22000, seller: 'Dandelion', level: 12 },
  { id: 188, name: 'Skiploom', type: 'grass', rarity: 'Rare', power: 2400, price: 26000, seller: 'FlowerHop', level: 14 },
  { id: 189, name: 'Jumpluff', type: 'grass', rarity: 'Rare', power: 2800, price: 34000, seller: 'CottonBall', level: 18 },
  { id: 190, name: 'Aipom', type: 'normal', rarity: 'Rare', power: 2600, price: 30000, seller: 'TailHand', level: 16 },
  { id: 191, name: 'Sunkern', type: 'grass', rarity: 'Rare', power: 1800, price: 15000, seller: 'TinySeed', level: 9 },
  { id: 192, name: 'Sunflora', type: 'grass', rarity: 'Rare', power: 3000, price: 38000, seller: 'SunFlower', level: 19 },
  { id: 193, name: 'Yanma', type: 'bug', rarity: 'Rare', power: 2800, price: 34000, seller: 'WideWing', level: 18 },
  { id: 194, name: 'Wooper', type: 'water', rarity: 'Rare', power: 2400, price: 26000, seller: 'MudFish', level: 14 },
  { id: 195, name: 'Quagsire', type: 'water', rarity: 'Rare', power: 3100, price: 40000, seller: 'Muddy', level: 21 },
  { id: 196, name: 'Espeon', type: 'psychic', rarity: 'Rare', power: 3500, price: 50000, seller: 'SunDog', level: 25 },
  { id: 197, name: 'Umbreon', type: 'dark', rarity: 'Rare', power: 3400, price: 47000, seller: 'MoonDog', level: 24 },
  { id: 198, name: 'Murkrow', type: 'dark', rarity: 'Rare', power: 2900, price: 36000, seller: 'NightCrow', level: 19 },
  { id: 199, name: 'Slowking', type: 'water', rarity: 'Rare', power: 3300, price: 44000, seller: 'SmartBrain', level: 22 },
  { id: 200, name: 'Misdreavus', type: 'ghost', rarity: 'Rare', power: 3000, price: 38000, seller: 'Tricky', level: 19 },
  { id: 201, name: 'Unown', type: 'psychic', rarity: 'Rare', power: 2800, price: 34000, seller: 'Mystery', level: 18 },
  { id: 202, name: 'Wobbuffet', type: 'psychic', rarity: 'Rare', power: 2600, price: 30000, seller: 'BlueBlob', level: 16 },
  { id: 203, name: 'Girafarig', type: 'psychic', rarity: 'Rare', power: 3000, price: 38000, seller: 'LongNeck', level: 19 },
  { id: 204, name: 'Pineco', type: 'bug', rarity: 'Rare', power: 2400, price: 26000, seller: 'PineCone', level: 14 },
  { id: 205, name: 'Forretress', type: 'bug', rarity: 'Rare', power: 3000, price: 40000, seller: 'Cocoon', level: 21 },
  { id: 206, name: 'Dunsparce', type: 'normal', rarity: 'Rare', power: 2600, price: 30000, seller: 'Serpent', level: 16 },
  { id: 207, name: 'Gligar', type: 'ground', rarity: 'Rare', power: 2900, price: 36000, seller: 'Scorpion', level: 19 },
  { id: 208, name: 'Steelix', type: 'steel', rarity: 'Rare', power: 3200, price: 42000, seller: 'IronSnake', level: 21 },
  { id: 209, name: 'Snubbull', type: 'fairy', rarity: 'Rare', power: 2500, price: 28000, seller: 'PinkBulldog', level: 15 },
  { id: 210, name: 'Granbull', type: 'fairy', rarity: 'Rare', power: 3100, price: 40000, seller: 'BigBulldog', level: 21 },
  { id: 211, name: 'Qwilfish', type: 'water', rarity: 'Rare', power: 2800, price: 34000, seller: 'FishSpine', level: 18 },
  { id: 212, name: 'Scizor', type: 'bug', rarity: 'Rare', power: 3400, price: 47000, seller: 'PinchBug', level: 24 },
  { id: 213, name: 'Shuckle', type: 'bug', rarity: 'Rare', power: 2500, price: 28000, seller: 'ShellBug', level: 15 },
  { id: 215, name: 'Sneasel', type: 'dark', rarity: 'Rare', power: 3000, price: 38000, seller: 'ClawCat', level: 19 },
  { id: 217, name: 'Ursaring', type: 'normal', rarity: 'Rare', power: 3400, price: 47000, seller: 'BigBear', level: 24 },
  { id: 218, name: 'Slugma', type: 'fire', rarity: 'Rare', power: 2200, price: 22000, seller: 'MagmaBlob', level: 12 },
  { id: 219, name: 'Magcargo', type: 'fire', rarity: 'Rare', power: 2800, price: 34000, seller: 'SnailFire', level: 18 },
  { id: 220, name: 'Swinub', type: 'ice', rarity: 'Rare', power: 2400, price: 26000, seller: 'PigNose', level: 14 },
  { id: 221, name: 'Piloswine', type: 'ice', rarity: 'Rare', power: 3100, price: 40000, seller: 'BigPig', level: 21 },
  { id: 222, name: 'Corsola', type: 'water', rarity: 'Rare', power: 2800, price: 34000, seller: 'Coral', level: 18 },
  { id: 223, name: 'Remoraid', type: 'water', rarity: 'Rare', power: 2500, price: 28000, seller: 'SquirtGun', level: 15 },
  { id: 224, name: 'Octillery', type: 'water', rarity: 'Rare', power: 3200, price: 42000, seller: 'EightLegs', level: 21 },
  { id: 225, name: 'Delibird', type: 'ice', rarity: 'Rare', power: 2800, price: 34000, seller: 'GiftBird', level: 18 },
  { id: 226, name: 'Mantine', type: 'water', rarity: 'Rare', power: 3000, price: 38000, seller: 'SkyFish', level: 19 },
  { id: 227, name: 'Skarmory', type: 'steel', rarity: 'Rare', power: 3100, price: 40000, seller: 'ArmorBird', level: 20 },
  { id: 228, name: 'Houndour', type: 'dark', rarity: 'Rare', power: 2700, price: 32000, seller: 'DarkPup', level: 17 },
  { id: 229, name: 'Houndoom', type: 'dark', rarity: 'Rare', power: 3300, price: 44000, seller: 'DarkDog', level: 22 },
  { id: 231, name: 'Phanpy', type: 'ground', rarity: 'Rare', power: 2400, price: 26000, seller: 'BabyElephant', level: 14 },
  { id: 232, name: 'Donphan', type: 'ground', rarity: 'Rare', power: 3400, price: 47000, seller: 'BigElephant', level: 24 },
  { id: 233, name: 'Porygon2', type: 'normal', rarity: 'Rare', power: 3200, price: 42000, seller: 'Virtual2', level: 21 },
  { id: 234, name: 'Stantler', type: 'normal', rarity: 'Rare', power: 3000, price: 38000, seller: 'DeerKing', level: 19 },
  { id: 235, name: 'Smeargle', type: 'normal', rarity: 'Rare', power: 2600, price: 30000, seller: 'PaintDog', level: 16 },
  { id: 236, name: 'Tyrogue', type: 'fighting', rarity: 'Rare', power: 2400, price: 26000, seller: 'BabyFighter', level: 14 },
  { id: 237, name: 'Hitmontop', type: 'fighting', rarity: 'Rare', power: 3200, price: 42000, seller: 'SpinKick', level: 21 },
  { id: 238, name: 'Smoochum', type: 'ice', rarity: 'Rare', power: 2700, price: 32000, seller: 'BabyKiss', level: 17 },
  { id: 239, name: 'Elekid', type: 'electric', rarity: 'Rare', power: 2600, price: 30000, seller: 'BabyVolt', level: 16 },
  { id: 240, name: 'Magby', type: 'fire', rarity: 'Rare', power: 2600, price: 30000, seller: 'BabyFire', level: 16 },
  { id: 241, name: 'Miltank', type: 'normal', rarity: 'Rare', power: 3300, price: 44000, seller: 'MilkCow', level: 22 },
  { id: 242, name: 'Blissey', type: 'normal', rarity: 'Rare', power: 4000, price: 65000, seller: 'Happiness', level: 30 },
  { id: 252, name: 'Treecko', type: 'grass', rarity: 'Rare', power: 2600, price: 30000, seller: 'Lizard', level: 16 },
  { id: 253, name: 'Grovyle', type: 'grass', rarity: 'Rare', power: 3000, price: 38000, seller: 'Forest', level: 19 },
  { id: 254, name: 'Sceptile', type: 'grass', rarity: 'Rare', power: 3400, price: 47000, seller: 'Jungle', level: 24 },
  { id: 255, name: 'Torchic', type: 'fire', rarity: 'Rare', power: 2500, price: 28000, seller: 'Chick', level: 15 },
  { id: 256, name: 'Combusken', type: 'fire', rarity: 'Rare', power: 2900, price: 36000, seller: 'Flame', level: 19 },
  { id: 258, name: 'Mudkip', type: 'water', rarity: 'Rare', power: 2500, price: 28000, seller: 'Seal', level: 15 },
  { id: 259, name: 'Marshtomp', type: 'water', rarity: 'Rare', power: 2900, price: 36000, seller: 'Swamp', level: 19 },
  { id: 261, name: 'Poochyena', type: 'dark', rarity: 'Rare', power: 2200, price: 22000, seller: 'ShadowDog', level: 12 },
  { id: 262, name: 'Mightyena', type: 'dark', rarity: 'Rare', power: 2800, price: 34000, seller: 'ShadowPack', level: 18 },
  { id: 263, name: 'Zigzagoon', type: 'normal', rarity: 'Rare', power: 2100, price: 20000, seller: 'Zigzag', level: 11 },
  { id: 264, name: 'Linoone', type: 'normal', rarity: 'Rare', power: 2600, price: 30000, seller: 'Rusher', level: 16 },
  { id: 265, name: 'Wurmple', type: 'bug', rarity: 'Rare', power: 1800, price: 15000, seller: 'Caterpillar', level: 9 },
  { id: 266, name: 'Silcoon', type: 'bug', rarity: 'Rare', power: 2200, price: 22000, seller: 'CocoonBug', level: 12 },
  { id: 267, name: 'Beautifly', type: 'bug', rarity: 'Rare', power: 2800, price: 34000, seller: 'Butterfly', level: 18 },
  { id: 268, name: 'Cascoon', type: 'bug', rarity: 'Rare', power: 2200, price: 22000, seller: 'SleepCocoon', level: 12 },
  { id: 269, name: 'Dustox', type: 'bug', rarity: 'Rare', power: 2600, price: 30000, seller: 'Moth', level: 16 },
  { id: 270, name: 'Lotad', type: 'water', rarity: 'Rare', power: 2000, price: 18000, seller: 'LilyPad', level: 10 },
  { id: 271, name: 'Lombre', type: 'water', rarity: 'Rare', power: 2400, price: 26000, seller: 'Jolly', level: 14 },
  { id: 272, name: 'Ludicolo', type: 'water', rarity: 'Rare', power: 3100, price: 40000, seller: 'Dancer', level: 21 },
  { id: 273, name: 'Seedot', type: 'grass', rarity: 'Rare', power: 2000, price: 18000, seller: 'Acorn', level: 10 },
  { id: 274, name: 'Nuzleaf', type: 'grass', rarity: 'Rare', power: 2400, price: 26000, seller: 'LeafMask', level: 14 },
  { id: 275, name: 'Shiftry', type: 'grass', rarity: 'Rare', power: 3000, price: 38000, seller: 'FanLeaf', level: 19 },
  { id: 276, name: 'Taillow', type: 'flying', rarity: 'Rare', power: 2300, price: 24000, seller: 'BirdSmall', level: 13 },
  { id: 277, name: 'Swellow', type: 'flying', rarity: 'Rare', power: 2900, price: 36000, seller: 'BirdFast', level: 19 },
  { id: 278, name: 'Wingull', type: 'water', rarity: 'Rare', power: 2200, price: 22000, seller: 'SeaGull', level: 12 },
  { id: 279, name: 'Pelipper', type: 'water', rarity: 'Rare', power: 2900, price: 36000, seller: 'BirdBoat', level: 19 },
  { id: 280, name: 'Ralts', type: 'psychic', rarity: 'Rare', power: 2000, price: 18000, seller: 'Child', level: 10 },
  { id: 281, name: 'Kirlia', type: 'psychic', rarity: 'Rare', power: 2500, price: 28000, seller: 'Dancer', level: 15 },
  { id: 283, name: 'Surskit', type: 'bug', rarity: 'Rare', power: 2200, price: 22000, seller: 'PondSkater', level: 12 },
  { id: 284, name: 'Masquerain', type: 'bug', rarity: 'Rare', power: 2800, price: 34000, seller: 'EyeBug', level: 18 },
  { id: 285, name: 'Shroomish', type: 'grass', rarity: 'Rare', power: 2200, price: 22000, seller: 'Mushroom', level: 12 },
  { id: 286, name: 'Breloom', type: 'grass', rarity: 'Rare', power: 3200, price: 42000, seller: 'MushroomFist', level: 21 },
  { id: 287, name: 'Slakoth', type: 'normal', rarity: 'Rare', power: 2200, price: 22000, seller: 'Lazy', level: 12 },
  { id: 288, name: 'Vigoroth', type: 'normal', rarity: 'Rare', power: 2700, price: 32000, seller: 'Active', level: 17 },
  { id: 289, name: 'Slaking', type: 'normal', rarity: 'Rare', power: 4000, price: 65000, seller: 'Strongest', level: 30 },
  { id: 290, name: 'Nincada', type: 'bug', rarity: 'Rare', power: 2000, price: 18000, seller: 'Driller', level: 10 },
  { id: 291, name: 'Ninjask', type: 'bug', rarity: 'Rare', power: 3100, price: 40000, seller: 'Ninja', level: 21 },
  { id: 292, name: 'Shedinja', type: 'bug', rarity: 'Rare', power: 2800, price: 34000, seller: 'GhostBug', level: 18 },
  { id: 293, name: 'Whismur', type: 'normal', rarity: 'Rare', power: 2200, price: 22000, seller: 'Loud', level: 12 },
  { id: 294, name: 'Loudred', type: 'normal', rarity: 'Rare', power: 2700, price: 32000, seller: 'Louder', level: 17 },
  { id: 295, name: 'Exploud', type: 'normal', rarity: 'Rare', power: 3400, price: 47000, seller: 'Loudest', level: 24 },
  { id: 296, name: 'Makuhita', type: 'fighting', rarity: 'Rare', power: 2300, price: 24000, seller: 'FighterKid', level: 13 },
  { id: 297, name: 'Hariyama', type: 'fighting', rarity: 'Rare', power: 3300, price: 44000, seller: 'BigFighter', level: 22 },
  { id: 298, name: 'Azurill', type: 'normal', rarity: 'Rare', power: 2000, price: 18000, seller: 'BlueBall', level: 10 },
  { id: 299, name: 'Nosepass', type: 'rock', rarity: 'Rare', power: 2600, price: 30000, seller: 'Compass', level: 16 },
  { id: 300, name: 'Skitty', type: 'normal', rarity: 'Rare', power: 2300, price: 24000, seller: 'Kitten', level: 13 },
  { id: 301, name: 'Delcatty', type: 'normal', rarity: 'Rare', power: 2700, price: 32000, seller: 'Kitty', level: 17 },
  { id: 302, name: 'Sableye', type: 'dark', rarity: 'Rare', power: 2600, price: 30000, seller: 'DarkGem', level: 16 },
  { id: 303, name: 'Mawile', type: 'steel', rarity: 'Rare', power: 2900, price: 36000, seller: 'JawSteel', level: 19 },
  { id: 304, name: 'Aron', type: 'steel', rarity: 'Rare', power: 2400, price: 26000, seller: 'LittleIron', level: 14 },
  { id: 305, name: 'Lairon', type: 'steel', rarity: 'Rare', power: 2900, price: 36000, seller: 'IronArmor', level: 19 },
  { id: 306, name: 'Aggron', type: 'steel', rarity: 'Rare', power: 3500, price: 50000, seller: 'IronGiant', level: 25 },
  { id: 307, name: 'Meditite', type: 'fighting', rarity: 'Rare', power: 2400, price: 26000, seller: 'Yoga', level: 14 },
  { id: 308, name: 'Medicham', type: 'fighting', rarity: 'Rare', power: 3000, price: 38000, seller: 'YogaMaster', level: 19 },
  { id: 309, name: 'Electrike', type: 'electric', rarity: 'Rare', power: 2400, price: 26000, seller: 'LightningDog', level: 14 },
  { id: 311, name: 'Plusle', type: 'electric', rarity: 'Rare', power: 2700, price: 32000, seller: 'Cheer', level: 17 },
  { id: 312, name: 'Minun', type: 'electric', rarity: 'Rare', power: 2700, price: 32000, seller: 'Support', level: 17 },
  { id: 313, name: 'Volbeat', type: 'bug', rarity: 'Rare', power: 2600, price: 30000, seller: 'Firefly', level: 16 },
  { id: 314, name: 'Illumise', type: 'bug', rarity: 'Rare', power: 2600, price: 30000, seller: 'Firefly2', level: 16 },
  { id: 315, name: 'Roselia', type: 'grass', rarity: 'Rare', power: 2900, price: 36000, seller: 'Thorn', level: 19 },
  { id: 316, name: 'Gulpin', type: 'poison', rarity: 'Rare', power: 2200, price: 22000, seller: 'Stomach', level: 12 },
  { id: 317, name: 'Swalot', type: 'poison', rarity: 'Rare', power: 2900, price: 36000, seller: 'BigStomach', level: 19 },
  { id: 318, name: 'Carvanha', type: 'water', rarity: 'Rare', power: 2500, price: 28000, seller: 'Piranha', level: 15 },
  { id: 320, name: 'Wailmer', type: 'water', rarity: 'Rare', power: 2600, price: 30000, seller: 'Balloon', level: 16 },
  { id: 321, name: 'Wailord', type: 'water', rarity: 'Rare', power: 3400, price: 47000, seller: 'Giant', level: 24 },
  { id: 322, name: 'Numel', type: 'fire', rarity: 'Rare', power: 2400, price: 26000, seller: 'Numb', level: 14 },
  { id: 324, name: 'Torkoal', type: 'fire', rarity: 'Rare', power: 2800, price: 34000, seller: 'Coal', level: 18 },
  { id: 325, name: 'Spoink', type: 'psychic', rarity: 'Rare', power: 2500, price: 28000, seller: 'Bounce', level: 15 },
  { id: 326, name: 'Grumpig', type: 'psychic', rarity: 'Rare', power: 3000, price: 38000, seller: 'BounceBig', level: 19 },
  { id: 327, name: 'Spinda', type: 'normal', rarity: 'Rare', power: 2500, price: 28000, seller: 'SpotPanda', level: 15 },
  { id: 328, name: 'Trapinch', type: 'ground', rarity: 'Rare', power: 2400, price: 26000, seller: 'AntLion', level: 14 },
  { id: 329, name: 'Vibrava', type: 'dragon', rarity: 'Rare', power: 2800, price: 34000, seller: 'Vibration', level: 18 },
  { id: 330, name: 'Flygon', type: 'dragon', rarity: 'Rare', power: 3500, price: 50000, seller: 'DesertDragon', level: 25 },
  { id: 331, name: 'Cacnea', type: 'grass', rarity: 'Rare', power: 2400, price: 26000, seller: 'Cactus', level: 14 },
  { id: 332, name: 'Cacturne', type: 'grass', rarity: 'Rare', power: 3200, price: 42000, seller: 'Scarecrow', level: 21 },
  { id: 333, name: 'Swablu', type: 'flying', rarity: 'Rare', power: 2400, price: 26000, seller: 'CottonBird', level: 14 },
  { id: 335, name: 'Zangoose', type: 'normal', rarity: 'Rare', power: 3000, price: 38000, seller: 'CatWeasel', level: 19 },
  { id: 336, name: 'Seviper', type: 'poison', rarity: 'Rare', power: 3000, price: 38000, seller: 'Serpent', level: 19 },
  { id: 337, name: 'Lunatone', type: 'rock', rarity: 'Rare', power: 2800, price: 34000, seller: 'MoonRock', level: 18 },
  { id: 338, name: 'Solrock', type: 'rock', rarity: 'Rare', power: 2800, price: 34000, seller: 'SunRock', level: 18 },
  { id: 339, name: 'Barboach', type: 'water', rarity: 'Rare', power: 2200, price: 22000, seller: 'Whisker', level: 12 },
  { id: 340, name: 'Whiscash', type: 'water', rarity: 'Rare', power: 2700, price: 32000, seller: 'BigWhisker', level: 17 },
  { id: 341, name: 'Corphish', type: 'water', rarity: 'Rare', power: 2400, price: 26000, seller: 'Crayfish', level: 14 },
  { id: 342, name: 'Crawdaunt', type: 'water', rarity: 'Rare', power: 3100, price: 40000, seller: 'Rogue', level: 21 },
  { id: 343, name: 'Baltoy', type: 'ground', rarity: 'Rare', power: 2200, price: 22000, seller: 'ClayDoll', level: 12 },
  { id: 344, name: 'Claydol', type: 'ground', rarity: 'Rare', power: 2900, price: 36000, seller: 'SkyDoll', level: 19 },
  { id: 345, name: 'Lileep', type: 'grass', rarity: 'Rare', power: 2400, price: 26000, seller: 'SeaLily', level: 14 },
  { id: 346, name: 'Cradily', type: 'grass', rarity: 'Rare', power: 3000, price: 38000, seller: 'Barnacle', level: 19 },
  { id: 347, name: 'Anorith', type: 'rock', rarity: 'Rare', power: 2500, price: 28000, seller: 'AncientBug', level: 15 },
  { id: 348, name: 'Armaldo', type: 'rock', rarity: 'Rare', power: 3200, price: 42000, seller: 'AncientArmor', level: 21 },
  { id: 349, name: 'Feebas', type: 'water', rarity: 'Rare', power: 1800, price: 15000, seller: 'FishTiny', level: 9 },
  { id: 351, name: 'Castform', type: 'normal', rarity: 'Rare', power: 2800, price: 34000, seller: 'Weather', level: 18 },
  { id: 352, name: 'Kecleon', type: 'normal', rarity: 'Rare', power: 2800, price: 34000, seller: 'Color', level: 18 },
  { id: 353, name: 'Shuppet', type: 'ghost', rarity: 'Rare', power: 2400, price: 26000, seller: 'Doll', level: 14 },
  { id: 354, name: 'Banette', type: 'ghost', rarity: 'Rare', power: 3100, price: 40000, seller: 'DollEvil', level: 21 },
  { id: 355, name: 'Duskull', type: 'ghost', rarity: 'Rare', power: 2200, price: 22000, seller: 'Spirit', level: 12 },
  { id: 356, name: 'Dusclops', type: 'ghost', rarity: 'Rare', power: 2800, price: 34000, seller: 'DarkSpirit', level: 18 },
  { id: 357, name: 'Tropius', type: 'grass', rarity: 'Rare', power: 3000, price: 38000, seller: 'Island', level: 19 },
  { id: 359, name: 'Absol', type: 'dark', rarity: 'Rare', power: 3200, price: 42000, seller: 'Disaster', level: 21 },
  { id: 360, name: 'Wynaut', type: 'psychic', rarity: 'Rare', power: 2200, price: 22000, seller: 'Baby', level: 12 },
  { id: 361, name: 'Snorunt', type: 'ice', rarity: 'Rare', power: 2400, price: 26000, seller: 'Snow', level: 14 },
  { id: 362, name: 'Glalie', type: 'ice', rarity: 'Rare', power: 3000, price: 38000, seller: 'Face', level: 19 },
  { id: 363, name: 'Spheal', type: 'ice', rarity: 'Rare', power: 2200, price: 22000, seller: 'BallSeal', level: 12 },
  { id: 364, name: 'Sealeo', type: 'ice', rarity: 'Rare', power: 2700, price: 32000, seller: 'BallBig', level: 17 },
  { id: 365, name: 'Walrein', type: 'ice', rarity: 'Rare', power: 3300, price: 44000, seller: 'GiantSeal', level: 22 },
  { id: 366, name: 'Clamperl', type: 'water', rarity: 'Rare', power: 2200, price: 22000, seller: 'Pearl', level: 12 },
  { id: 367, name: 'Huntail', type: 'water', rarity: 'Rare', power: 2900, price: 36000, seller: 'DeepSea', level: 19 },
  { id: 368, name: 'Gorebyss', type: 'water', rarity: 'Rare', power: 2900, price: 36000, seller: 'PinkSea', level: 19 },
  { id: 369, name: 'Relicanth', type: 'water', rarity: 'Rare', power: 3000, price: 38000, seller: 'AncientFish', level: 19 },
  { id: 370, name: 'Luvdisc', type: 'water', rarity: 'Rare', power: 2200, price: 22000, seller: 'HeartFish', level: 12 },
  { id: 371, name: 'Bagon', type: 'dragon', rarity: 'Rare', power: 2600, price: 30000, seller: 'RockHead', level: 16 },
  { id: 372, name: 'Shelgon', type: 'dragon', rarity: 'Rare', power: 3000, price: 38000, seller: 'ArmorDragon', level: 19 },

  // Uncommon Pokemon - Lower prices
  { id: 1, name: 'Bulbasaur', type: 'grass', rarity: 'Uncommon', power: 1500, price: 8000, seller: 'StarterFan', level: 10 },
  { id: 2, name: 'Ivysaur', type: 'grass', rarity: 'Uncommon', power: 2000, price: 12000, seller: 'PlantGrower', level: 14 },
  { id: 4, name: 'Charmander', type: 'fire', rarity: 'Uncommon', power: 1500, price: 8000, seller: 'FireStarter', level: 10 },
  { id: 7, name: 'Squirtle', type: 'water', rarity: 'Uncommon', power: 1500, price: 8000, seller: 'WaterStarter', level: 10 },
  { id: 10, name: 'Caterpie', type: 'bug', rarity: 'Uncommon', power: 400, price: 500, seller: 'BugCatcher', level: 3 },
  { id: 11, name: 'Metapod', type: 'bug', rarity: 'Uncommon', power: 600, price: 800, seller: 'Cocoon', level: 5 },
  { id: 12, name: 'Butterfree', type: 'bug', rarity: 'Uncommon', power: 1500, price: 7000, seller: 'Butterfly', level: 10 },
  { id: 13, name: 'Weedle', type: 'bug', rarity: 'Uncommon', power: 400, price: 500, seller: 'TinyBug', level: 3 },
  { id: 14, name: 'Kakuna', type: 'bug', rarity: 'Uncommon', power: 600, price: 800, seller: 'SleepBug', level: 5 },
  { id: 15, name: 'Beedrill', type: 'bug', rarity: 'Uncommon', power: 1500, price: 7000, seller: 'Stinger', level: 10 },
  { id: 16, name: 'Pidgey', type: 'flying', rarity: 'Uncommon', power: 800, price: 2000, seller: 'BirdBasic', level: 6 },
  { id: 19, name: 'Rattata', type: 'normal', rarity: 'Uncommon', power: 600, price: 1000, seller: 'RatCatcher', level: 5 },
  { id: 20, name: 'Raticate', type: 'normal', rarity: 'Uncommon', power: 1200, price: 5000, seller: 'BigRat', level: 9 },
  { id: 21, name: 'Spearow', type: 'flying', rarity: 'Uncommon', power: 800, price: 2000, seller: 'SmallBird', level: 6 },
  { id: 22, name: 'Fearow', type: 'flying', rarity: 'Uncommon', power: 1400, price: 6000, seller: 'BeakBird', level: 11 },
  { id: 23, name: 'Ekans', type: 'poison', rarity: 'Uncommon', power: 900, price: 2500, seller: 'Snake', level: 7 },
  { id: 25, name: 'Pikachu', type: 'electric', rarity: 'Uncommon', power: 1600, price: 9000, seller: 'ElectricRodent', level: 12 },
  { id: 26, name: 'Raichu', type: 'electric', rarity: 'Uncommon', power: 2200, price: 15000, seller: 'ThunderRat', level: 16 },
  { id: 27, name: 'Sandshrew', type: 'ground', rarity: 'Uncommon', power: 1000, price: 3500, seller: 'Mouse', level: 8 },
  { id: 28, name: 'Sandslash', type: 'ground', rarity: 'Uncommon', power: 1600, price: 9000, seller: 'SpikyMouse', level: 12 },
  { id: 29, name: 'Nidoran♀', type: 'poison', rarity: 'Uncommon', power: 1000, price: 3500, seller: 'PinkRabbit', level: 8 },
  { id: 30, name: 'Nidorina', type: 'poison', rarity: 'Uncommon', power: 1400, price: 6000, seller: 'PinkRabbit2', level: 11 },
  { id: 31, name: 'Nidoqueen', type: 'poison', rarity: 'Uncommon', power: 2000, price: 12000, seller: 'QueenRabbit', level: 14 },
  { id: 32, name: 'Nidoran♂', type: 'poison', rarity: 'Uncommon', power: 1000, price: 3500, seller: 'BlueRabbit', level: 8 },
  { id: 33, name: 'Nidorino', type: 'poison', rarity: 'Uncommon', power: 1400, price: 6000, seller: 'BlueRabbit2', level: 11 },
  { id: 34, name: 'Nidoking', type: 'poison', rarity: 'Uncommon', power: 2000, price: 12000, seller: 'KingRabbit', level: 14 },
  { id: 35, name: 'Clefairy', type: 'fairy', rarity: 'Uncommon', power: 1200, price: 5000, seller: 'Fairy', level: 9 },
  { id: 36, name: 'Clefable', type: 'fairy', rarity: 'Uncommon', power: 1800, price: 10000, seller: 'BigFairy', level: 13 },
  { id: 37, name: 'Vulpix', type: 'fire', rarity: 'Uncommon', power: 1100, price: 4000, seller: 'FoxFire', level: 8 },
  { id: 39, name: 'Jigglypuff', type: 'normal', rarity: 'Uncommon', power: 1000, price: 3500, seller: 'Singer', level: 8 },
  { id: 40, name: 'Wigglytuff', type: 'normal', rarity: 'Uncommon', power: 1600, price: 9000, seller: 'BigSinger', level: 12 },
  { id: 41, name: 'Zubat', type: 'poison', rarity: 'Uncommon', power: 700, price: 1500, seller: 'CaveBat', level: 5 },
  { id: 42, name: 'Golbat', type: 'poison', rarity: 'Uncommon', power: 1500, price: 8000, seller: 'BigBat', level: 11 },
  { id: 43, name: 'Oddish', type: 'grass', rarity: 'Uncommon', power: 1000, price: 3500, seller: 'Weed', level: 8 },
  { id: 44, name: 'Gloom', type: 'grass', rarity: 'Uncommon', power: 1400, price: 6000, seller: 'SmellyWeed', level: 11 },
  { id: 45, name: 'Vileplume', type: 'grass', rarity: 'Uncommon', power: 1900, price: 11000, seller: 'BigFlower', level: 14 },
  { id: 46, name: 'Paras', type: 'bug', rarity: 'Uncommon', power: 1000, price: 3500, seller: 'MushroomBug', level: 8 },
  { id: 47, name: 'Parasect', type: 'bug', rarity: 'Uncommon', power: 1600, price: 9000, seller: 'BigMushroom', level: 12 },
  { id: 48, name: 'Venonat', type: 'bug', rarity: 'Uncommon', power: 900, price: 2500, seller: 'MothBug', level: 7 },
  { id: 49, name: 'Venomoth', type: 'bug', rarity: 'Uncommon', power: 1500, price: 8000, seller: 'BigMoth', level: 11 },
  { id: 50, name: 'Diglett', type: 'ground', rarity: 'Uncommon', power: 800, price: 2000, seller: 'Mole', level: 6 },
  { id: 52, name: 'Meowth', type: 'normal', rarity: 'Uncommon', power: 1000, price: 3500, seller: 'CatMoney', level: 8 },
  { id: 54, name: 'Psyduck', type: 'water', rarity: 'Uncommon', power: 1200, price: 5000, seller: 'DizzyDuck', level: 9 },
  { id: 55, name: 'Golduck', type: 'water', rarity: 'Uncommon', power: 1800, price: 10000, seller: 'SmartDuck', level: 13 },
  { id: 56, name: 'Mankey', type: 'fighting', rarity: 'Uncommon', power: 1200, price: 5000, seller: 'MonkeyAngry', level: 9 },
  { id: 57, name: 'Primeape', type: 'fighting', rarity: 'Uncommon', power: 1800, price: 10000, seller: 'AngryMonkey', level: 13 },
  { id: 58, name: 'Growlithe', type: 'fire', rarity: 'Uncommon', power: 1400, price: 6000, seller: 'PuppyFire', level: 11 },
  { id: 60, name: 'Poliwag', type: 'water', rarity: 'Uncommon', power: 900, price: 2500, seller: 'Tadpole', level: 7 },
  { id: 61, name: 'Poliwhirl', type: 'water', rarity: 'Uncommon', power: 1300, price: 5500, seller: 'Tadpole2', level: 10 },
  { id: 63, name: 'Abra', type: 'psychic', rarity: 'Uncommon', power: 1000, price: 3500, seller: 'Sleepy', level: 8 },
  { id: 64, name: 'Kadabra', type: 'psychic', rarity: 'Uncommon', power: 1500, price: 8000, seller: 'Psi', level: 11 },
  { id: 66, name: 'Machop', type: 'fighting', rarity: 'Uncommon', power: 1200, price: 5000, seller: 'FighterKid', level: 9 },
  { id: 67, name: 'Machoke', type: 'fighting', rarity: 'Uncommon', power: 1600, price: 9000, seller: 'Fighter', level: 12 },
  { id: 69, name: 'Bellsprout', type: 'grass', rarity: 'Uncommon', power: 1000, price: 3500, seller: 'FlowerTrumpet', level: 8 },
  { id: 70, name: 'Weepinbell', type: 'grass', rarity: 'Uncommon', power: 1400, price: 6000, seller: 'BiggerTrumpet', level: 11 },
  { id: 72, name: 'Tentacool', type: 'water', rarity: 'Uncommon', power: 900, price: 2500, seller: 'Jellyfish', level: 7 },
  { id: 73, name: 'Tentacruel', type: 'water', rarity: 'Uncommon', power: 1700, price: 9500, seller: 'BigJellyfish', level: 13 },
  { id: 74, name: 'Geodude', type: 'rock', rarity: 'Uncommon', power: 1000, price: 3500, seller: 'Rock', level: 8 },
  { id: 75, name: 'Graveler', type: 'rock', rarity: 'Uncommon', power: 1400, price: 6000, seller: 'RollingRock', level: 11 },
  { id: 77, name: 'Ponyta', type: 'fire', rarity: 'Uncommon', power: 1400, price: 6000, seller: 'FireHorse', level: 11 },
  { id: 79, name: 'Slowpoke', type: 'water', rarity: 'Uncommon', power: 1100, price: 4000, seller: 'Dopey', level: 8 },
  { id: 80, name: 'Slowbro', type: 'water', rarity: 'Uncommon', power: 1700, price: 9500, seller: 'HermitCrab', level: 13 },
  { id: 81, name: 'Magnemite', type: 'electric', rarity: 'Uncommon', power: 1000, price: 3500, seller: 'Magnet', level: 8 },
  { id: 82, name: 'Magneton', type: 'electric', rarity: 'Uncommon', power: 1500, price: 8000, seller: 'Magnet2', level: 11 },
  { id: 83, name: 'Farfetchd', type: 'normal', rarity: 'Uncommon', power: 1300, price: 5500, seller: 'DuckChef', level: 10 },
  { id: 84, name: 'Doduo', type: 'normal', rarity: 'Uncommon', power: 1100, price: 4000, seller: 'TwoHeads', level: 8 },
  { id: 85, name: 'Dodrio', type: 'normal', rarity: 'Uncommon', power: 1700, price: 9500, seller: 'ThreeHeads', level: 13 },
  { id: 86, name: 'Seel', type: 'water', rarity: 'Uncommon', power: 1100, price: 4000, seller: 'SeaLion', level: 8 },
  { id: 87, name: 'Dewgong', type: 'water', rarity: 'Uncommon', power: 1700, price: 9500, seller: 'BigSeaLion', level: 13 },
  { id: 88, name: 'Grimer', type: 'poison', rarity: 'Uncommon', power: 1000, price: 3500, seller: 'Sludge', level: 8 },
  { id: 90, name: 'Shellder', type: 'water', rarity: 'Uncommon', power: 1200, price: 5000, seller: 'Shell', level: 9 },
  { id: 92, name: 'Gastly', type: 'ghost', rarity: 'Uncommon', power: 1000, price: 3500, seller: 'GasGhost', level: 8 },
  { id: 93, name: 'Haunter', type: 'ghost', rarity: 'Uncommon', power: 1500, price: 8000, seller: 'ScaryGhost', level: 11 },
  { id: 95, name: 'Onix', type: 'rock', rarity: 'Uncommon', power: 1500, price: 8000, seller: 'SnakeRock', level: 11 },
  { id: 96, name: 'Drowzee', type: 'psychic', rarity: 'Uncommon', power: 1000, price: 3500, seller: 'Hypno', level: 8 },
  { id: 97, name: 'Hypno', type: 'psychic', rarity: 'Uncommon', power: 1600, price: 9000, seller: 'SleepMaster', level: 12 },
  { id: 98, name: 'Krabby', type: 'water', rarity: 'Uncommon', power: 1200, price: 5000, seller: 'Crab', level: 9 },
  { id: 99, name: 'Kingler', type: 'water', rarity: 'Uncommon', power: 1700, price: 9500, seller: 'BigCrab', level: 13 },
  { id: 100, name: 'Voltorb', type: 'electric', rarity: 'Uncommon', power: 1000, price: 3500, seller: 'BallElectric', level: 8 },
  { id: 101, name: 'Electrode', type: 'electric', rarity: 'Uncommon', power: 1500, price: 8000, seller: 'BigBall', level: 11 },
  { id: 102, name: 'Exeggcute', type: 'grass', rarity: 'Uncommon', power: 1100, price: 4000, seller: 'EggGroup', level: 8 },
  { id: 104, name: 'Cubone', type: 'ground', rarity: 'Uncommon', power: 1200, price: 5000, seller: 'Lonely', level: 9 },
  { id: 105, name: 'Marowak', type: 'ground', rarity: 'Uncommon', power: 1600, price: 9000, seller: 'BoneKeeper', level: 12 },
  { id: 106, name: 'Hitmonlee', type: 'fighting', rarity: 'Uncommon', power: 1700, price: 9500, seller: 'Kicker', level: 13 },
  { id: 107, name: 'Hitmonchan', type: 'fighting', rarity: 'Uncommon', power: 1700, price: 9500, seller: 'Puncher', level: 13 },
  { id: 108, name: 'Lickitung', type: 'normal', rarity: 'Uncommon', power: 1500, price: 8000, seller: 'Licker', level: 11 },
  { id: 109, name: 'Koffing', type: 'poison', rarity: 'Uncommon', power: 1000, price: 3500, seller: 'Gas', level: 8 },
  { id: 111, name: 'Rhyhorn', type: 'ground', rarity: 'Uncommon', power: 1200, price: 5000, seller: 'SpikeBack', level: 9 },
  { id: 114, name: 'Tangela', type: 'grass', rarity: 'Uncommon', power: 1600, price: 9000, seller: 'Vine', level: 12 },
  { id: 115, name: 'Kangaskhan', type: 'normal', rarity: 'Uncommon', power: 1800, price: 10000, seller: 'Momma', level: 13 },
  { id: 116, name: 'Horsea', type: 'water', rarity: 'Uncommon', power: 1000, price: 3500, seller: 'SeaHorse', level: 8 },
  { id: 117, name: 'Seadra', type: 'water', rarity: 'Uncommon', power: 1500, price: 8000, seller: 'DragonFish', level: 11 },
  { id: 118, name: 'Goldeen', type: 'water', rarity: 'Uncommon', power: 1100, price: 4000, seller: 'GoldFish', level: 8 },
  { id: 119, name: 'Seaking', type: 'water', rarity: 'Uncommon', power: 1600, price: 9000, seller: 'KingFish', level: 12 },
  { id: 120, name: 'Staryu', type: 'water', rarity: 'Uncommon', power: 1000, price: 3500, seller: 'Starfish', level: 8 },
  { id: 123, name: 'Scyther', type: 'bug', rarity: 'Uncommon', power: 1700, price: 9500, seller: 'Mantis', level: 13 },
  { id: 129, name: 'Magikarp', type: 'water', rarity: 'Uncommon', power: 400, price: 500, seller: 'FishWeak', level: 3 },
  { id: 133, name: 'Eevee', type: 'normal', rarity: 'Uncommon', power: 1500, price: 8000, seller: 'Evolution', level: 11 },
  { id: 138, name: 'Omanyte', type: 'rock', rarity: 'Uncommon', power: 1200, price: 5000, seller: 'Spiral', level: 9 },
  { id: 139, name: 'Omastar', type: 'rock', rarity: 'Uncommon', power: 1800, price: 10000, seller: 'SpiralBig', level: 13 },
  { id: 140, name: 'Kabuto', type: 'rock', rarity: 'Uncommon', power: 1200, price: 5000, seller: 'Fossil', level: 9 },
  { id: 141, name: 'Kabutops', type: 'rock', rarity: 'Uncommon', power: 1800, price: 10000, seller: 'FossilBig', level: 13 },
  { id: 146, name: 'Moltres', type: 'fire', rarity: 'Uncommon', power: 2000, price: 12000, seller: 'FireBird', level: 14 },
  { id: 147, name: 'Dratini', type: 'dragon', rarity: 'Uncommon', power: 1200, price: 5000, seller: 'BabyDragon', level: 9 },
  { id: 148, name: 'Dragonair', type: 'dragon', rarity: 'Uncommon', power: 1600, price: 9000, seller: 'YoungDragon', level: 12 },
  { id: 151, name: 'Mew', type: 'psychic', rarity: 'Uncommon', power: 2500, price: 18000, seller: 'Legendary', level: 18 },

  // Common Pokemon - Cheapest
  { id: 161, name: 'Sentret', type: 'normal', rarity: 'Common', power: 500, price: 800, seller: 'WatchCat', level: 4 },
  { id: 163, name: 'Hoothoot', type: 'flying', rarity: 'Common', power: 500, price: 800, seller: 'NightBird', level: 4 },
  { id: 165, name: 'Ledyba', type: 'bug', rarity: 'Common', power: 500, price: 800, seller: 'RedBug', level: 4 },
  { id: 166, name: 'Ledian', type: 'bug', rarity: 'Common', power: 800, price: 1800, seller: 'BigRedBug', level: 7 },
  { id: 167, name: 'Spinarak', type: 'bug', rarity: 'Common', power: 500, price: 800, seller: 'Spider', level: 4 },
  { id: 168, name: 'Ariados', type: 'bug', rarity: 'Common', power: 800, price: 1800, seller: 'BigSpider', level: 7 },
  { id: 171, name: 'Lanturn', type: 'water', rarity: 'Common', power: 1500, price: 7000, seller: 'LightFish', level: 10 },
  { id: 183, name: 'Marill', type: 'water', rarity: 'Common', power: 800, price: 1800, seller: 'AquaMouse', level: 7 },
  { id: 184, name: 'Azumarill', type: 'water', rarity: 'Common', power: 1400, price: 6000, seller: 'BigAquaMouse', level: 11 },
  { id: 188, name: 'Skiploom', type: 'grass', rarity: 'Common', power: 800, price: 1800, seller: 'JumpFlower', level: 7 },
  { id: 194, name: 'Wooper', type: 'water', rarity: 'Common', power: 600, price: 1200, seller: 'MudFish', level: 5 },
  { id: 206, name: 'Dunsparce', type: 'normal', rarity: 'Common', power: 800, price: 1800, seller: 'Snake', level: 7 },
  { id: 220, name: 'Swinub', type: 'ice', rarity: 'Common', power: 600, price: 1200, seller: 'PigNose', level: 5 },
  { id: 223, name: 'Remoraid', type: 'water', rarity: 'Common', power: 600, price: 1200, seller: 'SquirtGun', level: 5 },
  { id: 225, name: 'Delibird', type: 'ice', rarity: 'Common', power: 1000, price: 3500, seller: 'GiftBird', level: 8 },
  { id: 261, name: 'Poochyena', type: 'dark', rarity: 'Common', power: 500, price: 800, seller: 'ShadowDog', level: 4 },
  { id: 263, name: 'Zigzagoon', type: 'normal', rarity: 'Common', power: 500, price: 800, seller: 'Zigzag', level: 4 },
  { id: 265, name: 'Wurmple', type: 'bug', rarity: 'Common', power: 400, price: 600, seller: 'Caterpillar', level: 3 },
  { id: 270, name: 'Lotad', type: 'water', rarity: 'Common', power: 500, price: 800, seller: 'LilyPad', level: 4 },
  { id: 273, name: 'Seedot', type: 'grass', rarity: 'Common', power: 500, price: 800, seller: 'Acorn', level: 4 },
  { id: 276, name: 'Taillow', type: 'flying', rarity: 'Common', power: 600, price: 1200, seller: 'BirdSmall', level: 5 },
  { id: 278, name: 'Wingull', type: 'water', rarity: 'Common', power: 500, price: 800, seller: 'SeaGull', level: 4 },
  { id: 280, name: 'Ralts', type: 'psychic', rarity: 'Common', power: 500, price: 800, seller: 'Child', level: 4 },
  { id: 283, name: 'Surskit', type: 'bug', rarity: 'Common', power: 500, price: 800, seller: 'PondSkater', level: 4 },
  { id: 285, name: 'Shroomish', type: 'grass', rarity: 'Common', power: 500, price: 800, seller: 'Mushroom', level: 4 },
  { id: 287, name: 'Slakoth', type: 'normal', rarity: 'Common', power: 500, price: 800, seller: 'Lazy', level: 4 },
  { id: 290, name: 'Nincada', type: 'bug', rarity: 'Common', power: 500, price: 800, seller: 'Driller', level: 4 },
  { id: 293, name: 'Whismur', type: 'normal', rarity: 'Common', power: 500, price: 800, seller: 'Loud', level: 4 },
  { id: 296, name: 'Makuhita', type: 'fighting', rarity: 'Common', power: 500, price: 800, seller: 'FighterKid', level: 4 },
  { id: 298, name: 'Azurill', type: 'normal', rarity: 'Common', power: 400, price: 600, seller: 'BlueBall', level: 3 },
  { id: 300, name: 'Skitty', type: 'normal', rarity: 'Common', power: 600, price: 1200, seller: 'Kitten', level: 5 },
  { id: 301, name: 'Delcatty', type: 'normal', rarity: 'Common', power: 1000, price: 3500, seller: 'Kitty', level: 8 },
  { id: 304, name: 'Aron', type: 'steel', rarity: 'Common', power: 600, price: 1200, seller: 'LittleIron', level: 5 },
  { id: 307, name: 'Meditite', type: 'fighting', rarity: 'Common', power: 600, price: 1200, seller: 'Yoga', level: 5 },
  { id: 309, name: 'Electrike', type: 'electric', rarity: 'Common', power: 600, price: 1200, seller: 'LightningDog', level: 5 },
  { id: 311, name: 'Plusle', type: 'electric', rarity: 'Common', power: 1000, price: 3500, seller: 'Cheer', level: 8 },
  { id: 312, name: 'Minun', type: 'electric', rarity: 'Common', power: 1000, price: 3500, seller: 'Support', level: 8 },
  { id: 313, name: 'Volbeat', type: 'bug', rarity: 'Common', power: 1000, price: 3500, seller: 'Firefly', level: 8 },
  { id: 314, name: 'Illumise', type: 'bug', rarity: 'Common', power: 1000, price: 3500, seller: 'Firefly2', level: 8 },
  { id: 315, name: 'Roselia', type: 'grass', rarity: 'Common', power: 1400, price: 6000, seller: 'Thorn', level: 11 },
  { id: 316, name: 'Gulpin', type: 'poison', rarity: 'Common', power: 600, price: 1200, seller: 'Stomach', level: 5 },
  { id: 318, name: 'Carvanha', type: 'water', rarity: 'Common', power: 800, price: 1800, seller: 'Piranha', level: 7 },
  { id: 322, name: 'Numel', type: 'fire', rarity: 'Common', power: 600, price: 1200, seller: 'Numb', level: 5 },
  { id: 325, name: 'Spoink', type: 'psychic', rarity: 'Common', power: 800, price: 1800, seller: 'Bounce', level: 7 },
  { id: 327, name: 'Spinda', type: 'normal', rarity: 'Common', power: 1000, price: 3500, seller: 'SpotPanda', level: 8 },
  { id: 328, name: 'Trapinch', type: 'ground', rarity: 'Common', power: 600, price: 1200, seller: 'AntLion', level: 5 },
  { id: 331, name: 'Cacnea', type: 'grass', rarity: 'Common', power: 600, price: 1200, seller: 'Cactus', level: 5 },
  { id: 333, name: 'Swablu', type: 'flying', rarity: 'Common', power: 600, price: 1200, seller: 'CottonBird', level: 5 },
  { id: 335, name: 'Zangoose', type: 'normal', rarity: 'Common', power: 1200, price: 5000, seller: 'CatWeasel', level: 9 },
  { id: 336, name: 'Seviper', type: 'poison', rarity: 'Common', power: 1200, price: 5000, seller: 'Serpent', level: 9 },
  { id: 337, name: 'Lunatone', type: 'rock', rarity: 'Common', power: 1200, price: 5000, seller: 'MoonRock', level: 9 },
  { id: 338, name: 'Solrock', type: 'rock', rarity: 'Common', power: 1200, price: 5000, seller: 'SunRock', level: 9 },
  { id: 339, name: 'Barboach', type: 'water', rarity: 'Common', power: 500, price: 800, seller: 'Whisker', level: 4 },
  { id: 341, name: 'Corphish', type: 'water', rarity: 'Common', power: 600, price: 1200, seller: 'Crayfish', level: 5 },
  { id: 343, name: 'Baltoy', type: 'ground', rarity: 'Common', power: 500, price: 800, seller: 'ClayDoll', level: 4 },
  { id: 345, name: 'Lileep', type: 'grass', rarity: 'Common', power: 600, price: 1200, seller: 'SeaLily', level: 5 },
  { id: 347, name: 'Anorith', type: 'rock', rarity: 'Common', power: 600, price: 1200, seller: 'AncientBug', level: 5 },
  { id: 349, name: 'Feebas', type: 'water', rarity: 'Common', power: 400, price: 600, seller: 'FishTiny', level: 3 },
  { id: 351, name: 'Castform', type: 'normal', rarity: 'Common', power: 1200, price: 5000, seller: 'Weather', level: 9 },
  { id: 352, name: 'Kecleon', type: 'normal', rarity: 'Common', power: 1200, price: 5000, seller: 'Color', level: 9 },
  { id: 353, name: 'Shuppet', type: 'ghost', rarity: 'Common', power: 600, price: 1200, seller: 'Doll', level: 5 },
  { id: 355, name: 'Duskull', type: 'ghost', rarity: 'Common', power: 500, price: 800, seller: 'Spirit', level: 4 },
  { id: 359, name: 'Absol', type: 'dark', rarity: 'Common', power: 1400, price: 6000, seller: 'Disaster', level: 11 },
  { id: 360, name: 'Wynaut', type: 'psychic', rarity: 'Common', power: 600, price: 1200, seller: 'Baby', level: 5 },
  { id: 361, name: 'Snorunt', type: 'ice', rarity: 'Common', power: 600, price: 1200, seller: 'Snow', level: 5 },
  { id: 363, name: 'Spheal', type: 'ice', rarity: 'Common', power: 600, price: 1200, seller: 'BallSeal', level: 5 },
  { id: 366, name: 'Clamperl', type: 'water', rarity: 'Common', power: 500, price: 800, seller: 'Pearl', level: 4 },
  { id: 370, name: 'Luvdisc', type: 'water', rarity: 'Common', power: 500, price: 800, seller: 'HeartFish', level: 4 },
  { id: 371, name: 'Bagon', type: 'dragon', rarity: 'Common', power: 1000, price: 3500, seller: 'RockHead', level: 8 },
];

const shopItems = [
  { id: 'egg1', name: 'Pokemon Egg', type: 'egg', price: 100, emoji: '🥚', desc: 'Hatch a random Pokemon!', stock: 999 },
  { id: 'egg10', name: 'Egg Pack (10)', type: 'egg_pack', price: 900, emoji: '🥚🎁', desc: '10 eggs - 10% bonus', stock: 99 },
  { id: 'fire_aura', name: 'Fire Aura', type: 'aura', price: 2000, emoji: '🔥', desc: '+20% Fire damage', stock: 50 },
  { id: 'water_aura', name: 'Water Aura', type: 'aura', price: 2000, emoji: '💧', desc: '+20% Water defense', stock: 50 },
  { id: 'lightning_boost', name: 'Lightning Boost', type: 'boost', price: 1500, emoji: '⚡', desc: '+30% Electric damage', stock: 75 },
  { id: 'grass_crown', name: 'Grass Crown', type: 'cosmetic', price: 3000, emoji: '🌿', desc: 'Green avatar frame', stock: 25 },
  { id: 'dragon_wings', name: 'Dragon Wings', type: 'cosmetic', price: 5000, emoji: '🐉', desc: 'Dragon wings cosmetic', stock: 15 },
  { id: 'energy_pack', name: 'Energy Pack', type: 'consumable', price: 500, emoji: '⚡', desc: '+100 Energy', stock: 200 },
  { id: 'power_gem', name: 'Power Gem', type: 'consumable', price: 1000, emoji: '💎', desc: '+50 Power permanently', stock: 100 },
  { id: 'mystery_box', name: 'Mystery Box', type: 'mystery', price: 2500, emoji: '🎁', desc: 'Random rare item!', stock: 50 },
];

const typeEmojis: Record<string, string> = {
  fire: '🔥', water: '💧', electric: '⚡', grass: '🌿',
  ice: '❄️', dragon: '🐉', ghost: '👻', fighting: '🥊',
  fairy: '🧚', psychic: '🧠', normal: '⚪', dark: '🌑',
  flying: '🪶', poison: '☠️', rock: '🪨', bug: '🐛',
  ground: '🟤', steel: '⚙️',
};

const typeColors: Record<string, { bg: string; text: string }> = {
  fire: { bg: 'bg-red-500/20', text: 'text-red-400' },
  water: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
  electric: { bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
  grass: { bg: 'bg-green-500/20', text: 'text-green-400' },
  ice: { bg: 'bg-cyan-500/20', text: 'text-cyan-400' },
  dragon: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
  ghost: { bg: 'bg-indigo-500/20', text: 'text-indigo-400' },
  fighting: { bg: 'bg-orange-500/20', text: 'text-orange-400' },
  fairy: { bg: 'bg-pink-500/20', text: 'text-pink-400' },
  psychic: { bg: 'bg-fuchsia-500/20', text: 'text-fuchsia-400' },
  normal: { bg: 'bg-gray-500/20', text: 'text-gray-400' },
  dark: { bg: 'bg-slate-500/20', text: 'text-slate-400' },
  flying: { bg: 'bg-sky-500/20', text: 'text-sky-400' },
  poison: { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
  rock: { bg: 'bg-amber-500/20', text: 'text-amber-400' },
  bug: { bg: 'bg-lime-500/20', text: 'text-lime-400' },
  ground: { bg: 'bg-yellow-600/20', text: 'text-yellow-600' },
  steel: { bg: 'bg-slate-400/20', text: 'text-slate-400' },
};

const rarityColors: Record<string, { text: string; border: string; glow: string; bg: string }> = {
  Common: { text: 'text-gray-400', border: 'border-gray-400', glow: 'shadow-gray-400/20', bg: 'bg-gray-500/20' },
  Uncommon: { text: 'text-green-400', border: 'border-green-400', glow: 'shadow-green-400/20', bg: 'bg-green-500/20' },
  Rare: { text: 'text-blue-400', border: 'border-blue-400', glow: 'shadow-blue-400/20', bg: 'bg-blue-500/20' },
  Epic: { text: 'text-purple-400', border: 'border-purple-400', glow: 'shadow-purple-400/20', bg: 'bg-purple-500/20' },
  Legendary: { text: 'text-amber-400', border: 'border-amber-400', glow: 'shadow-amber-400/20', bg: 'bg-amber-500/20' },
  Mythic: { text: 'text-red-500', border: 'border-red-500', glow: 'shadow-red-500/30', bg: 'bg-red-500/30' },
};

export default function MarketplacePage() {
  const { isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<'marketplace' | 'shop'>('marketplace');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [selectedRarity, setSelectedRarity] = useState<string | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState<{ type: string; item: any } | null>(null);

  const filteredMarketplace = marketplacePokemon.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || p.type === filterType;
    const matchesRarity = !selectedRarity || p.rarity === selectedRarity;
    return matchesSearch && matchesType && matchesRarity;
  });

  const filteredShop = shopItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || item.type === filterType;
    return matchesSearch && matchesType;
  });

  const handlePurchase = (type: string, item: any) => {
    setShowPurchaseModal({ type, item });
  };

  const confirmPurchase = () => {
    if (showPurchaseModal) {
      alert(`Purchased ${showPurchaseModal.item.name} for ${showPurchaseModal.item.price.toLocaleString()} $MNMOON!`);
      setShowPurchaseModal(null);
    }
  };

  const getPokemonImageUrl = (id: number) => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="bg-slate-800/50 border-b border-white/5 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center space-x-3">
              <Link href="/" className="text-gray-400 hover:text-white">←</Link>
              <h1 className="text-3xl font-bold text-white">🏪 Marketplace</h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('marketplace')}
                className={`px-6 py-2 rounded-xl font-bold transition-all ${
                  activeTab === 'marketplace'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                    : 'bg-slate-700 text-gray-400 hover:text-white'
                }`}
              >
                Pokemon
              </button>
              <button
                onClick={() => setActiveTab('shop')}
                className={`px-6 py-2 rounded-xl font-bold transition-all ${
                  activeTab === 'shop'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                    : 'bg-slate-700 text-gray-400 hover:text-white'
                }`}
              >
                Shop
              </button>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap gap-4">
            <input
              type="text"
              placeholder={`Search ${activeTab === 'marketplace' ? 'Pokemon' : 'items'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 min-w-[200px] px-4 py-2 rounded-xl bg-slate-700/50 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 border border-white/10"
            />
            <select
              value={filterType || ''}
              onChange={(e) => setFilterType(e.target.value || null)}
              className="px-4 py-2 rounded-xl bg-slate-700/50 text-white focus:outline-none border border-white/10"
            >
              <option value="">All Types</option>
              {Object.keys(typeEmojis).map((type) => (
                <option key={type} value={type}>{typeEmojis[type]} {type}</option>
              ))}
            </select>
            {activeTab === 'marketplace' && (
              <select
                value={selectedRarity || ''}
                onChange={(e) => setSelectedRarity(e.target.value || null)}
                className="px-4 py-2 rounded-xl bg-slate-700/50 text-white focus:outline-none border border-white/10"
              >
                <option value="">All Rarities</option>
                {Object.keys(rarityColors).map((rarity) => (
                  <option key={rarity} value={rarity}>{rarity}</option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'marketplace' ? (
            <motion.div
              key="marketplace"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="text-gray-400">{filteredMarketplace.length} Pokemon listed for sale</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {filteredMarketplace.map((pokemon) => {
                  const colors = typeColors[pokemon.type] || typeColors.normal;
                  const rarity = rarityColors[pokemon.rarity];
                  return (
                    <motion.div
                      key={pokemon.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.02 }}
                      className={`relative p-4 rounded-xl border ${rarity.border} ${rarity.glow} shadow-lg ${rarity.bg} bg-slate-800/80 backdrop-blur-sm overflow-hidden`}
                    >
                      {/* Rarity Glow Effect */}
                      <div className={`absolute inset-0 ${rarity.glow} opacity-50 blur-xl`} />
                      
                      {/* Mythic special effect */}
                      {pokemon.rarity === 'Mythic' && (
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 via-purple-500/20 to-red-500/20 animate-pulse" />
                      )}
                      
                      {/* Legendary special effect */}
                      {pokemon.rarity === 'Legendary' && (
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-yellow-500/10 to-amber-500/10" />
                      )}
                      
                      <div className="relative z-10">
                        <div className="relative mb-3">
                          <Image
                            src={getPokemonImageUrl(pokemon.id)}
                            alt={pokemon.name}
                            width={96}
                            height={96}
                            className="mx-auto drop-shadow-lg"
                          />
                          <span className={`absolute top-0 right-0 px-2 py-1 rounded-full text-xs font-bold ${colors.bg} ${colors.text}`}>
                            {typeEmojis[pokemon.type]}
                          </span>
                          {/* Rarity badge */}
                          <span className={`absolute top-0 left-0 px-2 py-1 rounded-full text-xs font-bold ${rarity.text} ${rarity.bg}`}>
                            {pokemon.rarity}
                          </span>
                        </div>
                        
                        <h3 className="font-bold text-white text-center text-sm truncate">{pokemon.name}</h3>
                        
                        <div className="flex items-center justify-center gap-2 mt-2 text-xs">
                          <span className="text-gray-400">Lv.{pokemon.level}</span>
                          <span className={`font-bold ${rarity.text}`}>{pokemon.rarity}</span>
                        </div>
                        
                        <div className="flex items-center justify-center mt-2 gap-2">
                          <span className="text-amber-400 text-sm">⚔️ {pokemon.power.toLocaleString()}</span>
                        </div>
                        
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-gray-400 text-xs truncate max-w-[80px]">@{pokemon.seller}</span>
                          <button
                            onClick={() => handlePurchase('pokemon', pokemon)}
                            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs whitespace-nowrap hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg"
                          >
                            {pokemon.price.toLocaleString()} 🪙
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="shop"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredShop.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 rounded-xl bg-slate-800/80 border border-white/5 hover:border-amber-500/30 transition-all backdrop-blur-sm"
                  >
                    <div className="text-4xl mb-3 text-center">{item.emoji}</div>
                    <h3 className="font-bold text-white text-center text-sm">{item.name}</h3>
                    <p className="text-gray-400 text-xs text-center mt-1">{item.desc}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-gray-500 text-xs">{item.stock} left</span>
                      <button
                        onClick={() => handlePurchase('item', item)}
                        className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg"
                      >
                        {item.price.toLocaleString()} 🪙
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Purchase Modal */}
      <AnimatePresence>
        {showPurchaseModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowPurchaseModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-slate-800 rounded-2xl p-6 max-w-sm w-full border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-white mb-4">Confirm Purchase</h2>
              <div className="text-center py-4">
                {showPurchaseModal.type === 'pokemon' ? (
                  <>
                    <Image
                      src={getPokemonImageUrl(showPurchaseModal.item.id)}
                      alt={showPurchaseModal.item.name}
                      width={100}
                      height={100}
                      className="mx-auto mb-4 drop-shadow-lg"
                    />
                    <h3 className="text-lg font-bold text-white">{showPurchaseModal.item.name}</h3>
                    <p className="text-gray-400">{showPurchaseModal.item.rarity} • Lv.{showPurchaseModal.item.level}</p>
                    <div className="flex justify-center gap-4 mt-2 text-sm">
                      <span className="text-amber-400">⚔️ {showPurchaseModal.item.power.toLocaleString()}</span>
                      <span className="text-gray-400">@{showPurchaseModal.item.seller}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-6xl mb-4">{showPurchaseModal.item.emoji}</div>
                    <h3 className="text-lg font-bold text-white">{showPurchaseModal.item.name}</h3>
                    <p className="text-gray-400">{showPurchaseModal.item.desc}</p>
                  </>
                )}
              </div>
              <div className="bg-slate-700/50 rounded-xl p-4 mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Price</span>
                  <span className="text-amber-400 font-bold">{showPurchaseModal.item.price.toLocaleString()} $MNMOON</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Stock</span>
                  <span className="text-white">{showPurchaseModal.item.stock}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPurchaseModal(null)}
                  className="flex-1 py-3 rounded-xl bg-slate-700 text-white font-bold hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmPurchase}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 font-bold text-white hover:from-amber-600 hover:to-orange-600 transition-all"
                >
                  Buy Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
