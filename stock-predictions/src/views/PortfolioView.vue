<script setup>
import axios from 'axios';
import auth from '../auth';
import portfolio from '../portfolio';
import { reactive, onMounted } from 'vue';

const data = reactive({
    positions: [],
    value: 0
});

const populatePositions = async () => {
    try {
        const res = await axios({
            method: "GET",
            url: "http://localhost:8080/positions"
        });

        for (const position of res.data) {
            data.positions.push({
                doc: position,
                openingPrice: await portfolio.getStockPrice(position.ticker, position.opened),
                closingPrice: position.closed ? await portfolio.getStockPrice(position.ticker, position.closed) : await portfolio.getStockPrice(position.ticker, new Date(Date.now()).toISOString())
            });
        }
    } catch (error) {
        auth.status.error = true;
        auth.status.errorMsg = error;
        console.log(error);
    }
};

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
    await auth.validate();
    if(auth.status.success) {
        data.value = await portfolio.getValue();
        await populatePositions()
    } 
});
</script>

<template>
    <h1>Portfolio</h1>
    <div v-if="auth.status.success">
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
    <div v-if="auth.status.failed">
        <p>
            You need to <a href="http://localhost:5173/login">log in</a> or <a href="http://localhost:5173/sign-up">sign up</a> to use this feature.
        </p>
    </div>
    <div v-if="auth.status.error">
        <p> {{  auth.status.errorMsg }} </p>
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
