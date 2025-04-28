import apiClient from "./apiBase";
import { ref } from "vue";
import { userStore } from "@/store/user";
import ManagerCripto from "./apiManagerCripto";

class Transacciones {
  static Transaccion = ref([]);

  //creo un método que va a recibir una transacción como parámetro y se la pasa a la api base, a la parte de transacciones
  static async crearTransaccion(transaccion) {
    try {
      const respuesta = await apiClient.post("/transactions", transaccion); //a la ruta que me pasa el apiClient le agrego la ruta "transactions" para que me lleve a esa ventana
      console.log(respuesta, "datos respuesta");
    } catch (error) {
      console.log(error);
    }
  }
  
  //creo un método para traer todas las transacciones de un usuario específico y devolverlas en una variable donde las guardo 
  static async traerTransacciones() {
    try {
      const store = userStore(); //declaro una variable para usar pinia

      const respuesta = await apiClient.get(`/transactions?q={"user_id": "${store.Usuario}"}`); //llamo a la api base y traigo todas las transacciones del usuario que le paso por id
      Transacciones.Transaccion.value = respuesta.data; //guardo esos datos que conseguí arriba en la variable Transaccion
      return respuesta.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  static async borrarTransaccion(id) {
    try {
      await apiClient.delete(`/transactions/${id}`);
    } catch (error) {
      console.log(error);
    }
  }
  static conseguirSaldo() { //esta función ordena y calcula por criptomoneda el saldo disponible de cada una 
    const saldos = []; //este array se va a devolver cuando sea llamado desde el historial
    const saldosTrabajados = {}; //acá se va a trabajar los saldos de distintas criptomonedas
    const criptos = new ManagerCripto();
    const criptosValidas = new Set(criptos.TraerCrypto().map((c) => c.code));
    let criptoPrevia = "";
    //ordenar transacciones:
    const transaccionesOrdenadas = Transacciones.Transaccion.value
      .slice()
      .sort((a, b) => a.crypto_code.localeCompare(b.crypto_code));

    transaccionesOrdenadas.forEach((trade) => {
      if (!criptosValidas.has(trade.crypto_code)) return; //si las cripto no son válidas las ignora
      if (criptoPrevia !== trade.crypto_code) {
        if (criptoPrevia) {
          saldos.push({
            codigo: criptoPrevia,
            saldo: saldosTrabajados[criptoPrevia],
          });
        }
        criptoPrevia = trade.crypto_code;
        saldosTrabajados[criptoPrevia] = 0;
      }

      switch (trade.action) {
        case "purchase":
          saldosTrabajados[criptoPrevia] += trade.crypto_amount;
          break;
        case "sale":
          saldosTrabajados[criptoPrevia] -= trade.crypto_amount;
          break;
      }
    });

    if (criptoPrevia) {
      saldos.push({
        codigo: criptoPrevia,
        saldo: saldosTrabajados[criptoPrevia],
      });
    }
    return saldos;
  }

  static async editarTransacciones(transaccion) {
    try {
      await apiClient.patch(`/transactions/${transaccion._id}`, transaccion);
    } catch (error) {
      console.log(error);
    }
  }
}
export default Transacciones;
