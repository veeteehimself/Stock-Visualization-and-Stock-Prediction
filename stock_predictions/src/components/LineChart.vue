<template>
<div class="lineChart" >
    <div class="chartAndButtonContainer">
        <form action="" id="stockSymbolSearchForm" @submit.prevent="createStockPriceHistoryResponse(`${60*60*24*365}`)">
        <input type="text" name="stockSymbolSearch" placeholder="Enter the symbol of the stock you want to enter" id="stockSymbolSearchBar" v-model="stockSymbol">
            <button type="submit" class="submit">Search</button>
        </form>
        <br>
        <p>Active Stock Symbol : {{ stockSymbol }}</p>
        <div class="dateRangeButtons">
            <button @click="changeZoomSize(`${60*60*24*7}`)">
            1 week</button>
            <button @click="changeZoomSize(`${60*60*24*30}`)">
            1 month day</button>
            <button @click="changeZoomSize(`${60*60*24*30*6}`)">
            6 months</button>
            <button @click="changeZoomSize(`${60*60*24*365}`)">
            1 year</button>
            <button @click="changeZoomSize(`${60*60*24*365*5}`)">
            5 years</button>
            <button @click="changeZoomSize(`${60*60*24*365*20}`)">
            20 years</button>
        </div>
    </div>
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


let stockMarketHistory = []
let stockMarketHistoryDates= []
let stockMarketHistoryEpochDates = []
let stockMarketHistoryPrices = []
let myChart
myChart

export default {
    name:"LineChart",
    mounted(){
        this.createStockPriceHistoryResponse(60*60*24*365)
    },
    setup(){
        let updateStockPriceHistoryChart=(stockMarketHistoryDates,stockMarketHistoryPrices) =>{
            const ctx = document.getElementById("myChart");
            const labels = stockMarketHistoryDates
            const data = {
                labels:labels,
                datasets: [{
                    label:'Stock Market Price',
                    data: stockMarketHistoryPrices,
                    fill: false,
                    borderColor:"rbg(75,192,192)",
                    tension: 0 ,
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                    }

                }]
            }


            const charWithKey = Chart.getChart('myChart')
            if (charWithKey != undefined){
                charWithKey.destroy()   
            }
            myChart = new Chart(ctx, {
                type:'line',
                data: data,
            })
        }

        let stockSymbol = ref("IBM")
        let AlphaVantageApi_URL_LINK= computed(() =>{
            return'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='+stockSymbol.value+'&apikey=EDOF97Z0B2DGU669&outputsize=full'

        });
        let changeZoomSize =(dateRange) =>{
            let now =  Date.now()/1000
                let dateRangeDate = now - dateRange

                const isLaterDate = (date) =>{
                    return date> dateRangeDate
                }
                let idx = stockMarketHistoryEpochDates.findIndex(isLaterDate)
                const date = JSON.parse(JSON.stringify(stockMarketHistoryDates));
                const prices = JSON.parse(JSON.stringify(stockMarketHistoryPrices));
                date.splice(0,idx)
                prices.splice(0,idx)
                updateStockPriceHistoryChart(date,prices)
        }
        let createStockPriceHistoryResponse = (dateRange) =>{
            if ( stockMarketHistoryDates.length > 0){
                stockMarketHistoryDates= []
                stockMarketHistoryEpochDates = []
                stockMarketHistoryPrices = []
            }
            axios.get(AlphaVantageApi_URL_LINK.value)
            .then(response =>{
                dateRange;
                stockMarketHistory = response
                const data = stockMarketHistory.data['Time Series (Daily)']
                for (const property in data){
                    let closingPrice = data[property]["4. close"]
                    let closingDateM = property.split('-')[1]
                    let closingDateY = property.split('-')[0]
                    let closingDateD = property.split('-')[2]
                    let closingDateFormatted = `${closingDateM}/${closingDateD}/${closingDateY}`
                    let closingDateEpochTime = Date.parse(closingDateFormatted)/1000

                    stockMarketHistoryDates.unshift(closingDateFormatted)
                    stockMarketHistoryEpochDates.unshift(closingDateEpochTime)
                    stockMarketHistoryPrices.unshift(closingPrice)

                }
            }).then(()=>{
                let now =  Date.now()/1000
                let dateRangeDate = now - dateRange

                const isLaterDate = (date) =>{
                    return date> dateRangeDate
                }
                let idx = stockMarketHistoryEpochDates.findIndex(isLaterDate)
                const date = JSON.parse(JSON.stringify(stockMarketHistoryDates));
                const prices = JSON.parse(JSON.stringify(stockMarketHistoryPrices));
                date.splice(0,idx)
                prices.splice(0,idx)
                updateStockPriceHistoryChart(date,prices)
            });
        }
        console.log(AlphaVantageApi_URL_LINK.value)
        return {
            changeZoomSize,
            stockSymbol,
            updateStockPriceHistoryChart,
            createStockPriceHistoryResponse
        }
    }
}

</script>

<style scoped>

</style>