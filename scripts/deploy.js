const { ethers } = require('hardhat');

async function main() {
  console.log('🎮 MiniMoon Game Deployment');
  console.log('============================\n');

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log(`📝 Deploying contracts with account: ${deployer.address}`);
  console.log(`💰 Account balance: ${(await ethers.provider.getBalance(deployer.address)).toString()}\n`);

  // Deploy MonsterNFT
  console.log('🚀 Deploying MonsterNFT...');
  const MonsterNFT = await ethers.getContractFactory('MonsterNFT');
  const monsterNFT = await MonsterNFT.deploy();
  await monsterNFT.waitForDeployment();
  const monsterNFTAddress = await monsterNFT.getAddress();
  console.log(`✅ MonsterNFT deployed to: ${monsterNFTAddress}\n`);

  // Deploy MiniMoonToken
  console.log('🚀 Deploying MiniMoonToken...');
  const MiniMoonToken = await ethers.getContractFactory('MiniMoonToken');
  const token = await MiniMoonToken.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log(`✅ MiniMoonToken deployed to: ${tokenAddress}\n`);

  // Deploy MiniMoonGame
  console.log('🚀 Deploying MiniMoonGame...');
  const MiniMoonGame = await ethers.getContractFactory('MiniMoonGame');
  const game = await MiniMoonGame.deploy(monsterNFTAddress, tokenAddress);
  await game.waitForDeployment();
  const gameAddress = await game.getAddress();
  console.log(`✅ MiniMoonGame deployed to: ${gameAddress}\n`);

  // Set game contract in MonsterNFT
  console.log('🔗 Setting game contract in MonsterNFT...');
  await monsterNFT.setGameContract(gameAddress);
  console.log('✅ Game contract set successfully\n');

  // Set distribution pools in Token
  console.log('🏦 Setting distribution pools in Token...');
  await token.setDistributionPools(
    gameAddress, // gameRewardsPool
    deployer.address, // stakingPool (temporary)
    deployer.address, // communityTreasury (temporary)
    deployer.address  // teamReserve (temporary)
  );
  console.log('✅ Distribution pools set successfully\n');

  // Mint initial tokens for rewards
  console.log('💎 Minting initial reward tokens...');
  const rewardAmount = ethers.parseEther('100000000'); // 100M tokens for rewards
  await token.mintRewards(gameAddress, rewardAmount);
  console.log(`✅ Minted ${rewardAmount.toString()} tokens to game contract\n`);

  // Verify contracts on Basescan (if on mainnet)
  const network = await ethers.provider.getNetwork();
  if (network.chainId === 8453n) {
    console.log('🔍 Verifying contracts on Basescan...');
    try {
      await hre.run('verify:verify', {
        address: monsterNFTAddress,
        constructorArguments: [],
      });
    } catch (e) {
      console.log('⚠️ MonsterNFT verification skipped (may already be verified)');
    }

    try {
      await hre.run('verify:verify', {
        address: tokenAddress,
        constructorArguments: [],
      });
    } catch (e) {
      console.log('⚠️ MiniMoonToken verification skipped (may already be verified)');
    }

    try {
      await hre.run('verify:verify', {
        address: gameAddress,
        constructorArguments: [monsterNFTAddress, tokenAddress],
      });
    } catch (e) {
      console.log('⚠️ MiniMoonGame verification skipped (may already be verified)');
    }
  }

  // Print summary
  console.log('============================');
  console.log('🎉 Deployment Complete!');
  console.log('============================');
  console.log('\n📋 Contract Addresses:');
  console.log(`   MonsterNFT:    ${monsterNFTAddress}`);
  console.log(`   MiniMoonToken: ${tokenAddress}`);
  console.log(`   MiniMoonGame:  ${gameAddress}`);
  console.log('\n🔧 Next Steps:');
  console.log('1. Update .env with the contract addresses');
  console.log('2. Update frontend configuration');
  console.log('3. Verify contracts on Basescan');
  console.log('4. Start the game!\n');

  // Return addresses for frontend configuration
  return {
    monsterNFT: monsterNFTAddress,
    token: tokenAddress,
    game: gameAddress,
  };
}

main()
  .then((addresses) => {
    console.log('\n📦 Exiting deployment script...');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Deployment failed!');
    console.error(error);
    process.exit(1);
  });
