import { createApp, ref, watch } from 'vue';
import App from './App.vue';
import './assets/themes.css';
import router from './router';

import axios from 'axios'

const app = createApp(App);
app.use(router);
app.mount('#app');

app.config.globalProperties.$axios = axios

axios.defaults.baseURL = 'http://localhost:8080'

axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem("authorization");
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
        }

        return config;
    },
    error => {
        Promise.reject(error)
    });