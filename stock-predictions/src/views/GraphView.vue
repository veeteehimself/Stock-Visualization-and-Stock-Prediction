<script setup>
import { reactive, onMounted } from 'vue';
import Chart from 'chart.js/auto';
import axios from 'axios';

const stockData = reactive({
    ticker: 'IBM',
    range: '15552000000',
    dates: [],
    prices: [],
    chart: new Chart()
});

const updateStocks = async () => {
    const { data } = await axios({
        method: 'GET',
        url: 'http://localhost:8080/stock',
        params: {
            ticker: stockData.ticker
        }
    });

    stockData.dates = data.dates;
    stockData.prices = data.prices;

    updateChart();
};

const updateChart = () => {
    const rangeIndex = getDateRangeIndex();

    stockData.chart.destroy();

    Chart.defaults.font.size = 14;
    stockData.chart = new Chart(document.getElementById('chart'), {
        type: 'line',
        data: {
            labels: stockData.dates.slice(rangeIndex),
            datasets: [{
                label: 'Stock Market Price',
                data: stockData.prices.slice(rangeIndex),
                fill: false,
                tension: 0,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                }
            }]
        },
    });
};

const getDateRangeIndex = () => {
    const lastDate = new Date(stockData.dates[stockData.dates.length - 1]).getTime();
    const dateRange = lastDate - (Number(stockData.range));

    return stockData.dates.findIndex((date) => {
        return new Date(date).getTime() >= dateRange;
    });
};

onMounted(async () => {
    await updateStocks();
});
</script>
 
<template>
    <div class='columns is-centered'>
        <div class='column has-text-centered'>
            <form @submit.prevent='updateStocks'>
                <select v-model='stockData.range' @change='updateChart'>
                    <option value='604800000'>1 Week</option>
                    <option value='2592000000'>1 Month</option>
                    <option value='15552000000' selected>6 Months</option>
                    <option value='31536000000'>1 Year</option>
                    <option value='157680000000'>5 Years</option>
                    <option value='630720000000'>20 Years</option>
                </select>
                <input type='text' v-model='stockData.ticker' placeholder='Enter the symbol of the stock you want to enter'>
                <button type='submit' class='submit'>Search</button>
            </form>
        </div>
    </div>
    <div class='columns is-centered'>
        <div class='column has-text-centered'>
            <p>Active Stock Symbol : {{ stockData.ticker }}</p>
        </div>
    </div>
    <div class='columns is-centered'>
        <div class='chart-container column has-text-centered'>
            <canvas id='chart'>
            </canvas>
        </div>
    </div>
</template>

<style scoped>
* {
    font-size: 1.15rem;
}

form {
    margin-top: 1rem;
}

.chart-container {
    position: relative;
    height: 85vh;
    width: 85vw
}
</style>