<template>
   <nav>
    <div v-if="store.Logueado"> <!--Si el usuario no está logueado no se va a mostrar lo que está dentro de este div que es el botón de operar-->
      <router-link :to="{name: 'operar'}">Operar</router-link> <!--  <router-link to ="{name: 'NOMBRE DE LA RUTA'} ">Operar</router-link> -->
      <router-link :to="{name: 'historial'}">Historial de Movimientos</router-link>
    </div>
    <div v-else>
<h1>
  Ve a loguear 
  <button>Login</button>
</h1>    </div>
  </nav>
  <h1>Vista home</h1>
</template>

<script setup>
import { userStore } from '../store/user';
const store = userStore();
</script>