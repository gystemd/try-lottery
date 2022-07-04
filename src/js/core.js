

export async function init() {
    let App = {
        contracts: {},
        web3Provider: null,             // Web3 provider
        url: 'http://localhost:8545',   // Url for web3
        account: '0x0',                 // current ethereum account
        lotteryAddress: '0x0',
    }

    //initWeb3
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

    //initweb3
    web3.eth.getCoinbase(function (err, account) {
        if (err == null) {
            App.account = account;
            $("#accountId").html("Your address: " + account);
        }
    });

    // Load content's abstractions
    let factorylottery = await $.getJSON("LotteryFactory.json");
    App.contracts["LotteryFactory"] = await TruffleContract(factorylottery);
    App.contracts["LotteryFactory"].setProvider(App.web3Provider);

    await App.contracts["LotteryFactory"].deployed().then(async (instance) => {
        App.lotteryAddress = await instance.getLotteryAddress();
        let jsonLottery = await $.getJSON("Lottery.json");
        App.contracts["Lottery"] = await TruffleContract(jsonLottery);
        App.contracts["Lottery"].setProvider(App.web3Provider);
        App.contracts["Lottery"].at(App.lotteryAddress).then(async (instance) => {

            instance.RoundStarted().on('data', function (event) {
                $("#newRoundToast").toast('show');
            });

            instance.ExtractedNumbers().on('data', function (event) {
                $('#extractedNumbers').html(event.returnValues._numbers.toString());
                $('#extractedNumbersToast').toast('show');
            });

        });
        console.log("app"+App);
    });
    return App;

}