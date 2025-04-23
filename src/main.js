import { createApp } from "vue"; //Importa la función createApp desde Vue, que sirve para crear la aplicación Vue.
import App from "./App.vue"; //Importa el componente principal (raíz) de tu aplicación, que normalmente se llama App.vue.
//Este archivo App.vue es donde empieza visualmente mi app. De ahí se irán cargando los demás componentes.
import router from "./router"; //Importa el sistema de rutas que tengo configurado en mi carpeta router.
//Esto sirve para manejar diferentes páginas o vistas en mi app, sin recargar el navegador (gracias a Vue Router).
import store from "./store"; //Este importa el sistema de estado global, pero esto es del antiguo Vuex.
//Si se está usando Pinia, este store ya no es necesario (a menos que todavía estés usando algo de Vuex viejo).
//Lo más común hoy en día es usar solo Pinia para manejar el estado, así que podés quitar esta línea si no usás Vuex.
import { createPinia } from "pinia"; //importo pinia para poder usarla
//Importa la función para crear una instancia de Pinia, que es la nueva forma recomendada de manejar el estado global en Vue 3.
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

const pinia = createPinia(); //Crea una nueva instancia de Pinia. Es como decir: "Preparo Pinia para que esté lista para usar en mi app".
createApp(App).use(pinia).use(store).use(router).use(
    Toast,{
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
      rtl: false
    }
).mount("#app"); //Esta línea es como decir: "creo mi app, le agrego funcionalidades, y la conecto al HTML".
/*Vamos paso a paso:

createApp(App): Crea tu app a partir del componente raíz (App.vue).

.use(pinia): Le decís a Vue que use Pinia para el manejo del estado.

.use(store): Le agregás Vuex (aunque, de nuevo, si estás usando Pinia, esto podría sobrar).

.use(router): Le agregás el sistema de rutas.

.mount('#app'): Montás tu app en el HTML, específicamente en el <div id="app">.
*/
