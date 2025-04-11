import apiClient from "./apiBase";
import { ref } from "vue";
import { userStore } from "@/store/user";

class Transacciones {
  static Transaccion = ref([]);

  static async postTransaccion(transaccion) {
    try {
      const respuesta = await apiClient.post("/transactions", transaccion); //a la ruta que me pasa el apiClient le agrego la ruta "transactions" para que me lleve a esa ventana
      console.log(respuesta, "datos respuesta");
    } catch (error) {
      console.log(error);
    }
  }

  static async traerTransacciones() {
    try {
      const store = userStore();

      const respuesta = await apiClient.get(
        `/transactions?q={"user_id": "${store.Usuario}"}`
      );
      return respuesta.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  static async borrarTransaccion(id){
    try{
      await apiClient.delete(`/transactions/${id}`)
    }catch(error){
      console.log(error)
    }
  }
}
export default Transacciones;
