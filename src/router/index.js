import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import OperarView from "@/views/OperarView.vue";
import HistorialMovimientos from "@/views/HistorialMovimientos.vue";
const routes = [ //acá voy a ir poniendo todas las rutas de las vistas
  {
    path: "/",
    name: "login",
    component: LoginView,
  },
  {
    path: "/home", //este es el camino
    name: "home", //este es el nombre que va a tener la ruta o enrutamiento
    component: HomeView, //es el nombre del componente
  },
  {
    path: "/historial", 
    name: "historial",
    component: HistorialMovimientos,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },  
  {
    path: "/operar", //este es el camino
    name: "operar", //este es el nombre que va a tener la ruta o enrutamiento
    component: OperarView, //es el nombre del componente
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
