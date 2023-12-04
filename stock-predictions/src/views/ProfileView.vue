<script setup>
import axios from 'axios';
import auth from '../auth';
import { reactive, onMounted } from 'vue';
import portfolio from '../portfolio';
import router from '../router';

const data = reactive({
    availableMoney: 0,
    portfolioValue: 0,
    user: {
        username: "",
        created: ""
    }
});

const getUserData = async () => {
    try {
        const res = await axios({
            method: "GET",
            url: "/users/view"
        });
        data.user.username = res.data.username;
        data.user.created = new Date(res.data.created).toDateString();
    } catch(error) {
        console.log(error);
        auth.status.error = true;
        auth.status.errorMsg = error;
    }
}

const logOut = () => {
    localStorage.removeItem("authorization");
    router.push("/login");
}

onMounted(async () => {
    await auth.validate();
    if(auth.status.success) {
        data.availableMoney = await portfolio.getAvailableMoney();
        data.portfolioValue = await portfolio.getValue();
        await getUserData();
    } 
});
</script>

<template>
    <div class='columns is-centered'>
        <div class='column has-text-centered'>
            <div v-if="auth.status.success">
                <h1>{{ data.user.username }}'s Profile</h1>
                <h2>Portfolio Value: ${{ data.portfolioValue }}</h2>
                <h2>Available Funds: ${{ data.availableMoney }}</h2>
                <p>Account created {{ data.user.created }} - keep up the good work!</p>
                <button @click="logOut">Log out</button>
            </div>
            <div v-if="auth.status.failed">
                <p>
                    You need to <a href="http://localhost:5173/login">log in</a> or <a href="http://localhost:5173/sign-up">sign up</a> to use this feature.
                </p>
            </div>
            <div v-if="auth.status.error">
                <p> {{  auth.status.errorMsg }} </p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.positive {
    color: green
}
.negative {
    color: red
}
</style>
