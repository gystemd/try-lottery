// Testing the contract
    // Invoking its functions and check they work as intended

// Truffle exclusive command: fetch the compilation from build/contracts
    // The result is the "class" (template) of the contract
    // In "" the name of the file in build/contracts, which is the same of the name of the contract and not of the solidity source file
const NFT_Template = artifacts.require("NFT")

// Testing environment is and extension of Mocha, javascript
// Test a contract
    // the callback of contract() accepts in input the array of accounts, addresses, used in testing
        // e.g. taken from ganache
contract("NFT", function(accounts) {

    const expected_NFT_value = 1000000000000000;
    const alice = accounts[1]
    const bob = accounts[2]

    // Test a function
    describe("Constructor", function() {
        
        it("Should create the contract correctly", async function() {

            // Create a contract with truffle
            const NFT_Instance = await NFT_Template.new()
            // The result is a concrete smart contract instance (i.e.  an object)

            // Call its functions
                // uint are 256 bits, too big
                // therefore, the type used is BN (Big Number)
                // need to transform it in iteger
                // or in string if it is too big
            
            // For assertions look for Javascript Chai
            const got_NFT_value = (await NFT_Instance.NFT_value()).toNumber()

            console.log(got_NFT_value)
            assert.equal(got_NFT_value, expected_NFT_value, "NFT value should be " + expected_NFT_value)
        })

        it("Should create the contract correctly from a different address", async function() {

            // Metadata to the functions to set parameters like
                // from: the sender address
                // value: the amount of *wei* sent to payable functions
                // gas: the gas limit 
                // gasprice: the gas price
            const NFT_Instance = await NFT_Template.new({from: alice})
            console.log("Alice account: " + alice)

            const alice_NFTs = await NFT_Instance.listMyNFTs({from: alice})
            const alice_NFTs2 = await NFT_Instance.listNFTsOf(alice, {from: bob})

            console.log("NFTs as BN:")
            console.log(alice_NFTs)
            console.log("NFTs as numbers:")
            alice_NFTs.forEach(nft => console.log(nft.toNumber()))
        })

    })

    // Test a function
    describe("buyNFT", function() {
        
        it("Should buy an NFT of code 420", async function() {

            const nft = 420

            // Metadata to the functions to set parameters like
                // from: the sender address
                // value: the amount of *wei* sent to payable functions
                // gas: the gas limit 
                // gasprice: the gas price
            const NFT_Instance = await NFT_Template.new({from: alice})
            // value: express the amount in wei to send with the transaction (required for payable functions)
            const result = await NFT_Instance.buyNFT(nft, {from: bob, value: expected_NFT_value})
            console.log(result.logs[0].args)

            // const bob_NFTs = await NFT_Instance.listMyNFTs({from: bob})
            // console.log(bob_NFTs)
            // console.log(result.logs[0].args)
            // assert.equal(result, true, "NFT purchase should go well")
        })

    })    
})

// {
//     tx: '0x4606a6ff066402d64d1e7cdb0b77484b27efdd361b52bba11a21b53af9fcf0d8',
//     receipt: {
//       transactionHash: '0x4606a6ff066402d64d1e7cdb0b77484b27efdd361b52bba11a21b53af9fcf0d8',
//       transactionIndex: 0,
//       blockNumber: 35,
//       blockHash: '0xef7d164e35e3f1f16c7a18184682a8df37c1e3f4444ce7e7469e31eb17682801',
//       from: '0xe8a57428ba0ba74a1d22bfdecadd6756abf83a4f',
//       to: '0x4012e0810138f0be432960098f557a87cb6a4476',
//       cumulativeGasUsed: 91932,
//       gasUsed: 91932,
//       contractAddress: null,
//       logs: [ [Object] ],
//       logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000010000000000000000000000000',
//       status: true,
//       effectiveGasPrice: '0x959a828b',
//       type: '0x2',
//       rawLogs: [ [Object] ]
//     },
//     logs: [
//       {
//         address: '0x4012e0810138f0bE432960098F557a87Cb6a4476',
//         blockHash: '0xef7d164e35e3f1f16c7a18184682a8df37c1e3f4444ce7e7469e31eb17682801',
//         blockNumber: 35,
//         logIndex: 0,
//         removed: false,
//         transactionHash: '0x4606a6ff066402d64d1e7cdb0b77484b27efdd361b52bba11a21b53af9fcf0d8',
//         transactionIndex: 0,
//         id: 'log_49b61d7c',
//         event: 'NFTBought',
//         args: [Result]
//       }
//     ]
//   }