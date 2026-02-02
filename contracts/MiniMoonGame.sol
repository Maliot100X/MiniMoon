// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./MonsterNFT.sol";
import "./MiniMoonToken.sol";

/// @title MiniMoon Game Contract
/// @notice Core game logic for dungeons, battles, quests, and marketplace
contract MiniMoonGame is Ownable, ReentrancyGuard {
    MonsterNFT public monsterNFT;
    MiniMoonToken public token;

    /// @notice Dungeon difficulty levels
    enum Difficulty {
        Easy,
        Medium,
        Hard,
        Nightmare
    }

    /// @notice Dungeon structure
    struct Dungeon {
        uint256 id;
        string name;
        string description;
        Difficulty difficulty;
        uint256 energyCost;
        uint256 minPower;
        uint256 rewardPool;
        uint256 winChance;
        uint256[] monsterTypes;
        bool isActive;
    }

    /// @notice Quest structure
    struct Quest {
        uint256 id;
        string name;
        string description;
        uint256 energyCost;
        uint256 experienceReward;
        uint256 tokenReward;
        uint256 dailyLimit;
        uint256 currentCompletions;
        bool isActive;
        bytes32 criteria; // keccak hash of quest type
    }

    /// @notice Marketplace listing
    struct MarketListing {
        uint256 listingId;
        uint256 tokenId;
        address seller;
        uint256 price;
        bool isActive;
        uint256 createdAt;
    }

    /// @notice Player profile
    struct PlayerProfile {
        address player;
        uint256 totalExperience;
        uint256 totalWins;
        uint256 totalLosses;
        uint256 dungeonsCompleted;
        uint256 questsCompleted;
        uint256 tokensEarned;
        uint256 lastDailyReset;
        uint256 consecutiveDailyQuests;
    }

    /// @notice Game state
    mapping(uint256 => Dungeon) public dungeons;
    mapping(uint256 => Quest) public quests;
    mapping(uint256 => MarketListing) public marketListings;
    mapping(address => PlayerProfile) public players;

    uint256 public dungeonCount;
    uint256 public questCount;
    uint256 public listingCount;

    uint256 public constant ENERGY_REGEN_RATE = 5; // Energy per hour
    uint256 public constant DAILY_QUEST_BONUS = 50; // Bonus tokens for daily quests

    /// @notice Events
    event DungeonCreated(uint256 indexed dungeonId, string name, Difficulty difficulty);
    event DungeonEntered(uint256 indexed dungeonId, uint256 indexed tokenId, address player);
    event DungeonCompleted(
        uint256 indexed dungeonId,
        uint256 indexed tokenId,
        bool success,
        uint256 expGained,
        uint256 tokensGained
    );
    event QuestCreated(uint256 indexed questId, string name);
    event QuestCompleted(uint256 indexed questId, address indexed player, uint256 expReward, uint256 tokenReward);
    event ListingCreated(uint256 indexed listingId, uint256 indexed tokenId, uint256 price, address seller);
    event ListingSold(uint256 indexed listingId, uint256 indexed tokenId, address buyer, uint256 price);
    event ListingCancelled(uint256 indexed listingId, address seller);
    event EnergyRecharged(address indexed player, uint256 newEnergy);
    event RewardsClaimed(address indexed player, uint256 amount);

    constructor(address _monsterNFT, address _token) Ownable(msg.sender) {
        monsterNFT = MonsterNFT(_monsterNFT);
        token = MiniMoonToken(_token);

        // Initialize default dungeons
        _initializeDungeons();
        _initializeQuests();
    }

    /// @notice Initialize default dungeons
    function _initializeDungeons() internal {
        // Training Grounds - Easy
        _createDungeon(
            "Training Grounds",
            "A safe environment for beginners to learn the basics",
            Difficulty.Easy,
            10,
            0,
            1000,
            90,
            new uint256[](0)
        );

        // Forest of Beginnings - Easy
        _createDungeon(
            "Forest of Beginnings",
            "Dense forest inhabited by common monsters",
            Difficulty.Easy,
            15,
            50,
            2500,
            80,
            new uint256[](0)
        );

        // Crystal Cave - Medium
        _createDungeon(
            "Crystal Cave",
            "Glimmering cave with powerful crystal monsters",
            Difficulty.Medium,
            25,
            150,
            5000,
            65,
            new uint256[](0)
        );

        // Volcanic Crater - Hard
        _createDungeon(
            "Volcanic Crater",
            "Burning volcano home to fire elemental beasts",
            Difficulty.Hard,
            40,
            400,
            15000,
            50,
            new uint256[](0)
        );

        // Shadow Realm - Nightmare
        _createDungeon(
            "Shadow Realm",
            "A dimension of darkness where only the strongest survive",
            Difficulty.Nightmare,
            75,
            1000,
            50000,
            30,
            new uint256[](0)
        );
    }

    /// @notice Initialize default quests
    function _initializeQuests() internal {
        _createQuest(
            "Daily Training",
            "Complete 3 dungeon runs",
            20,
            50,
            100,
            1
        );
        _createQuest(
            "Monster Hunter",
            "Defeat 5 monsters in battle",
            30,
            100,
            250,
            1
        );
        _createQuest(
            "Collector",
            "Visit the marketplace and make a trade",
            10,
            25,
            50,
            1
        );
        _createQuest(
            "Explorer",
            "Complete any dungeon",
            15,
            40,
            75,
            3
        );
    }

    /// @notice Create a new dungeon
    function _createDungeon(
        string memory name,
        string memory description,
        Difficulty difficulty,
        uint256 energyCost,
        uint256 minPower,
        uint256 rewardPool,
        uint256 winChance,
        uint256[] memory monsterTypes
    ) internal {
        dungeonCount++;
        dungeons[dungeonCount] = Dungeon({
            id: dungeonCount,
            name: name,
            description: description,
            difficulty: difficulty,
            energyCost: energyCost,
            minPower: minPower,
            rewardPool: rewardPool,
            winChance: winChance,
            monsterTypes: monsterTypes,
            isActive: true
        });
        emit DungeonCreated(dungeonCount, name, difficulty);
    }

    /// @notice Create a new quest
    function _createQuest(
        string memory name,
        string memory description,
        uint256 energyCost,
        uint256 experienceReward,
        uint256 tokenReward,
        uint256 dailyLimit
    ) internal {
        questCount++;
        quests[questCount] = Quest({
            id: questCount,
            name: name,
            description: description,
            energyCost: energyCost,
            experienceReward: experienceReward,
            tokenReward: tokenReward,
            dailyLimit: dailyLimit,
            currentCompletions: 0,
            isActive: true,
            criteria: keccak256(bytes(name))
        });
        emit QuestCreated(questCount, name);
    }

    // ==================== DUNGEON FUNCTIONS ====================

    /// @notice Enter a dungeon with a monster
    function enterDungeon(uint256 dungeonId, uint256 tokenId) external nonReentrant {
        Dungeon storage dungeon = dungeons[dungeonId];
        require(dungeon.isActive, "Dungeon not active");
        require(msg.sender == monsterNFT.ownerOf(tokenId), "Not monster owner");

        MonsterNFT.Monster memory monster = monsterNFT.getMonster(tokenId);
        require(monster.isAlive, "Monster is dead");
        require(monster.power >= dungeon.minPower, "Monster too weak");
        require(monster.energy >= dungeon.energyCost, "Not enough energy");

        // Consume energy
        monsterNFT.consumeEnergy(tokenId, dungeon.energyCost);

        emit DungeonEntered(dungeonId, tokenId, msg.sender);
    }

    /// @notice Complete a dungeon run
    function completeDungeon(
        uint256 dungeonId,
        uint256 tokenId,
        bool success,
        uint256 expGained,
        uint256 tokenReward
    ) external onlyOwner nonReentrant {
        Dungeon storage dungeon = dungeons[dungeonId];
        require(dungeon.isActive, "Dungeon not active");

        MonsterNFT.Monster storage monster = monsterNFT.getMonster(tokenId);

        if (success) {
            // Update monster stats
            uint256 powerIncrease = dungeon.rewardPool / 1000; // 0.1% of pool
            monsterNFT.updateMonsterStats(tokenId, expGained, powerIncrease, monster.maxHealth);

            // Update player profile
            PlayerProfile storage player = players[msg.sender];
            player.totalWins++;
            player.dungeonsCompleted++;
            player.totalExperience += expGained;

            // Transfer tokens
            if (tokenReward > 0) {
                token.transfer(msg.sender, tokenReward);
                player.tokensEarned += tokenReward;
            }

            emit DungeonCompleted(dungeonId, tokenId, true, expGained, tokenReward);
        } else {
            // Monster takes damage on failure
            uint256 damage = monster.maxHealth / 2;
            monsterNFT.updateMonsterStats(tokenId, expGained / 2, 0, 0);
            // Health is reduced by damage in the contract

            // Update player profile
            PlayerProfile storage player = players[msg.sender];
            player.totalLosses++;

            emit DungeonCompleted(dungeonId, tokenId, false, expGained / 2, 0);
        }
    }

    /// @notice Add new dungeon (owner only)
    function addDungeon(
        string memory name,
        string memory description,
        Difficulty difficulty,
        uint256 energyCost,
        uint256 minPower,
        uint256 rewardPool,
        uint256 winChance,
        uint256[] memory monsterTypes
    ) external onlyOwner {
        _createDungeon(
            name,
            description,
            difficulty,
            energyCost,
            minPower,
            rewardPool,
            winChance,
            monsterTypes
        );
    }

    // ==================== QUEST FUNCTIONS ====================

    /// @notice Complete a quest
    function completeQuest(uint256 questId) external nonReentrant {
        Quest storage quest = quests[questId];
        require(quest.isActive, "Quest not active");
        require(quest.currentCompletions < quest.dailyLimit, "Quest limit reached");

        PlayerProfile storage player = players[msg.sender];
        require(block.timestamp - player.lastDailyReset >= 24 hours, "Not daily reset");

        // Check daily reset
        if (block.timestamp - player.lastDailyReset >= 24 hours) {
            player.lastDailyReset = block.timestamp;
            quest.currentCompletions = 0;
        }

        // Consume energy
        MonsterNFT.Monster memory monster = monsterNFT.getMonster(0); // Check if player has any monster
        require(monster.energy >= quest.energyCost, "Not enough energy");

        quest.currentCompletions++;
        player.questsCompleted++;
        player.totalExperience += quest.experienceReward;

        // Transfer rewards
        if (quest.tokenReward > 0) {
            token.transfer(msg.sender, quest.tokenReward);
            player.tokensEarned += quest.tokenReward;
        }

        emit QuestCompleted(questId, msg.sender, quest.experienceReward, quest.tokenReward);
    }

    /// @notice Add new quest (owner only)
    function addQuest(
        string memory name,
        string memory description,
        uint256 energyCost,
        uint256 experienceReward,
        uint256 tokenReward,
        uint256 dailyLimit
    ) external onlyOwner {
        _createQuest(name, description, energyCost, experienceReward, tokenReward, dailyLimit);
    }

    // ==================== MARKETPLACE FUNCTIONS ====================

    /// @notice Create a market listing
    function createListing(uint256 tokenId, uint256 price) external nonReentrant {
        require(monsterNFT.ownerOf(tokenId) == msg.sender, "Not monster owner");
        require(price > 0, "Invalid price");

        listingCount++;
        marketListings[listingCount] = MarketListing({
            listingId: listingCount,
            tokenId: tokenId,
            seller: msg.sender,
            price: price,
            isActive: true,
            createdAt: block.timestamp
        });

        monsterNFT.approve(address(this), tokenId);

        emit ListingCreated(listingCount, tokenId, price, msg.sender);
    }

    /// @notice Purchase a listed monster
    function purchaseListing(uint256 listingId) external payable nonReentrant {
        MarketListing storage listing = marketListings[listingId];
        require(listing.isActive, "Listing not active");
        require(msg.value >= listing.price, "Insufficient payment");

        listing.isActive = false;

        // Transfer payment to seller
        payable(listing.seller).transfer(listing.price);

        // Transfer monster to buyer
        monsterNFT.transferFrom(listing.seller, msg.sender, listing.tokenId);

        emit ListingSold(listingId, listing.tokenId, msg.sender, listing.price);
    }

    /// @notice Cancel a listing
    function cancelListing(uint256 listingId) external {
        MarketListing storage listing = marketListings[listingId];
        require(listing.seller == msg.sender, "Not seller");
        require(listing.isActive, "Listing not active");

        listing.isActive = false;

        emit ListingCancelled(listingId, msg.sender);
    }

    // ==================== ENERGY FUNCTIONS ====================

    /// @notice Recharge energy for all monsters of a player
    function rechargeEnergy(uint256 tokenId) external {
        monsterNFT.regenerateEnergy(tokenId);
    }

    // ==================== GETTER FUNCTIONS ====================

    /// @notice Get all active dungeons
    function getActiveDungeons() external view returns (Dungeon[] memory) {
        Dungeon[] memory activeDungeons = new Dungeon[](dungeonCount);
        uint256 count = 0;
        for (uint256 i = 1; i <= dungeonCount; i++) {
            if (dungeons[i].isActive) {
                activeDungeons[count] = dungeons[i];
                count++;
            }
        }
        return activeDungeons;
    }

    /// @notice Get all active quests
    function getActiveQuests() external view returns (Quest[] memory) {
        Quest[] memory activeQuests = new Quest[](questCount);
        uint256 count = 0;
        for (uint256 i = 1; i <= questCount; i++) {
            if (quests[i].isActive) {
                activeQuests[count] = quests[i];
                count++;
            }
        }
        return activeQuests;
    }

    /// @notice Get player profile
    function getPlayerProfile(address player) external view returns (PlayerProfile memory) {
        return players[player];
    }

    /// @notice Get active listings
    function getActiveListings() external view returns (MarketListing[] memory) {
        MarketListing[] memory activeListings = new MarketListing[](listingCount);
        uint256 count = 0;
        for (uint256 i = 1; i <= listingCount; i++) {
            if (marketListings[i].isActive) {
                activeListings[count] = marketListings[i];
                count++;
            }
        }
        return activeListings;
    }
}
