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
            return'https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol='+stockSymbol.value+'&apikey=EDOF97Z0B2DGU669'
        });
        let createStockPriceHistoryResponse = (dateRange) =>{
            axios.get(AlphaVantageApi_URL_LINK.value)
            .then(response =>{
                stockMarketHistory = response
                const data = stockMarketHistory.data['Weekly Adjusted Time Series']
                dateRange;
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
                let dateRange = now - (60*60*24*365)

                const isLaterDate = (date) =>{
                    return date> dateRange
                }
                let idx = stockMarketHistoryEpochDates.findIndex(isLaterDate)
                stockMarketHistoryDates.splice(0,idx)
                stockMarketHistoryPrices.splice(0,idx)
                updateStockPriceHistoryChart()
            });
            // updateStockPriceHistoryChart()
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