import { createMemoryHistory, createRouter, RouteRecordRaw } from "vue-router";
const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: () => import('@/views/Home.vue')
    },
    {
        path: '/chat',
        component: () => import('@/views/Chat.vue')
    }
]

export const router = createRouter({ routes, history: createMemoryHistory() })