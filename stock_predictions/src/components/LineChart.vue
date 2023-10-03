<template>
<div class="lineChart" >
    <div id="chartContainer">
        <canvas id="myChart" width="400px" height="400px">
        </canvas>
    </div>
</div>
</template>

<script>

import Chart from 'chart.js/auto';
import {ref,computed} from "vue";
import axios from "axios"


// var request = require('request');

// // replace the "demo" apikey below with your own key from https://www.alphavantage.co/support/#api-key
// var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol=IBM&apikey=EDOF97Z0B2DGU669';

// request.get({
//     url: url,
//     json: true,
//     headers: {'User-Agent': 'request'}
//   }, (err, res, data) => {
//     if (err) {
//       console.log('Error:', err);
//     } else if (res.statusCode !== 200) {
//       console.log('Status:', res.statusCode);
//     } else {
//       // data is successfully parsed as a JSON object:
//       console.log(data);
//     }
// });

let stockMarketHistory = []
let stockMarketHistoryDates= []
let stockMarketHistoryEpochDates = []
let stockMarketHistoryPrices = []
stockMarketHistory
stockMarketHistoryDates
stockMarketHistoryEpochDates
stockMarketHistoryPrices
let myChart
myChart

export default {
    name:"LineChart",
    mounted(){
        this.createStockPriceHistoryResponse()
        this.updateStockPriceHistoryChart()
    },
    setup(){
        let updateStockPriceHistoryChart=() =>{
            const ctx = document.getElementById("myChart");

            const labels = ["Jan","Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]
            const data = {
                labels:labels,
                datasets: [{
                    label:'Stock Market Price',
                    data: [1,2,3,4,5,6,7],
                    fill: false,
                    borderColor:"rbg(75,192,192)",
                    tension: 0 ,
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                    }

                }]
            }
            myChart = new Chart(ctx, {
                type:'line',
                data: data,
            })
        }
        let stockSymbol = ref("IBM")
        let AlphaVantageApi_URL_LINK= computed(() =>{
            return'https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol='+stockSymbol.value+'&apikey=EDOF97Z0B2DGU669'
        });
        let createStockPriceHistoryResponse = (dateRange) =>{
            axios.get(AlphaVantageApi_URL_LINK.value)
            .then(response =>{
                stockMarketHistory = response
                console.log(stockMarketHistory)
                dateRange;
            })
        }
        console.log(AlphaVantageApi_URL_LINK.value)
        return {
            updateStockPriceHistoryChart,
            createStockPriceHistoryResponse
        }
    }
}

</script>

<style scoped>

</style>