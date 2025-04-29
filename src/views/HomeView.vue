<template>
    <div v-if="store.Logueado"><!--El usuario debe estar logueado para que se muestre lo que está dentro de este div-->
        <NavBar />
        <div class="home-container">
            <h1>Bienvenido a CriptoMarket</h1>
            <h2>Tu lugar seguro para comprar y vender criptomonedas</h2>
        </div>
    </div>
    <div v-else>
        <RequiereLogin />
    </div>
    
</template>

<script setup>
import NavBar from '@/components/BarraNavegacion.vue'
import { userStore } from '@/store/user';
import RequiereLogin from '@/components/RequiereLogin.vue';
const store = userStore()
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
</style>