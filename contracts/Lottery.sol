// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./NFT.sol";

contract Lottery {
    NFT public nft;

    struct Ticket {
        uint256[] numbers;
        uint256 winningNumbers;
        address payable buyer;
        bool powerBallMatch;
    }

    address operator;
    address payable recipient =
        payable(0xdD870fA1b7C4700F2BD7f44238821C26f7392148);

    event RoundStarted();
    event Winner(address winner, uint256 id);
    event NumberExtracted(uint256 number);
    event NFTAssigned(uint256 tokenID, uint256 class);

    //used to map an nft to a class of the lottery
    mapping(uint256 => uint256) private classes;
    mapping(address => Ticket[]) private ticket_map;

    bool private isRoundFinished;
    bool private isLotteryDeactivated;

    uint256 private initialBlock;
    uint256 public duration;
    uint256 public price;
    uint256 public extractedPowerBall;

    Ticket[] private tickets;
    address[] private participants;
    uint256[] public extractedNumbers;
    uint256[] classesAssign = [0, 1, 2, 3, 3, 4, 4, 5, 5, 6, 7]; //used to assign classes randomly

    constructor(uint256 _price, uint256 _duration) public {
        operator = msg.sender;
        nft = new NFT();
        duration = _duration;
        price = _price;
        extractedPowerBall = 0;
        isLotteryDeactivated = false;
        isRoundFinished = true;
        //
        for (uint256 i = 0; i < 8; i++) {
            //minting 11 NFTs
            //concat "NFT" with i to create the tokenID
            uint256 token_id = mint("NFT", i);
            classes[i].push(token_id);
        }
    }

    function startNewRound() public {
        require(!isLotteryDeactivated, "Lottery has been cancelled");
        require(
            msg.sender == operator,
            "Only the operator can start a new round"
        );
        require(isRoundFinished, "The previous round is not finished yet");

        isRoundFinished = false;
        initialBlock = block.number;
        emit RoundStarted();
    }

    function buy(uint256[] memory numbers) public payable {
        require(!isLotteryDeactivated, "Lottery has been cancelled");
        require(block.number - initialBlock <= duration, "Round not active");
        require(numbers.length == 6, "Invalid number of numbers");
        require(msg.value >= price, "Invalid price");

        for (uint256 i = 0; i < 5; i++) {
            require(
                numbers[i] >= 1 && numbers[i] <= 69,
                "Numbers must be in the range 1-69"
            );
        }

        for (uint256 i = 0; i < 5; i++) {
            for (uint256 j = 0; j < 5; j++) {
                if (i != j) {
                    require(
                        numbers[i] != numbers[j],
                        "Numbers must be all different"
                    );
                }
            }
        }

        require(
            numbers[5] >= 1 && numbers[5] <= 26,
            "Powerball number must be comprised in the range 1-26"
        );

        Ticket memory ticket = Ticket(numbers, 0, payable(msg.sender), false);

        if (ticket_map[msg.sender].length == 0) {
            participants.push(msg.sender);
        }

        ticket_map[msg.sender].push(ticket);
        tickets.push(ticket);
    }

    function mint(string memory description, uint256 rank_)
        public
        returns (uint256)
    {
        require(!isLotteryDeactivated, "Lottery has been cancelled");
        require(msg.sender == operator, "Only the operator can mint new Items");

        uint256 tokenId_ = nft.mint(address(this), description, rank_);
        return tokenId_;
    }

    function drawNumber() public returns (uint256) {
        require(!isLotteryDeactivated, "Lottery has been cancelled");
        require(
            msg.sender == operator,
            "Only the operator can draw the numbers"
        );
        require(extractedNumbers.length < 5, "All numbers already extracted");

        uint256 seed = generateSeed();
        uint256 number = (seed - ((seed / 69) * 69));

        //check whether number has already been extracted
        for (uint256 i = 0; i < extractedNumbers.length; i++) {
            require(number != extractedNumbers[i], "number already extracted");
        }

        emit NumberExtracted(number);

        extractedNumbers.push(number);
        return number;
    }

    function drawPowerBall() public returns (uint256) {
        require(!isLotteryDeactivated, "Lottery has been cancelled");
        require(
            msg.sender == operator,
            "Only the operator can draw the numbers"
        );
        require(extractedNumbers.length == 5, "Numbers yet to be extracted");
        require(extractedPowerBall == 0, "Powerball already extracted");

        uint256 seed = generateSeed();
        uint256 number = (seed - ((seed / 26) * 26));
        extractedPowerBall = number;
        emit NumberExtracted(extractedPowerBall);
        return extractedPowerBall;
    }

    function givePrizes() public {
        require(!isLotteryDeactivated, "Lottery has been cancelled");
        require(!isRoundFinished, "Round finished");
        require(
            msg.sender == operator,
            "Only the operator can give the prizes"
        );
        require(extractedNumbers.length == 5, "Numbers not extracted yet");
        require(extractedPowerBall != 0, "PowerBall not extracted yet");

        checkNumbers();
        for (uint256 i = 0; i < participants.length; i++) {
            address participant = participants[i];
            for (uint256 j = 0; j < ticket_map[participant].length; j++) {
                uint256 winningNumbers = ticket_map[participant][j]
                    .winningNumbers;
                bool powerBallMatch = ticket_map[participant][j].powerBallMatch;

                if (winningNumbers == 5 && powerBallMatch) {
                    //class 1
                    awardItem(0, participant);
                } else if (winningNumbers == 5)
                    //class 2
                    awardItem(1, participant);
                else if (winningNumbers == 4 && powerBallMatch)
                    //class 3
                    awardItem(2, participant);
                else if (
                    winningNumbers == 4 ||
                    (winningNumbers == 3 && powerBallMatch)
                )
                    //class 4
                    awardItem(3, participant);
                else if (
                    winningNumbers == 3 ||
                    (winningNumbers == 2 && powerBallMatch)
                )
                    //class 5
                    awardItem(4, participant);
                else if (
                    winningNumbers == 2 ||
                    (winningNumbers == 1 && powerBallMatch)
                )
                    //class 6
                    awardItem(5, participant);
                else if (winningNumbers == 1)
                    //class 7
                    awardItem(6, participant);
                else if (powerBallMatch) {
                    //class 8
                    awardItem(7, participant);
                }
            }
        }
        isRoundFinished = true;
        recipient.send(address(this).balance);
    }

    function closeLottery() public {
        require(!isLotteryDeactivated);
        require(msg.sender == operator);
        isLotteryDeactivated = true;

        //refund all the tickets
        for (uint256 i = 0; i < tickets.length; i++) {
            tickets[i].buyer.send(price);
        }
    }

    function awardItem(uint256 classNumber, address winner) private {
        if (classes[classNumber].length == 0) {
            //prizes for that class are finished, need to generate a new one
            uint256 tokenId = nft.mint(winner, "NewNFT", classNumber);
            emit Winner(winner, tokenId);
        } else {
            uint256 tokenId = (classes[classNumber])[
                classes[classNumber].length - 1
            ];
            classes[classNumber].pop();
            nft.transferFrom(address(this), winner, tokenId);
            emit Winner(winner, tokenId);
        }
    }

    function checkNumbers() public {
        /*this function compare every number of a ticket against the extracted numbers
        and increment winningNumbers, which will be used later to know which prize it
        has to assing to the ticket (and therefore to the address of that ticket) */
        for (uint256 i = 0; i < participants.length; i++) {
            Ticket[] storage Tickets = ticket_map[participants[i]];
            for (uint256 j = 0; j < Tickets.length; j++) {
                uint256 winningNumbers = 0;
                for (uint256 k = 0; k < 5; k++) {
                    for (uint256 z = 0; z < 5; z++) {
                        if (Tickets[j].numbers[k] == extractedNumbers[z]) {
                            winningNumbers++;
                        }
                    }
                }
                Tickets[j].powerBallMatch = (Tickets[j].numbers[5] ==
                    extractedPowerBall);
                Tickets[j].winningNumbers = winningNumbers;
            }
        }
    }

    function generateSeed() private returns (uint256) {
        uint256 seed = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp +
                        block.difficulty +
                        ((
                            uint256(keccak256(abi.encodePacked(block.coinbase)))
                        ) / (block.timestamp)) +
                        block.gaslimit +
                        ((uint256(keccak256(abi.encodePacked(msg.sender)))) /
                            (block.timestamp)) +
                        block.number
                )
            )
        );

        return seed;
    }

    function getTickets() public view returns (Ticket[] memory) {
        return ticket_map[msg.sender];
    }

    function getPrice() public view returns (uint256) {
        return price;
    }

    function getRoundFinished() public view returns (bool) {
        return isRoundFinished;
    }

    function getCurrentBlock() public view returns (uint256) {
        uint256 current = block.number - initialBlock;
        if (current > 0) return current;
        return 0;
    }

    function getDuration() public view returns (uint256) {
        return duration;
    }

    function getExtractedNumbers() public view returns (uint256[] memory) {
        return extractedNumbers;
    }

    function getNFTs() public view returns (string[] memory) {
        string[] memory descriptions_;
        for (uint256 i = 0; i < 8; i++) {
            string memory a = nft.getDescription(classes[i][0]);
            descriptions_[i] = a;
        }
        return descriptions_;
    }
}
