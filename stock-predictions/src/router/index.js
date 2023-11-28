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
            path: '/predict',
            name: 'predict_page',
            component: () => import('../views/PredictView.vue')
        }
    ]
})

export default router
