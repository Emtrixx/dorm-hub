import { createApp } from 'vue'

import "bootstrap/dist/css/bootstrap.min.css"

import App from './App.vue'
import router from './router.js'
import store from './store/index'

import BaseCard from './components/UI/BaseCard.vue'

const app = createApp(App)

app.use(router);
app.use(store)

app.component('base-card', BaseCard)


app.mount('#app')
console.log(process.env.VUE_APP_SERVER_URL)
