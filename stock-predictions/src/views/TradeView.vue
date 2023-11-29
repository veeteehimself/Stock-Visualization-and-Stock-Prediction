<script setup>
import axios from 'axios';
import auth from '../auth';
import {reactive,onMounted} from 'vue';

const stockData = reactive({
    ticker: 'IBM',
    price: 0,
});

const authStatus = reactive({
    success: false,
    failed: false,
    error: false,
    errorMsg: "",
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

const getUserTotalMoney = async () => {
    try {
        let total = 10000 
        const res = await axios({
            method: "GET",
            headers: {
                Authorization: `Bearer ${auth.token}`
            },
            url: "http://localhost:8080/users/view"+"?username=" + username.value
        });
        if (res.status === 200) {
            console.log(res.data.positions)
            authStatus.success = true;
            if(res.data.positions.length > 0 ){
                for (const position of res.data.positions) {
                console.log(position.ticker)
                console.log(position.opened)
                let openingPrice = await getStockPrice(position.ticker, position.opened)
                console.log(openingPrice)
                total -= openingPrice
            }
            }
            authStatus.total_money = total.toFixed(2)
            console.log(total);
        } else {
            authStatus.failed = true;
        }
    } catch(error) {
        console.log(error);
        auth.failed = true;
    }
}


const buyStock = async () => {
    try {
        stockData.price = await getLatestStockPrice(stockData.ticker, new Date(Date.now()).toISOString())
        // stockData.price = stockData[]
        console.log(stockData.ticker)
        console.log(stockData.price )
        console.log(authStatus.total_money)
        if (authStatus.total_money > stockData.price){
            const res = await axios({
            method: "POST",
            headers: {
                Authorization: `Bearer ${auth.token}`
            },
            url: "http://localhost:8080/positions/",
            data: {ticker:stockData.ticker}
        });

        if (res.status === 200) {
            authStatus.success = true;
            authStatus.total_money -= stockData.price
            authStatus.total_money = authStatus.total_money.toFixed(2)
        } else {
            authStatus.failed = true;
        }

        } else{
            console.log('YOU DONT HAVE ENOUGH MONEY TO BUY THIS STOCK')
        }} catch(error) {
                console.log(error);
                auth.failed = true;
            }
        }

const sellStock = async () => {
    try {
        console.log(12312321)
        const res = await axios({
            method: "GET",
            headers: {
                Authorization: `Bearer ${auth.token}`
            },
            url: "http://localhost:8080/users/view"+"?username=" + username.value
        });
        if (res.status === 200) {
            authStatus.success = true;
            if(res.data.length > 0 ){
                for (const position of res.data) {
                openingPrice = await getStockPrice(position.ticker, position.opened),
                closingPrice = position.closed ? await getStockPrice(position.ticker, position.closed) : await getStockPrice(position.ticker, new Date(Date.now()).toISOString())
                total -= closingPrice - openingPrice
                console.log(total)
            }
            }
            authStatus.total_money = total
            console.log('THE FCKIN TOTAL IS '+total);
        } else {
            authStatus.failed = true;
        }
    } catch(error) {
        console.log(error);
        auth.failed = true;
    }
}

onMounted(async () => {
    await getUserFromToken();
    await getUserTotalMoney();
});

</script>

<template>
    <h1>{{ username.value }} Portfolio</h1>
    <div> You currently have {{ authStatus.total_money }}$ to spend!</div>
    <div class='columns is-centered'>
      <div class='column has-text-centered'>
        <form @submit.prevent='getUserTotalMoney'>
          <div>Select which stock you want to buy or sell</div>

          <input type='text' v-model='stockData.ticker' placeholder='Enter the symbol of the stock you want to enter'>
          <button type='submit' class='submit'>Predict</button>
        </form>
      </div>
    </div>
    <div class='column has-text-centered'>
        <form @submit.prevent='buyStock'>
            <button> BUY 1 STOCK</button>
        </form>
        <button> SELL 1 STOCK</button>
    </div>

    
</template>

<style scoped>

</style>
