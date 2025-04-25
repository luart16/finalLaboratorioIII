import { createRouter, createWebHashHistory } from "vue-router"; //el 2° es para usar el sistema de navegación con # en la URL, como /#/home
import HomeView from "../views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import OperarView from "@/views/OperarView.vue";
import HistorialMovimientos from "@/views/HistorialMovimientos.vue";
const routes = [ //acá voy poniendo todas las rutas de las vistas
  {
    path: "/",
    name: "login",
    component: LoginView,
  },
  {
    path: "/home", //este es el camino en la url
    name: "home", //este es el nombre interno de la ruta 
    component: HomeView, //es el nombre del componente o vista que muestra
  },
  {
    path: "/historial", 
    name: "historial",
    component: HistorialMovimientos,
  },
 
  {
    path: "/operar", 
    name: "operar", 
    component: OperarView, 
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
