import "./Lottery.sol";

contract LotteryFactory {
    Lottery public lottery;
    address NFTAddress;
    event LotteryCreated();
    constructor(address nft_address, address operator, uint round, uint price) public{
        lottery = new Lottery(price, round, nft_address, operator);
        NFTAddress = nft_address;
    }

    function createLottery(uint256 price, uint256 m) public {
        require(m > 0);
        require(price>0);
        require(!lottery.isRoundStarted(), "A round is currently in progress");
        lottery = new Lottery(price, m, NFTAddress, msg.sender);
        emit LotteryCreated();
    }

    function getLotteryAddress() public view returns (address) {
        return address(lottery);
    }
}
