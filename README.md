### Try
The goal of the project is to implement TRY, a lottery offering users collectibles
as winning prizes. The rules of the lottery are inspired by Powerball, a popular
type of lottery played in the United States. The lottery logic is
implemented with a Solidity smart contract on the Ethereum blockchain. Before
operating the lottery, the lottery manager buys a batch of collectibles
and mints a Non Fungible Token (NFT) for each of them. Each lottery’s winner may receive as a prize one of these collectibles. See the rules in `rules.pdf`.
Details regarding the implementation are in the `report.pdf`.

## Folders

- contracts: contains the smart contracts
- - Lottery.sol: The main contract with the lottery logic
- - LotteryFactory.sol: utility contract to create new lotteries
- - NFT.sol: utility contract to mint NFTs
- - Migrations.sol: Truffle's

- migrations: Truffle's migration scripts folder

- src: contains the DApp html, js, and css files

- test: contains the Javascript test scripts

## Test the smart contracts

- Run ganache with ``ganache -p 8545``
- Compile the contracts with ``truffle compile``
- Test with ``truffle test`` or  ``truffle test test/file.js``

## Execute the DApp


- Install the dependencies web3, truffle-contract, lite-server (see package.json) with ``npm install``
- Run ganache with ``ganache -p 8545``
- Compile the contracts with ``truffle compile``
- Migrate the contracts with ``truffle migrate``
- - Be aware the contracts are migrated on ganache at port 8545 (check truffle-config.js)
- - run the lite server with  ``npm run dev``
- - Go to the browser, open Metamask, connect Metamask to ganache and to the DApp (there should be a button "connect to DApp"), and import an account by copying and pasting a ganache private key under "import account"
- - Play with the DApp
