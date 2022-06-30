const Migrations = artifacts.require("Migrations");
const Contract = artifacts.require("Lottery");
const Factory = artifacts.require("LotteryFactory");
const NFT = artifacts.require("NFT");
module.exports = async function (deployer,network,accounts) {
  let address = await deployer.deploy(NFT);
  await deployer.deploy(Migrations);
  await deployer.deploy(Factory, NFT.address,accounts[0]);
}
