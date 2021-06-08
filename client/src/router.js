import { createRouter, createWebHistory } from 'vue-router'

import Home from './pages/Home.vue'

import Blackboard from './pages/Blackboard'
import Hub from './components/blackboard/Hub.vue'
import ShowPost from './components/blackboard/ShowPost.vue'

import News from './pages/News.vue'

import Wiki from './pages/Wiki.vue'

import Meet from './pages/Meet.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: Home },
        {
            path: '/blackboard', component: Blackboard, children: [
                { path: ':id', component: Hub, props: true },
                { path: ':id/:postId', component: ShowPost, props: true }
            ]
        },
        { path: '/news', component: News },
        { path: '/wiki', component: Wiki },
        { path: '/meet', component: Meet },
        { path: '/login', component: () => import('./pages/auth/Login.vue') },
        { path: '/signup', component: () => import('./pages/auth/Signup.vue') }
    ]
})

export default router