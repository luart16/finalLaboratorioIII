<template>
  <nav>
    <router-link to="/about">Abo ut</router-link>
    <router-link to ="/login">Login</router-link>
    <router-link to ="/operar">Operar</router-link> <!--  <router-link to ="{name: 'NOMBRE DE LA RUTA'} ">Operar</router-link> -->

  </nav>
  <router-view/>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
