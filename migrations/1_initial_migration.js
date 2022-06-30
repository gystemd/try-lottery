const Migrations = artifacts.require("Migrations");
const Contract = artifacts.require("Lottery");
const Factory = artifacts.require("LotteryFactory");
module.exports = function (deployer,network,accounts) {
  deployer.deploy(Migrations);
  deployer.deploy(Factory);
}
