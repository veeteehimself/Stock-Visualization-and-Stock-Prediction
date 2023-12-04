<script setup>
    import { isLit } from './store.js';
</script>

<template>
    <div class='theme-setter'>
        <span
            class='material-icons'
            :class='isLit ? "lit" : ""'
            @click='isLit = !isLit'>&#xea24;
        </span>
    </div>
</template>

<style scoped>
    span {
        font-size: 2.25rem;
        color: var(--foreground);
        border-radius: .25rem;
        padding: .5rem;
    }

    span.lit {
        color: var(--orange);
    }

    span:hover {
        background: var(--foregroundAlt);
    }
</style>
