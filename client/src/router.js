import { createRouter, createWebHistory } from 'vue-router'

import Home from './pages/Home.vue'

import Blackboard from './pages/Blackboard'
import Hub from './components/blackboard/Hub.vue'
import AllHubs from './components/blackboard/AllHubs.vue'
import ShowAll from './components/blackboard/ShowAll.vue'
import ShowPost from './components/blackboard/ShowPost.vue'

import News from './pages/News.vue'
import ShowNews from './components/news/ShowNews.vue'

import Wiki from './pages/Wiki.vue'

import Meet from './pages/Meet.vue'

import Calendar from './pages/Calendar.vue'

import Impressum from './pages/Impressum.vue'
import Privacy from './pages/Privacy.vue'
import NotFound from './pages/NotFound.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: Home },
        {
            path: '/blackboard', component: Blackboard, children: [
                { path: 'all', component: AllHubs},
                { path: ':id', component: Hub, props: true, children: [
                    { path: 'index', component: ShowAll, props: true }, 
                    { path: ':postId', component: ShowPost, props: true},
                ]}
            ]
        },
        { path: '/news', component: News },
        { path: '/news/:newsId', component: ShowNews, props: true},
        { path: '/wiki', component: Wiki },
        { path: '/meet', component: Meet },
        { path: '/calendar', component: Calendar },
        { path: '/login', component: () => import('./pages/auth/Login.vue') },
        { path: '/signup', component: () => import('./pages/auth/Signup.vue') },
        { path: '/impressum', component: Impressum },
        { path: '/privacy', component: Privacy },
        { path: '/:notFound(.*)', component: NotFound }

    ]
})

export default router