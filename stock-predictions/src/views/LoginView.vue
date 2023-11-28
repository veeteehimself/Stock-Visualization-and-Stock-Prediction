import axious from 'axios';

<template>
    <h1>Login Page</h1>
    <div class="register">
        <input type="text" v-model="data.name" placeholder="Enter Name" />
        <input type="text" v-model="data.email" placeholder="Enter Email" />
        <input type="text" v-model="data.password" placeholder="Enter Password" />
        <button>Login</button>
        <p>
            <RouterLink to="/sign-up">Sign-Up</RouterLink>
        </p>
    </div>
</template>

<script setup>
import { reactive } from 'vue';

const data = reactive({
    name: '',
    email: '',
    password: ''
});
</script>

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
