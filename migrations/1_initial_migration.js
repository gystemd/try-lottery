const Migrations = artifacts.require("Migrations");
const Contract = artifacts.require("Lottery");
const Factory = artifacts.require("LotteryFactory");
const NFT = artifacts.require("NFT");
module.exports = async function (deployer, network, accounts) {
  let address = await deployer.deploy(NFT);
  await deployer.deploy(Migrations);
  let factory = await deployer.deploy(Factory, NFT.address, accounts[0], 15, 1000);
  /*
  let lottery = await factory.getLotteryAddress();
  let instanceLottery = await Contract.at(lottery);
  await instanceLottery.startNewRound({ from: accounts[0] });
  await instanceLottery.buy([1, 2, 3, 4, 5, 1], { from: accounts[0], value: 1000 });
  await instanceLottery.buy([6, 7, 8, 9, 10, 2], { from: accounts[0], value: 1000 });
  await instanceLottery.buy([11, 12, 13, 14, 15, 3], { from: accounts[0], value: 1000 });
  await instanceLottery.buy([16, 17, 18, 19, 20, 4], { from: accounts[0], value: 1000 });
  await instanceLottery.buy([21, 22, 23, 24, 25, 5], { from: accounts[0], value: 1000 });
  await instanceLottery.buy([26, 27, 28, 29, 30, 6], { from: accounts[1], value: 1000 });
  await instanceLottery.buy([31, 32, 33, 34, 35, 7], { from: accounts[1], value: 1000 });
  await instanceLottery.buy([36, 37, 38, 39, 40, 8], { from: accounts[1], value: 1000 });
  await instanceLottery.buy([41, 42, 43, 44, 45, 9], { from: accounts[1], value: 1000 });
  await instanceLottery.buy([46, 47, 48, 49, 50, 10], { from: accounts[1], value: 1000 });
  await instanceLottery.buy([51, 52, 53, 54, 55, 11], { from: accounts[1], value: 1000 });
  await instanceLottery.buy([56, 57, 58, 59, 60, 12], { from: accounts[1], value: 1000 });
  await instanceLottery.buy([61, 62, 63, 64, 65, 13], { from: accounts[1], value: 1000 });
  await instanceLottery.buy([66, 67, 68, 69, 1, 14], { from: accounts[1], value: 1000 });
  */
}
