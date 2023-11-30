import { createApp, ref, watch } from 'vue';
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.css';
import router from './router';
import VueCookies from 'vue-cookies';

import axios from 'axios'

const app = createApp(App);
app.use(router);
app.use(VueCookies);
app.mount('#app');

app.config.globalProperties.$axios = axios

axios.defaults.baseURL = 'https://localhost:8080'

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