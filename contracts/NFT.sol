pragma solidity >=0.6.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFT is ERC721 {
    uint256 private _tokenIds;
    mapping(uint256 => string) public descriptions;
    mapping(uint256 => uint256) rank;
    mapping(address => uint256[]) address_nft;

    constructor() public ERC721("GameItem", "ITM") {}

    function mint(
        address owner,
        string memory description,
        uint256 rank_
    ) public returns (uint256) {
        _tokenIds+=1;
        uint256 tokenId = _tokenIds;
        _mint(owner, tokenId);
        descriptions[tokenId] = description;
        rank[tokenId] = rank_;
        return tokenId;
    }

    function getDescription(uint256 tokenId)
        public
        view
        returns (string memory)
    {
        return descriptions[tokenId];
    }

    function getNFTFromAddress(address owner)
        public
        view
        returns (string[] memory)
    {
        string[] memory descriptions_ = new string[](address_nft[owner].length);
        uint256[] memory nft_list = address_nft[owner];
        for (uint256 i = 0; i < nft_list.length; i++) {
            string memory a = descriptions[nft_list[i]];
            descriptions_[i] = a;
        }
        return descriptions_;
    }

    function addNFTtoAddress(address _address, uint256 _tokenId) public {
        address_nft[_address].push(_tokenId);
    }
}
