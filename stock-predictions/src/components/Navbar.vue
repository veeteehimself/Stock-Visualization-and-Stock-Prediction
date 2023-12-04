<script setup>
    import ThemeSetter from './ThemeSetter.vue'
    import { ref } from 'vue';
    let active = ref(false);
</script>

<template>
    <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <a class="navbar-burger" @click="active = !active" role="button" data-target="nav" aria-label="menu" aria-expanded="false">
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </a>
        </div>

        <div id="nav" class="navbar-menu" :class="active ? 'is-active' : ''">
            <div class="navbar-start">
                <router-link class="navbar-item" to="/">Home</router-link>
                <router-link class="navbar-item" to="/predict">Predict</router-link>
                <router-link class="navbar-item" to="/trade">Trade</router-link>
                <router-link class="navbar-item" to="/portfolio">Portfolio</router-link>
                <router-link class="navbar-item" to="/profile">Profile</router-link>
            </div>
        </div>

        <div class="navbar-end">
            <ThemeSetter />
        </div>
    </nav>
</template>
  
<style scoped>
    nav {
        margin-bottom: 1rem;
    }

    .navbar-menu.is-active {
        position: fixed;
        left: 0;
    }

    .navbar-burger,
    .navbar-item {
        color: var(--foreground);
        border-radius: .25rem;
        margin: .25rem;
    }

    .navbar-burger:hover,
    .navbar-item:hover {
        color: var(--background);
        background: var(--magenta);
    }
</style>