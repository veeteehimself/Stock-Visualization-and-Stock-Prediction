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

let myChart
myChart

export default {
    name:"LineChart",
    mounted(){
        this.updateStockPriceHistoryChart()
    },
    setup(){
        let updateStockPriceHistoryChart=() =>{
            const ctx = document.getElementById("myChart");

            const labels = ["Jan","Feb", "Mar"]
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
        return {
            updateStockPriceHistoryChart
        }
    }
}

</script>

<style scoped>

</style>