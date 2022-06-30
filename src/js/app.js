App = {

    contracts: {},
    web3Provider: null,             // Web3 provider
    url: 'http://localhost:8545',   // Url for web3
    account: '0x0',                 // current ethereum account

    init: function () {
        console.log("init");
        return App.initWeb3();
    },

    /* initialize Web3 */
    initWeb3: function () {
        console.log("Entered")

        if (typeof web3 != 'undefined') {
            App.web3Provider = window.ethereum;
            web3 = new Web3(App.web3Provider);
            try {
                ethereum.enable().then(async () => {
                    console.log("DApp connected to Metamask");
                });
            }
            catch (error) {
                console.log(error);
            }
        } else {
            App.web3Provider = new Web3.providers.HttpProvider(App.url); // <==
            web3 = new Web3(App.web3Provider);
        }

        return App.initContract();
    },

    /* Upload the contract's abstractions */
    initContract: function () {

        // Get current account
        web3.eth.getCoinbase(function (err, account) {
            if (err == null) {
                App.account = account;
                $("#accountId").html("Your address: " + account);
            }
        });

        // Load content's abstractions
        $.getJSON("Lottery.json").done(function (c) {
            App.contracts["Contract"] = TruffleContract(c);
            App.contracts["Contract"].setProvider(App.web3Provider);

            return App.listenForEvents();
        });
    },

    // Write an event listener
    listenForEvents: function () {
        App.contracts["Contract"].deployed().then(async (instance) => {
            instance.RoundStarted().on('data', function (event) {
                $('.toast').toast('show');
                console.log("Event catched");
                console.log(event);
            });

            instance.Winner().on('data', function (event) {

                console.log("Event catched");
                console.log(event);
            });


        });

        return App.render();
    },


    render: function () {

        App.contracts["Contract"].deployed().then(async (instance) => {
            const isRoundFinished = await instance.getRoundFinished();
            if (!isRoundFinished) {
                const round = await instance.getCurrentBlock();
                console.log(round);
                const duration = await instance.getDuration();
                console.log("duration" + duration);
                if (round.toNumber() >= duration.toNumber()) {

                    $("#centerBlock").html("<h2>Ready to draw numbers</h2><button id='startRound' type='button' onclick = 'App.drawNumbers()' class= 'btn btn-primary' > DRAW NUMBERS</button > ");
                }
                else {
                    $("#centerBlock").html("<h2>" + round + " out of "
                        + duration + " rounds passed </h1>");
                }
            }
            else
                $("#centerBlock").html("<button id='startRound' type='button' onclick='App.startNewRound()' class='btn btn-primary'>START NEW ROUND</button>");

        });
    },

    // Call a function from a smart contract
    // The function send an event that triggers a transaction:: Metamask opens to confirm the transaction by the user
    startNewRound: function () {
        App.contracts["Contract"].deployed().then(async (instance) => {
            console.log("round started");
            await instance.startNewRound({ from: App.account });
            App.render();
        });
    },
    drawNumbers: function () {
        App.contracts["Contract"].deployed().then(async (instance) => {
            await instance.drawNumbers({ from: App.account });
        });

    }

}

// Call init whenever the window loads

$(window).on('load', function () {
    console.log("init");
    App.init();
});