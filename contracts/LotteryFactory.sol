import "./Lottery.sol";

contract LotteryFactory {
    Lottery public lottery;
    address NFTAddress;
    constructor(address nft_address) public{
        lottery = new Lottery(15, 1000, nft_address);
        NFTAddress = nft_address;
    }

    function createLottery(uint256 price, uint256 m) public {
        lottery = new Lottery(price, m, NFTAddress);
    }

    function getLotteryAddress() public view returns (address) {
        return address(lottery);
    }
}
