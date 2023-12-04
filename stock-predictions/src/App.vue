<script setup>
import { RouterView } from 'vue-router'
import { isLit } from './components/store.js';
import Navbar from './components/Navbar.vue'
</script>

<template>
    <main :class='{ lit: isLit }'>
        <Navbar/>
        <RouterView />
    </main>
</template>

<style>
    * {
        font-family: Roboto;
        font-size: 1.15rem;
        background: var(--background);
        color: var(--foreground);
    }

    main {
        min-height: 100vh;
    }

    h1 {
        font-size: 2rem;
        font-weight: bold;
    }

    select,
    input,
    button {
        background: var(--foregroundAlt);
        border-color: var(--foregroundAlt);
        border-radius: .35rem;
        margin: .25rem;
    }

    button:hover {
        background: var(--magenta);
        border-color: var(--magenta);
        color: var(--background);
    }
</style>