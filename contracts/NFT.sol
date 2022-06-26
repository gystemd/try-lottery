pragma solidity >=0.6.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFT is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    mapping(uint256=>string) public descriptions;
    mapping(uint256=>uint256) rank;
    constructor() public ERC721("GameItem", "ITM") {}

    function mint(address owner, string memory description, uint256 rank_) public returns (uint256) {
        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();
        _mint(owner, tokenId);
        descriptions[tokenId]=description;
        rank[tokenId]=rank_;
        return tokenId;
    }

    function getDescription(uint256 tokenId) public view returns (string memory) {
        return descriptions[tokenId];
    }

}
