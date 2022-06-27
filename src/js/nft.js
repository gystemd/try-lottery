
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

        });

        return App.render();
    },


    render: function () {
        App.getNFTList();
    },

    getNFTList: function () {
        App.contracts["Contract"].deployed().then(async (instance) => {
            const descriptions = await instance.getNFTDescription();
            for (let i = 0; i < descriptions.length; i++) {
                $("#rowBlock").append(
                    "<div class='col-md-4'>" +
                    "<div class='card' style='width: 18rem'>" +
                    "<div class='card-body'>" +
                    "<h5 class='card-title'>"+descriptions[i]+"</h5>" +
                    "<p class='card-text'>" +
                    "A beautiful NFT with image:" +descriptions[i] +
                    "</p>" +
                    "</div></div></div>");
            }
        });
    }

}

// Call init whenever the window loads

$(window).on('load', function () {
    console.log("init");
    App.init();
});