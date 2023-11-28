import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('../views/GraphView.vue')
        },

        {
            path: '/login',
            name: 'login',
            component: () => import('../views/LoginView.vue')
        },

        {
            path: "/sign-up",
            name: "sign up",
            component: () => import('../views/SignupView.vue')
        },

        {
            path: "/portfolio",
            name: "portfolio",
            component: () => import('../views/PortfolioView.vue')
        }

    ]
})

export default router
