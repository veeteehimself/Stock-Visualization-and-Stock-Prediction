<script setup>
import LineChart from './GraphView.vue'
import axios from 'axios';
import { reactive, ref } from 'vue';


const stockData = reactive({
    ticker: 'IBM',
    range: '15552000000',
    dates: [],
    prices: [],
});

let data = ref(null);
let isShowMenu = ref(true); // Use ref to define isShowMenu

async function fun() {
  try {
    const response = await axios({
      method: 'GET',
      url: 'http://localhost:8080/compiler/'+stockData.ticker,
    });
    data = response['data'];
    // Handle the data here
    var outputElement = document.getElementById("output");
    outputElement.textContent = "The predicted price is:" + data['prediction'].substring(2, data['prediction'].length-2);
    outputElement.style.display = "block";
  } catch (error) {
    // Handle errors here
    console.error('Error fetching data:', error);
  }
}
</script>

<template>
    <main>
      <div class='columns is-centered'>
        <div class='column has-text-centered'>
          <form @submit.prevent='fun'>
            <div>Press button to predict the stock for the next day</div>
            <input type='text' v-model='stockData.ticker' placeholder='Enter the symbol of the stock you want to enter'>
            <button type='submit' class='submit'>Predict</button>
          </form>
        </div>
      </div>
      <p id="output" class='column has-text-centered'></p>
    </main>
</template>
