<script setup>
import axios from 'axios';
import auth from '../auth';
import { reactive, onMounted } from 'vue';

const authStatus = reactive({
    success: false,
    failed: false,
    error: false,
    errorMsg: ""
});

const data = reactive({
    positions: [],
    value: 0
});

const attemptAuth = async () => {
    try {
        const res = await axios({
            method: "GET",
            url: "http://localhost:8080/positions"
        });

        if (res.status === 200) {
            authStatus.success = true;

            for (const position of res.data) {
                data.positions.push({
                    doc: position,
                    openingPrice: await getStockPrice(position.ticker, position.opened),
                    closingPrice: position.closed ? await getStockPrice(position.ticker, position.closed) : await getStockPrice(position.ticker, new Date(Date.now()).toISOString())
                });
            }
        } else {
            authStatus.failed = true;
        }
    } catch (error) {
        authStatus.error = true;
        authStatus.errorMsg = error;
        console.log(error);
    }
};

const formatDate = (date) => date.split("T")[0].split("-").join("/");

const getStockPrice = async (ticker, date) => {
    try {
        const res = await axios({
            method: "GET",
            url: `http://localhost:8080/stock?ticker=${ticker}`
        })
        const { prices, dates } = res.data;

        if(dates.indexOf(formatDate(date))===-1){
            return prices[prices.length-1];
        }

        // console.log(console.log(res.data.data));
        return prices[dates.indexOf(formatDate(date))];
    } catch (error) {
        console.log(error);
    }
}

const getPortfolioValue = async () => {
    try {
        const res = await axios({
            method: "GET",
            url: "http://localhost:8080/positions"
        });

        let totalValue = 10000;
        for (const position of res.data) {
            const openingPrice = await getStockPrice(position.ticker, position.opened);
            const closingPrice = position.closed ? await getStockPrice(position.ticker, position.closed) : await getStockPrice(position.ticker, new Date(Date.now()).toISOString());

            if (openingPrice && closingPrice)
                totalValue += closingPrice - openingPrice;
        }
        return totalValue;
    } catch (error) {
        console.log(error);
    }
}

const closePosition = (position) => {
    position.closed = Date.now();
    try {
        const res = axios({
            method: "PUT",
            data: position,
            url: `http://localhost:8080/positions/${position._id}`
        });
    } catch(error) {
        console.log(error);
    }
}

onMounted(async () => {
    await attemptAuth();
    data.value = await getPortfolioValue();
});
</script>

<template>
    <h1>Portfolio</h1>
    <div v-if="authStatus.success">
        <h2>{{ data.value }}</h2>
        <h3>Open positions</h3>
        <div v-for="position in data.positions.filter(p => !p.doc.closed)">
            Ticker: {{ position.doc.ticker }}  Bought at: {{ position.openingPrice }} Value: {{ position.closingPrice }} <div :class="{positive: position.closingPrice-position.openingPrice>0, negative: position.closingPrice-position.openingPrice<0}">Net gain: {{ position.closingPrice - position.openingPrice }}</div>
            <button @click="closePosition(position.doc)">Sell</button>
        </div>
        <h3>Closed positions</h3>
        <div v-for="position in data.positions.filter(p => p.doc.closed)">
            Ticker: {{ position.doc.ticker }}  Bought at: {{ position.openingPrice }} Sold at: {{ position.closingPrice }} <div :class="{positive: position.closingPrice-position.openingPrice>0, negative: position.closingPrice-position.openingPrice<0}">Net gain: {{ position.closingPrice - position.openingPrice }}</div>
        </div>
    </div>
    <div v-if="authStatus.failed">
        <p>
            You need to <a href="http://localhost:5173/login">log in</a> or <a href="http://localhost:5173/sign-up">sign up</a> to use this feature.
        </p>
    </div>
    <div v-if="authStatus.error">
        <p> {{  authStatus.errorMsg }} </p>
    </div>
</template>

<style scoped>
.positive {
    color: green
}
.negative {
    color: red
}
</style>
