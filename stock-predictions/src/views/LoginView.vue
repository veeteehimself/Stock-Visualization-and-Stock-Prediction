<script setup>
import axios from 'axios';
import { reactive } from 'vue';
import auth from '../auth';
import router from '../router';

const data = reactive({
    username: '',
    password: '',
});

const authStatus = reactive({
    failed: false
});

const authenticateLogin = async () => {
    authStatus.failed = false;
    try {
        const res = await axios({
            method: "POST",
            url: `http://localhost:8080/users/login/${data.username}/${data.password}`
        });

        const { authorization } = res.headers;

        if (authorization) {
            const token = authorization.split(' ').pop();
        
            auth.token = token;
            
            router.push({ path: '/portfolio' });
        }

    } catch(error) {
        console.log(error);
        authStatus.failed = true;
    }
}

</script>

<template>
    <h1>Login Page</h1>
    <div class="register">
        <input type="text" v-model="data.username" placeholder="Enter Username" />
        <input type="password" v-model="data.password" placeholder="Enter Password" />
        <button @click="authenticateLogin">Login</button>
        <p>
            <RouterLink to="/sign-up">Sign Up</RouterLink>
        </p>
        <p v-if="authStatus.failed">
            Invalid username and/or password :(
        </p>
    </div>
</template>

<style scoped>
.register {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
input {
    margin: 10px;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
}
</style>
