import "./Lottery.sol";

contract LotteryFactory {
    Lottery public lottery;
    
    constructor() public{
        lottery = new Lottery(15, 1000);
    }

    function createLottery(uint256 price, uint256 m) public {
        lottery = new Lottery(price, m);
    }

    function getLotteryAddress() public view returns (address) {
        return address(lottery);
    }
}
