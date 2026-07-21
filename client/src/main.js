

import { createApp } from 'vue'

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import "bootstrap-icons/font/bootstrap-icons.css"
import "@fontsource-variable/bricolage-grotesque"
import "@fontsource-variable/instrument-sans"
import "./assets/theme.css"
import App from './App.vue'
import router from './router.js'
import { createPinia } from 'pinia'



import BaseCard from './components/UI/BaseCard.vue'

const app = createApp(App)

// import VModal from 'vue-js-modal'
// app.use(VModal);
app.use(router);
app.use(createPinia())

app.component('base-card', BaseCard)


app.mount('#app')
