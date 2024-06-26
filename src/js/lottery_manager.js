
import { init } from './core.js';

let App = {};

function render() {

    App.contracts["Lottery"].at(App.lotteryAddress).then(async (instance) => {
        const isRoundStarted = await instance.isRoundStarted();
        let isLotteryDeactivated = await instance.isLotteryDeactivated();
        let duration = await instance.duration();
        if (isLotteryDeactivated) {
            $("#centerBlock").html("<h1>Lottery is deactivated</h1>");
            $("#closeLottery").hide();
        }
        else if (isRoundStarted) {
            const round = await instance.getCurrentBlock();

            if (round.toNumber() >= duration.toNumber()) {
                $("#centerBlock").html("<button id='drawNumbers' type='button' class='btn btn-primary' > DRAW NUMBERS</button > ");
                $("#drawNumbers").click(function () {
                    drawNumbers();
                });
            }

            else {
                $("#centerBlock").html("<h2>" + round + " out of "
                    + duration + " rounds passed </h1>");
            }

        }

        else { //round not started yet, show the start button
            $("#numberRounds").append("<h2>number of blocks: " + duration + "</h2>");
            $("#centerBlock").append("<button id='startRound' type='button' class='btn btn-primary'>START NEW ROUND</button>");
                $("#startRound").click(function () {
                    console.log("hello");
                    startNewRound();
                });
        }


    });
}

// Call a function from a smart contract
// The function send an event that triggers a transaction:: Metamask opens to confirm the transaction by the user
function startNewRound() {
    App.contracts["Lottery"].at(App.lotteryAddress).then(async (instance) => {
        await instance.startNewRound({ from: App.account });
        render();
    });
}
function drawNumbers() {
    App.contracts["Lottery"].at(App.lotteryAddress).then(async (instance) => {
        await instance.drawNumbers({ from: App.account });
        render();
    });

}
function createNewLottery() {
    App.contracts["LotteryFactory"].deployed().then(async (instance) => {
        let rounds = $("#rounds").val();
        let price = $("#price").val();
        await instance.createLottery(price, rounds, { from: App.account });
        render();
    }).catch(generateError);
}

function closeLottery() {
    App.contracts["Lottery"].at(App.lotteryAddress).then(async (instance) => {
        await instance.closeLottery({ from: App.account });
        render();
    });
}

function generateError(error) {
    let string = error.toString();
    let result = string;
    //all this burden because the returned error is a string and not an object...
    if (string.includes("A round is currently in progress")) {
        result = "A round is currently in progress";
    }
    $("#fail").html(result);
    $("#fail").show();
}

$(window).on('load', async function () {
    App = await init();
    render();
});

$("#closeLottery").click(function () {
    closeLottery();
});

$("#createNewLottery").click(function () {
    createNewLottery();
});

$("#startRound").click(function () {
    startNewRound();
});


