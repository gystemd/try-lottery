import "./Lottery.sol";

contract LotteryFactory {
    Lottery public lottery;
    address NFTAddress;
    constructor(address nft_address, address operator) public{
        lottery = new Lottery(1000, 6, nft_address, operator);
        NFTAddress = nft_address;
    }

    function createLottery(uint256 price, uint256 m) public {
        lottery = new Lottery(price, m, NFTAddress, msg.sender);
    }

    function getLotteryAddress() public view returns (address) {
        return address(lottery);
    }
}
