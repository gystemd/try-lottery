
import { init } from './core.js';

let App = {};

function getNFTList() {
    App.contracts["Lottery"].at(App.lotteryAddress).then(async (instance) => {
        const descriptions = await instance.getNFTDescription({ from: App.account });
        console.log(descriptions);
        for (let i = 0; i < descriptions.length; i++) {
            $("#rowBlock").append(
                "<div class='col-md-4'>" +
                "<div class='card' style='width: 18rem'>" +
                "<div class='card-body'>" +
                "<h5 class='card-title'>" + descriptions[i] + "</h5>" +
                "<p class='card-text'>" +
                "A beautiful NFT with image:" + descriptions[i] +
                "</p>" +
                "</div></div></div>");
        }
    });
}

$(window).on('load', async function () {
    App = await init();
    getNFTList();
});