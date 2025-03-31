import { defineStore } from "pinia";

export const userStore =defineStore('User',{

    state:()=> {
        return{
            Logeado:false,
            Usuario:'',
        }
    },
    actions:{
        Loguear(nombre){
            this.Usuario=nombre,
            this.Logeado=true
        },
        Deslogueo(){
            this.Usuario='',
            this.Logeado=false
        }
    }
})