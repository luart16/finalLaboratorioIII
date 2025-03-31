<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-100">
    <div class="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
      <h2 class="text-2xl font-semibold text-center mb-6">Iniciar sesión</h2>
      <form @submit.prevent="loguearse">
        <div class="mb-4">
          <label for="usuario" class="block text-sm font-medium text-gray-700">Usuario</label>
          <input v-model="nombre" type="usuario" id="usuario"
            class="mt-1 w-full p-2 border rounded-lg focus:ring focus:ring-blue-200" required />
        </div>
        <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
          Ingresar
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'; //esto es para rastrear cambios.
import { userStore } from '@/store/user'; // importo el userStore para poder usarlo debajo
import { useRouter } from 'vue-router'
const router = useRouter()
const store = userStore(); //creo una variable para usar el store
const nombre = ref(''); //le pongo el ref para que si cambia el nombre me lo cambie
const loguearse = () => {
  store.Loguear(nombre.value)
  alert('Logeado')
  router.push({ name: 'home' })
}

</script>