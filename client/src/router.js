import { createRouter, createWebHistory } from 'vue-router'

import Home from './pages/Home.vue'
import Blackboard from './pages/Blackboard'
import News from './pages/News.vue'
import Wiki from './pages/Wiki.vue'
import Hub from './components/blackboard/Hub.vue'


const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: Home },
        {
            path: '/blackboard', component: Blackboard, children: [
                { path: ':id', component: Hub, props: true }
            ]
        },
        { path: '/news', component: News },
        { path: '/wiki', component: Wiki },
        { path: '/login', component: () => import('./pages/auth/Login.vue') },
        { path: '/signup', component: () => import('./pages/auth/Signup.vue') }
    ]
})

export default router