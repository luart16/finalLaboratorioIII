<template>
  <nav class="navbar">
    <div class="nav-container">
      <router-link to="/home" class="nav-brand">CriptoMarket</router-link>
      <div class="nav-links">
        <router-link to="/home" class="nav-link" active-class="active-link">
          Inicio
        </router-link>
        <router-link to="/operar" class="nav-link" active-class="active-link">
          Operar
        </router-link>
        <router-link to="/historial" class="nav-link" active-class="active-link">
          Historial
        </router-link>
        <button @click="deslogueo">Desloguear</button>
      </div>
    </div>
  </nav>
</template>

<script setup>

import { userStore } from '@/store/user';
import { useRouter } from 'vue-router';
const store = userStore()
const route = useRouter()
const deslogueo = () => {
  store.Deslogueo()
route.push({name: 'login'})
}
</script>
<style scoped>
.navbar {
  background-color: #2c3e50;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  color: white;
  font-size: 1.5rem;
  text-decoration: none;
  font-weight: bold;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background-color: #34495e;
}

.active-link {
  background-color: #3498db;
  color: white;
}
</style>