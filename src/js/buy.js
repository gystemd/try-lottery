import { init } from './core.js';
let App = {};

function render() {
    $("#tickets").html("");
    App.contracts["Lottery"].at(App.lotteryAddress).then(async (instance) => {
        const tickets = await instance.getTickets({ from: App.account });
        const price = await instance.price();
            $("#price").html("<h2 class='pl-2'>Price:"+price+" wei</h2>");
            console.log("price " + price);

        for (let i = 0; i < tickets.length; i++) {
            let list = '<ul class="pt-3 list-group list-group-horizontal">';
            let numbers = tickets[i].numbers;
            for (let j = 0; j < numbers.length; j++) {
                list += '<li class="list-group-item">' + numbers[j] + '</li>';
            }
            list += '</ul>';
            $("#tickets").append(list);

        }

    });
}

// Call a function from a smart contract
// The function send an event that triggers a transaction:: Metamask opens to confirm the transaction by the user
function buy_ticket() {
    App.contracts["Lottery"].at(App.lotteryAddress).then(async (instance) => {
        console.log(document.getElementById('n6').value);
        let numbers = [
            document.getElementById('n1').value,
            document.getElementById('n2').value,
            document.getElementById('n3').value,
            document.getElementById('n4').value,
            document.getElementById('n5').value,
            document.getElementById('n6').value
        ];

        try {
            let price = await instance.price();
            await instance.buy(numbers, { from: App.account, value: price });
        } catch (error) {
            let string = error.toString();
            let result = null;
            if (string.includes("The round is not started yet")) {
                result = "The round is not started yet";
            }
            else if (string.includes("Round not active")) {
                result = "The round is not active";
            }
            else if (string.includes("Lottery has been cancelled")) {
                result = "The lottery has been cancelled";
            }
            $("#failBuy").html(result);
            $("#failBuy").show();
        }
        render();
    });
}

$(window).on('load', async function () {
    App = await init();
    render();
});

$("#buyTicket").click(function () {
    buy_ticket();
});
