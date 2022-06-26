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
                $("#myModal").modal('show');
                console.log("Event catched");
                console.log(event);
            });
        });

        return App.render();
    },

    // Get a value from the smart contract
    render: function () {
        $("#tickets").html("");
        App.contracts["Contract"].deployed().then(async (instance) => {
            const tickets = await instance.getTickets({ from: App.account });

            for (let i = 0; i < tickets.length; i++) {
                list = '<ul class="pt-3 list-group list-group-horizontal">';
                numbers = tickets[i].numbers;
                for (let j = 0; j < numbers.length; j++) {
                    list += '<li class="list-group-item">' + numbers[j] + '</li>';
                }
                list += '</ul>';
                $("#tickets").append(list);

                const price = await instance.getPrice();
                console.log("price " + price);
            }

        });
    },

    // Call a function from a smart contract
    // The function send an event that triggers a transaction:: Metamask opens to confirm the transaction by the user
    buy_ticket: function () {
        App.contracts["Contract"].deployed().then(async (instance) => {

            numbers = [
                document.getElementById('n1').value,
                document.getElementById('n2').value,
                document.getElementById('n3').value,
                document.getElementById('n4').value,
                document.getElementById('n5').value,
                document.getElementById('n6').value
            ];

            await instance.buy(numbers, { from: App.account, value: 1000 });
            App.render();
        });
    }

}

// Call init whenever the window loads

$(window).on('load', function () {
    console.log("init");
    App.init();
});