// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/// @title MiniMoon Monster NFT
/// @notice ERC721 NFT for MiniMoon game monsters with rarity tiers and stats
contract MonsterNFT is ERC721, ERC721URIStorage, ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;
    using Strings for uint256;

    Counters.Counter private _tokenIdCounter;

    /// @notice Rarity tiers for monsters
    enum Rarity {
        Common,
        Uncommon,
        Rare,
        Epic,
        Legendary,
        Mythic
    }

    /// @notice Monster structure with all attributes
    struct Monster {
        uint256 tokenId;
        string name;
        string ipfsHash;
        Rarity rarity;
        uint256 power;
        uint256 health;
        uint256 attack;
        uint256 defense;
        uint256 speed;
        uint256 energy;
        uint256 maxEnergy;
        uint256 lastEnergyUpdate;
        uint256 experience;
        uint256 level;
        uint256 wins;
        uint256 losses;
        uint256 dungeonRuns;
        bool isAlive;
    }

    /// @notice Monster stats configuration per rarity
    mapping(Rarity => uint256) public rarityBasePower;
    mapping(Rarity => uint256) public rarityMaxHealth;
    mapping(Rarity => uint256) public rarityEnergyRegen;

    /// @notice NFT metadata for each token
    mapping(uint256 => Monster) public monsterData;

    /// @notice Approved game contract
    address public gameContract;

    /// @notice Events
    event MonsterBorn(
        uint256 indexed tokenId,
        address indexed owner,
        string name,
        Rarity rarity
    );
    event MonsterStatsUpdated(uint256 indexed tokenId, uint256 power, uint256 level);
    event MonsterDied(uint256 indexed tokenId);
    event MonsterRevived(uint256 indexed tokenId);
    event EnergyRecharged(uint256 indexed tokenId, uint256 newEnergy);

    constructor() ERC721("MiniMoon Monster", "MNM") Ownable(msg.sender) {
        // Initialize rarity stats
        rarityBasePower[Rarity.Common] = 10;
        rarityBasePower[Rarity.Uncommon] = 25;
        rarityBasePower[Rarity.Rare] = 50;
        rarityBasePower[Rarity.Epic] = 100;
        rarityBasePower[Rarity.Legendary] = 250;
        rarityBasePower[Rarity.Mythic] = 500;

        rarityMaxHealth[Rarity.Common] = 100;
        rarityMaxHealth[Rarity.Uncommon] = 150;
        rarityMaxHealth[Rarity.Rare] = 250;
        rarityMaxHealth[Rarity.Epic] = 500;
        rarityMaxHealth[Rarity.Legendary] = 1000;
        rarityMaxHealth[Rarity.Mythic] = 2000;

        rarityEnergyRegen[Rarity.Common] = 5;
        rarityEnergyRegen[Rarity.Uncommon] = 8;
        rarityEnergyRegen[Rarity.Rare] = 12;
        rarityEnergyRegen[Rarity.Epic] = 20;
        rarityEnergyRegen[Rarity.Legendary] = 35;
        rarityEnergyRegen[Rarity.Mythic] = 50;
    }

    /// @notice Set the game contract address (only owner)
    function setGameContract(address _gameContract) external onlyOwner {
        gameContract = _gameContract;
    }

    /// @notice Generate a new monster with random rarity
    function mintMonster(
        address to,
        string memory name,
        string memory ipfsHash
    ) external returns (uint256) {
        require(msg.sender == owner() || msg.sender == gameContract, "Not authorized");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        // Determine rarity based on randomness
        Rarity rarity = _determineRarity();

        // Calculate initial stats based on rarity
        uint256 power = rarityBasePower[rarity] + (random(tokenId) % 10);
        uint256 maxHealth = rarityMaxHealth[rarity] + (random(tokenId + 1) % 50);
        uint256 attack = power / 5 + (random(tokenId + 2) % 5);
        uint256 defense = power / 10 + (random(tokenId + 3) % 3);
        uint256 speed = 10 + (random(tokenId + 4) % 20);
        uint256 maxEnergy = 100;

        _safeMint(to, tokenId);

        monsterData[tokenId] = Monster({
            tokenId: tokenId,
            name: name,
            ipfsHash: ipfsHash,
            rarity: rarity,
            power: power,
            health: maxHealth,
            attack: attack,
            defense: defense,
            speed: speed,
            energy: maxEnergy,
            maxEnergy: maxEnergy,
            lastEnergyUpdate: block.timestamp,
            experience: 0,
            level: 1,
            wins: 0,
            losses: 0,
            dungeonRuns: 0,
            isAlive: true
        });

        emit MonsterBorn(tokenId, to, name, rarity);

        return tokenId;
    }

    /// @notice Determine monster rarity based on random chance
    function _determineRarity() internal view returns (Rarity) {
        uint256 rand = random(block.timestamp) % 10000;

        // Distribution: Common 50%, Uncommon 25%, Rare 15%, Epic 7%, Legendary 2.5%, Mythic 0.5%
        if (rand < 5000) return Rarity.Common;
        if (rand < 7500) return Rarity.Uncommon;
        if (rand < 9000) return Rarity.Rare;
        if (rand < 9700) return Rarity.Epic;
        if (rand < 9950) return Rarity.Legendary;
        return Rarity.Mythic;
    }

    /// @notice Simple random number generator
    function random(uint256 seed) internal view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, seed)));
    }

    /// @notice Update monster stats after battle/dungeon
    function updateMonsterStats(
        uint256 tokenId,
        uint256 expGained,
        uint256 powerIncrease,
        uint256 healthRestored
    ) external {
        require(msg.sender == owner() || msg.sender == gameContract, "Not authorized");
        Monster storage monster = monsterData[tokenId];
        require(monster.tokenId == tokenId, "Invalid token");

        monster.experience += expGained;
        monster.power += powerIncrease;
        monster.dungeonRuns++;

        // Level up every 100 experience
        uint256 newLevel = 1 + monster.experience / 100;
        if (newLevel > monster.level) {
            monster.level = newLevel;
            // Bonus stats on level up
            monster.maxHealth += 10;
            monster.attack += 2;
            monster.defense += 1;
        }

        // Restore health
        if (healthRestored > 0) {
            monster.health = monster.health + healthRestored > monster.maxHealth
                ? monster.maxHealth
                : monster.health + healthRestored;
        }

        monster.isAlive = monster.health > 0;

        emit MonsterStatsUpdated(tokenId, monster.power, monster.level);
    }

    /// @notice Record battle result
    function recordBattleResult(uint256 tokenId, bool won, uint256 powerChange) external {
        require(msg.sender == owner() || msg.sender == gameContract, "Not authorized");
        Monster storage monster = monsterData[tokenId];
        require(monster.tokenId == tokenId, "Invalid token");

        if (won) {
            monster.wins++;
            monster.power += powerChange;
        } else {
            monster.losses++;
            if (powerChange > monster.power) {
                monster.power = 0;
            } else {
                monster.power -= powerChange;
            }
        }

        emit MonsterStatsUpdated(tokenId, monster.power, monster.level);
    }

    /// @notice Regenerate energy based on time passed
    function regenerateEnergy(uint256 tokenId) external {
        Monster storage monster = monsterData[tokenId];
        require(monster.tokenId == tokenId, "Invalid token");

        uint256 timePassed = block.timestamp - monster.lastEnergyUpdate;
        uint256 energyRegen = (timePassed / 1 hours) * rarityEnergyRegen[monster.rarity];

        if (energyRegen > 0) {
            monster.energy = monster.energy + energyRegen > monster.maxEnergy
                ? monster.maxEnergy
                : monster.energy + energyRegen;
            monster.lastEnergyUpdate = block.timestamp;

            emit EnergyRecharged(tokenId, monster.energy);
        }
    }

    /// @notice Consume energy for an action
    function consumeEnergy(uint256 tokenId, uint256 amount) external returns (bool) {
        require(msg.sender == owner() || msg.sender == gameContract, "Not authorized");
        Monster storage monster = monsterData[tokenId];
        require(monster.tokenId == tokenId, "Invalid token");

        if (monster.energy >= amount) {
            monster.energy -= amount;
            return true;
        }
        return false;
    }

    /// @notice Revive a dead monster
    function reviveMonster(uint256 tokenId) external {
        require(msg.sender == owner() || msg.sender == gameContract, "Not authorized");
        Monster storage monster = monsterData[tokenId];
        require(monster.tokenId == tokenId, "Invalid token");
        require(!monster.isAlive, "Already alive");

        monster.health = monster.maxHealth / 2;
        monster.isAlive = true;
        monster.energy = monster.maxEnergy / 2;
        monster.lastEnergyUpdate = block.timestamp;

        emit MonsterRevived(tokenId);
    }

    /// @notice Get all monster data
    function getMonster(uint256 tokenId) external view returns (Monster memory) {
        return monsterData[tokenId];
    }

    /// @notice Get monsters owned by an address
    function getMonsterIdsByOwner(address owner) external view returns (uint256[] memory) {
        uint256 balance = balanceOf(owner);
        uint256[] memory ids = new uint256[](balance);
        for (uint256 i = 0; i < balance; i++) {
            ids[i] = tokenOfOwnerByIndex(owner, i);
        }
        return ids;
    }

    /// @notice Update monster URI
    function setTokenURI(uint256 tokenId, string memory uri) external onlyOwner {
        _setTokenURI(tokenId, uri);
    }

    // Required overrides for multiple inheritance
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
