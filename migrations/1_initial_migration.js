const Migrations = artifacts.require("Migrations");
const Contract = artifacts.require("Lottery");
const Factory = artifacts.require("LotteryFactory");
const NFT = artifacts.require("NFT");
module.exports = async function (deployer,network,accounts) {
  let address = await deployer.deploy(NFT);
  await deployer.deploy(Migrations);
  let factory = await deployer.deploy(Factory, NFT.address,accounts[0]);
  let lottery = await factory.getLotteryAddress();
  let instanceLottery = await Contract.at(lottery);
  await instanceLottery.startNewRound({from:accounts[0]});
  await instanceLottery.buy([1,2,3,4,5,1],{from:accounts[0], value:1000});
  await instanceLottery.buy([6,7,8,9,10,2],{from:accounts[0], value:1000});
  await instanceLottery.buy([11,12,13,14,15,3],{from:accounts[0], value:1000});
  await instanceLottery.buy([16,17,18,19,20,4],{from:accounts[0], value:1000});
  await instanceLottery.buy([21,22,23,24,25,5],{from:accounts[0], value:1000});
}
