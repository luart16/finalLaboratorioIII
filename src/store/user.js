import { defineStore } from "pinia";

export const userStore = defineStore("User", {
  state: () => {
    return {
      Logueado: false,
      Usuario: "",
    };
  },
  actions: {
    Loguear(nombre) {
      (this.Usuario = nombre), (this.Logueado = true);
    },
    Deslogueo() {
      (this.Usuario = ""), (this.Logueado = false);
    },
  },
});
