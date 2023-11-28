<script setup>
import axios from 'axios';
import auth from '../auth';
import reactive from 'vue';

const authStatus = reactive({
    success: false,
    failed: false
});

const attemptAuth = async () => {
    try {
        res = await axios({
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            },
            url: "http://localhost:8080/positions"
        });


    } catch (error) {
        console.log(error);
    }
};

onMounted(async () => {
    await attemptAuth();
});
</script>

<template>
    <h1>Portfolio</h1>
    <div v-if="authStatus.success">
    </div>
    <div v-if="authStatus.failed">
        <p>
            You need to <a href="http://localhost:5173/login">log in</a> or <a href="http://localhost:5173/sign-up">sign up</a> to use this feature.
        </p>
    </div>
    <p> {{ auth.token }}</p>
</template>

<style scoped>

</style>
