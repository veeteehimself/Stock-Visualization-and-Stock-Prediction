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

const isLoading = reactive({value: false});
let data = ref(null);

async function fun() {
  try {
    isLoading.value = true;
    const response = await axios({
      method: 'GET',
      url: 'http://localhost:8080/compiler/' + stockData.ticker,
    });
    data.value = response.data;
    // Handle the data here
    var outputElement = document.getElementById("output");
    outputElement.textContent =
      "The predicted price is:" + data.value['prediction'].substring(2, data.value['prediction'].length - 2);
    outputElement.style.display = "block";
  } catch (error) {
    // Handle errors here
    console.error('Error fetching data:', error);
    isLoading.value = false; // Make sure to set loading to false in case of an error
  }finally {
    isLoading.value = false; // Ensure that isLoading is set to false regardless of success or error
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
    <div class ='column has-text-centered'>
      <div class="spinner-border " v-if="isLoading.value" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    </div>
    <p id="output" class='column has-text-centered'></p>
  </main>
</template>
