<script setup>
import axios from 'axios';
import { reactive } from 'vue';
import router from '../router';

const data = reactive({
    username: '',
    password: '',
});

const auth = reactive({
    failed: false
})

const registerUser = async () => {
    auth.failed = false;
    auth.success = false;
    try {
        const newUser = {
            username: data.username,
            password: data.password
        }
        const res = await axios({
            method: "POST",
            url: `http://localhost:8080/users/`,
            data: newUser
        });

        if(res.status === 200) {
            router.push({ path: '/login' });
        }
        
    } catch(error) {
        console.log(error);
        auth.failed = true;
    }
}

</script>

<template>
    <h1>Sign Up Page</h1>
    <div class="register">
        <input type="text" v-model="data.username" placeholder="Enter Username" />
        <input type="text" v-model="data.password" placeholder="Enter Password" />
        <button @click="registerUser">Sign Up</button>
        <p>
            <RouterLink to="/login">Login</RouterLink>
        </p>
        <p v-if="auth.failed">
            Username already taken :(
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
