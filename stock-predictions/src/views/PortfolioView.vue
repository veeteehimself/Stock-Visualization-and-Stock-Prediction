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
    positions: []
})

const attemptAuth = async () => {
    try {
        const res = await axios({
            method: "GET",
            headers: {
                Authorization: `Bearer ${auth.token}`
            },
            url: "http://localhost:8080/positions"
        });

        if (res.status === 200) {
            authStatus.success = true;

            for (const position of res.data) {
                console.log(position);;
                data.positions.push({
                    ...position,
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
            console.log("didn't contain")
            return prices[prices.length-1];
        }

        // console.log(console.log(res.data.data));
        return prices[dates.indexOf(formatDate(date))];
    } catch (error) {
        console.log(error);
    }
}

onMounted(async () => {
    await attemptAuth();
});
</script>

<template>
    <h1>Portfolio</h1>
    <div v-if="authStatus.success">
        <div v-for="position in data.positions">
            {{ position.ticker }}  {{ position.openingPrice }} {{ position.closingPrice }} <div :class="{positive: position.closingPrice-position.openingPrice>0, negative: position.closingPrice-position.openingPrice<0}">{{ position.closingPrice - position.openingPrice }}</div>
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
    <p> {{ auth.token }}</p>
</template>

<style scoped>
.positive {
    color: green
}
.negative {
    color: red
}
</style>
