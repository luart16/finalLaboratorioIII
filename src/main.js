import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { createPinia } from 'pinia' //importo pinia para poder usarla

const pinia = createPinia()
createApp(App).use(pinia).use(store).use(router).mount('#app')
