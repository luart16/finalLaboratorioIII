<template>
  <div class="home-container">
    <div v-if="store.Logueado" class="center-content"> <!--Si el usuario no está logueado no se va a mostrar lo que está dentro de este div que es el botón de operar-->
      <h1>Bienvenido a CriptoMarket</h1>
      <h2>Tu lugar seguro para comprar y vender criptomonedas</h2>
      <router-link :to="{name: 'operar'}" class="btn">Operar</router-link>
      <router-link :to="{name: 'historial'}" class="btn">Historial de Movimientos</router-link>
    </div>
    <div v-else>
      <h1>
        Por favor, inicia sesión para poder operar
        <!-- <button class="btn">Login</button> -->
        <div>
          <router-link :to="{name: 'login'}" class="btn">Ir a iniciar sesión</router-link>
        </div>
      </h1>
    </div>
    <button @click="Desloguear">Cerrar sesión</button> <!--acá llamo a la función de desloguear que creé abajo en el script-->
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { userStore } from '../store/user';
const store = userStore();
const ruta = useRouter();

//creo la función para desloguearme y luego arriba creo el botón y la llamo
const Desloguear =() => {
  store.Deslogueo() //aquí se desloguea y debajo pongo para que me lleve al loguin
  ruta.push({ 
    name:"login"
  })

}
</script>

<style scoped>
* {
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.home-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #c2dedd;
  flex-direction: column;
  text-align: center;
}

.center-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

h1 {
  font-size: 42px;
  color: #1a237e;
  margin-bottom: 10px;
  font-weight: 700;
}

h2 {
  font-size: 24px;
  color: #263238;
  margin-bottom: 20px;
}

.btn {
  background-color: #1a237e;
  color: white;
  border: none;
  padding: 15px 30px;
  font-size: 18px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
  text-decoration: none;
  display: inline-block;
}

.btn:hover {
  background-color: #0d154c;
}
</style>