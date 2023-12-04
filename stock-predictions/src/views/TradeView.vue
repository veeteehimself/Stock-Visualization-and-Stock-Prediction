<script setup>
import axios from 'axios';
import auth from '../auth';
import {reactive,onMounted} from 'vue';
import portfolio from '../portfolio';

const stockData = reactive({
    ticker: 'IBM',
    price: 0,
});

const data = reactive({
    total_money: 0
});


let username = reactive({value: ""});
const getUserFromToken = async () => {
    try {
        const res = await axios({
            method: "GET",
            headers: {
                Authorization: `Bearer ${auth.token}`
            },
            url: "http://localhost:8080/users/view"
        });

        if(res.status === 200) {
            username.value = res["data"]["username"] + "\'s"
        }
        
    } catch(error) {
        console.log(error);
        auth.failed = true;
    }
}


const formatDate = (date) => date.split("T")[0].split("-").join("/");

const getStockPrice = async (ticker, date) => {
    try {
        const res = await axios({
            method: "GET",
            url: `http://localhost:8080/stock?ticker=${ticker}`
        })
        const { prices, dates } = res.data;

        if(dates.indexOf(formatDate(date))===-1){
            console.log("didn't contain")
            return prices[prices.length-1];
        }

        // console.log(console.log(res.data.data));
        return prices[dates.indexOf(formatDate(date))];
    } catch (error) {
        console.log(error);
    }
}
const updateStock = async () => {
    try {
        console.log(stockData.ticker)
        const { data } = await axios({
        method: 'GET',
        url: `http://localhost:8080/stock?ticker=${stockData.ticker}`,

    });
        const { prices } = data;
        console.log("didn't contain")
        stockData.price = prices[prices.length-1];
        return
    } catch (error) {
        console.log(error);
    }
}

const getLatestStockPrice = async (ticker, date) => {
    try {
        const res = await axios({
            method: "GET",
            url: `http://localhost:8080/stock?ticker=${ticker}`
        })
        const { prices, dates } = res.data;

        console.log(dates.indexOf(formatDate(date)))
        console.log(prices[dates.indexOf(formatDate(date))])
        return prices[prices.length - 1];
    } catch (error) {
        console.log(error);
    }
}

// what if you always got the latest stocks?


const buyStock = async () => {
    try {
        stockData.price = await getLatestStockPrice(stockData.ticker, new Date(Date.now()).toISOString())
        // stockData.price = stockData[]
        stockData.price = Number(stockData.price)
        data.total_money = Number(data.total_money)
        // console.log(stockData.ticker)
        // console.log("the stock data price is:"+stockData.price )
        // console.log('the total price is:'+authStatus.total_money)
        // console.log(authStatus.total_money > stockData.price)
        if (data.total_money > stockData.price){
            const res = await axios({
            method: "POST",
            headers: {
                Authorization: `Bearer ${auth.token}`
            },
            url: "http://localhost:8080/positions/",
            data: {ticker:stockData.ticker}
            });

            if (res.status === 200) {
                auth.status.success = true;
                data.total_money -= stockData.price
                data.total_money = data.total_money.toFixed(2)
            } else {
                auth.status.failed = true;
            }
        } else{
            console.log('YOU DONT HAVE ENOUGH MONEY TO BUY THIS STOCK')
        }} catch(error) {
                console.log(error);
                auth.failed = true;
            }
        }

// const sellStock = async () => {
//     try {
//         console.log(12312321)
//         const res = await axios({
//             method: "GET",
//             headers: {
//                 Authorization: `Bearer ${auth.token}`
//             },
//             url: "http://localhost:8080/users/view"+"?username=" + username.value
//         });
//         if (res.status === 200) {
//             authStatus.success = true;
//             if(res.data.length > 0 ){
//                 for (const position of res.data) {
//                 openingPrice = await getStockPrice(position.ticker, position.opened),
//                 closingPrice = position.closed ? await getStockPrice(position.ticker, position.closed) : await getStockPrice(position.ticker, new Date(Date.now()).toISOString())
//                 total -= closingPrice - openingPrice
//                 console.log(total)
//             }
//             }
//             authStatus.total_money = total
//             console.log('THE FCKIN TOTAL IS '+total);
//         } else {
//             authStatus.failed = true;
//         }
//     } catch(error) {
//         console.log(error);
//         auth.failed = true;
//     }
// }

onMounted(async () => {
    await auth.validate();
    if(auth.status.success) {
        await getUserFromToken();
        data.total_money = await (await portfolio.getAvailableMoney());
    }
});

</script>

<template>
    <div class='columns is-centered'>
        <div class='column has-text-centered'>
            <h1>{{ username.value }} Portfolio</h1>
            <div> You currently have {{ data.total_money }}$ to spend!</div>
        </div>
    </div>
    <div class='columns is-centered'>
        <div class='column has-text-centered'>
            <form @submit.prevent='updateStock'>
                <p>Select which stock you want to buy or sell</p>
                <input type='text' v-model='stockData.ticker' placeholder='Enter the symbol of the stock you want to enter'>
                <button type='submit' class='submit'>Select</button>
            </form>
        </div>
    </div>
    <div class='columns is-centered'>
        <div class='column has-text-centered'>
            <p>
                The price of the current stock you are looking at is : {{ stockData.price }}
            </p>
            <form @submit.prevent='buyStock'>
                <button> BUY 1 STOCK</button>
            </form>
        </div>
    </div>
</template>