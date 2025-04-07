import apiClient from "./apiBase";
import { ref } from "vue";

class Transacciones {
  static Transaccion = ref([]);

  static async postTransaccion(transaccion) {
    try{
        const respuesta = await apiClient.post("/transactions", transaccion ); //a la ruta que me pasa el apiClient le agrego la ruta "transactions" para que me lleve a esa ventana
        console.log(respuesta, "datos respuesta");
    }
    catch (error) {
        console.log(error);
    }
  }
}
export default Transacciones;
