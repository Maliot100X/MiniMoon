// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

/// @title MiniMoon Token ($MNMOON)
/// @notice ERC20 token for MiniMoon game economy
contract MiniMoonToken is ERC20, ERC20Burnable, Ownable, ERC20Permit {
    /// @notice Distribution pools
    address public gameRewardsPool;
    address public stakingPool;
    address public communityTreasury;
    address public teamReserve;

    /// @notice Tokenomics
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // 1 Billion
    uint256 public constant INITIAL_REWARD_RATE = 10 * 10**18; // 10 tokens per block

    /// @notice Events
    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);
    event RewardsRateChanged(uint256 newRate);
    event DistributionPoolUpdated(address indexed pool, string poolType);

    constructor()
        ERC20("MiniMoon Token", "MNMOON")
        Ownable(msg.sender)
        ERC20Permit("MiniMoon Token")
    {
        // Mint initial supply to team reserve
        _mint(msg.sender, MAX_SUPPLY);
    }

    /// @notice Set distribution pools (only owner)
    function setDistributionPools(
        address _gameRewardsPool,
        address _stakingPool,
        address _communityTreasury,
        address _teamReserve
    ) external onlyOwner {
        gameRewardsPool = _gameRewardsPool;
        stakingPool = _stakingPool;
        communityTreasury = _communityTreasury;
        teamReserve = _teamReserve;

        emit DistributionPoolUpdated(_gameRewardsPool, "Game Rewards");
        emit DistributionPoolUpdated(_stakingPool, "Staking");
        emit DistributionPoolUpdated(_communityTreasury, "Community Treasury");
        emit DistributionPoolUpdated(_teamReserve, "Team Reserve");
    }

    /// @notice Mint tokens for rewards (only game contract)
    function mintRewards(address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Invalid address");
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    /// @notice Burn tokens
    function burn(uint256 amount) public override onlyOwner {
        super.burn(amount);
        emit TokensBurned(_msgSender(), amount);
    }

    /// @notice Burn tokens from specific address
    function burnFrom(address from, uint256 amount) public override onlyOwner {
        super.burnFrom(from, amount);
        emit TokensBurned(from, amount);
    }

    /// @notice Transfer tokens with game fee
    function transferWithFee(
        address to,
        uint256 amount,
        uint256 feePercent
    ) external returns (uint256 fee) {
        require(feePercent <= 100, "Invalid fee");
        uint256 feeAmount = (amount * feePercent) / 100;
        uint256 transferAmount = amount - feeAmount;

        _transfer(_msgSender(), to, transferAmount);
        _transfer(_msgSender(), communityTreasury, feeAmount);

        return feeAmount;
    }

    /// @notice Get balance of address
    function balanceOf(address account) public view override returns (uint256) {
        return super.balanceOf(account);
    }

    /// @notice Check if token transfer is allowed
    function beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal view override {
        // Custom logic can be added here (e.g., trading restrictions)
    }

    /// @notice Get token name
    function name() public view override returns (string memory) {
        return "MiniMoon Token";
    }

    /// @notice Get token symbol
    function symbol() public view override returns (string memory) {
        return "MNMOON";
    }

    /// @notice Get token decimals
    function decimals() public view override returns (uint8) {
        return 18;
    }
}
