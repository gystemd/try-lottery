import { init } from './core.js';
export let App = {};

$(window).on('load', async function () {
    App = await init();
    getExtractedNumbers();
    $("#navbar").load("navbar.html");
    $("toastDiv").load("toast.html");
});

function getExtractedNumbers() {
    App.contracts["Lottery"].at(App.lotteryAddress).then(async (instance) => {
        const extractedNumbers = await instance.getExtractedNumbers({ from: App.account, gas: 3000000 });
        if (extractedNumbers[0] > 0) {
            $("#centerBlock").html("<h2 class='text-light'>Extracted numbers: " + extractedNumbers + "</h2>");
        }
        else {
            $("#centerBlock").html("<h2>Numbers yet to be extracted</h2>");
        }
    });
}
