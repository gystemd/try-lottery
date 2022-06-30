var App = {

    contracts: {},
    web3Provider: null,             // Web3 provider
    url: 'http://localhost:8545',   // Url for web3
    account: '0x0',                 // current ethereum account
    lotteryAddress: '0x0'
}
    /* initialize Web3 */
    export function initWeb3() {
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

    }

    /* Upload the contract's abstractions */
    export async function initContract() {

        // Get current account
        web3.eth.getCoinbase(function (err, account) {
            if (err == null) {
                App.account = account;
                $("#accountId").html("Your address: " + account);
            }
        });

        // Load content's abstractions
        $.getJSON("LotteryFactory.json").done(async function (c) {
            App.contracts["LotteryFactory"] = TruffleContract(c);
            App.contracts["LotteryFactory"].setProvider(App.web3Provider);

            App.contracts["LotteryFactory"].deployed().then(async (instance) => {
                App.lotteryAddress = await instance.getLotteryAddress();
                let jsonLottery = await $.getJSON("Lottery.json");
                App.contracts["Lottery"] = await TruffleContract(jsonLottery);
                App.contracts["Lottery"].setProvider(App.web3Provider);
                console.log("Lottery address: " + App.lotteryAddress);
                console.log("Lottery = " + App.contracts["Lottery"]);
                return listenForEvents();
            });
        });
    }

    // Write an event listener
    export async function listenForEvents() {
        await App.contracts["Lottery"].at(App.lotteryAddress).then( (instance) => {
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
        return App;
    }


