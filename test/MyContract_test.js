const MyContract = artifacts.require("MyContract");

contract("Testing MyContract", function(accounts) {

    const alice = accounts[0];

    describe("Testing increase() function", function() {

        it("Should increase the value correctly with input > 0", async function() {

            // 1. Set a valid state
            const instance = await MyContract.new();
            // 2. Execute the function to test
            await instance.increase(41);
            // 3. Test the result
            const res = await instance.value();
            assert.equal(res.toNumber(), 42, "The result should be 42");
        });

        it("Should apply the square with input == 0", async function() {

            // 1. Set a valid state
            const instance = await MyContract.new();
            // 2. Execute the function to test
            await instance.increase(0);
            // 3. Test the result
            const res = await instance.value();
            assert.equal(res.toNumber(), 1, "The result should be 42");
        });
    });
});