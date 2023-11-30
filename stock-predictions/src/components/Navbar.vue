<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/">Home</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/predict">Predict</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/trade">Trade</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/portfolio">Portfolio</RouterLink>
          </li>
          <li class="nav-item" v-if="!authStatus">
            <RouterLink class="nav-link" to="/login">Login</RouterLink>
          </li>
          <li class="nav-item" v-if="authStatus">
            <button @click="logOut">Log Out</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
  
<script setup>
import { onUpdated, ref } from 'vue';
import router from '../router';

const logOut = () => {
    localStorage.removeItem("authorization");
    router.push("/");
    reloadLogin();
};

let authStatus = ref(false);

const reloadLogin = () => {
    if (localStorage.getItem("authorization"))
        authStatus = true;
}
</script>