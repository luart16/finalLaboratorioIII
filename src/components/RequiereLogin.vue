<template>
    <div class="RequiereLogin">
      <h1>Por favor, inicia sesión para poder ingresar</h1>
      <div>
        <router-link :to="{ name: 'login' }" class="btn">
          Ir a iniciar sesión
        </router-link>
      </div>
    </div>
  </template>
  
  <script setup>
  
  </script>
  
  <style scoped>
  .aviso-iniciar-sesion {
    text-align: center;
    margin-top: 3rem;
  }
  
  .btn {
    display: inline-block;
    margin-top: 1rem;
    padding: 0.75rem 1.5rem;
    background-color: #2d72d9;
    color: white;
    border-radius: 6px;
    text-decoration: none;
    font-weight: bold;
    transition: background-color 0.3s ease;
  }
  
  .btn:hover {
    background-color: #1b4fa3;
  }
  </style>