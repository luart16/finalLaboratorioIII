import { createApp } from "vue"; //Importo la función createApp desde Vue que me sirve para crear la aplicación Vue.
import App from "./App.vue"; //Importo el componente principal de mi app. Este archivo App.vue es donde empieza visualmente mi app. De ahí se irán cargando los demás componentes.
import router from "./router"; //Importo el sistema de rutas, que me sirve para manejar las páginas o vistas de mi app
import store from "./store"; //Importo el sistema de estado global (con pinia ya no es necesario pero por las dudas lo puse)
import { createPinia } from "pinia"; //importo la función para crear una instancia de Pinia para de manejar el estado global
import Toast from "vue-toastification"; //para las notificaciones en lugar de usar los alerts
import "vue-toastification/dist/index.css";

const pinia = createPinia(); //Creo una nueva instancia de Pinia para usar en mi app
createApp(App)
  .use(pinia)
  .use(store)
  .use(router)
  .use(Toast, {
    position: "top-center",
    timeout: 2000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: false,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: true,
    closeButton: "button",
    icon: true,
    rtl: false,
  })
  .mount("#app"); //acá es como crear mi app y agregarle funcionalidades y conectarla al html.
/*Sería:
createApp(App): crea tu app a partir del componente raíz (App.vue)
.use(pinia): le digo a vue que use pinia para el manejo del estado
.use(store): esto lo podría sacar porque estoy usando pina
.use(router): le digo que use las rutas.
.mount('#app'): monta la app en el HTML, específicamente en el <div id="app">.
*/
