<template>
  <div v-if="store.Logueado">
    <NavBar />
    <div class="operar-container">
      <div class="operar-box">
        <h1>Operar con Criptomonedas</h1>
        <div class="form-group">
          <label>Tipo de operación</label>
          <select v-model="operacion.action">
            <option v-for="operacion in ManagerC.TraerOperaciones()" :key="operacion.option" :value="operacion.option">
              {{ operacion.name }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label>Tipo de criptomoneda</label>
          <select v-model="operacion.crypto_code">
            <option v-for="moneda in ManagerC.TraerCrypto()" :key="moneda.code" :value="moneda.code">
              {{ moneda.name }}
            </option>
          </select>
        </div>
        <div>
          <label>Criptomonedas disponibles: {{ saldoDeUsuario }}</label>
        </div>
        <div>
        </div>
        <div class="form-group">
          <label>Cantidad de criptomonedas a comprar/vender</label>
          <input type="number" min="0.000001" v-model="operacion.crypto_amount">
        </div>
        <p>Cantidad en pesos argentinos ${{ operacion.money }}</p>
        <div class="form-group-row">
          <div class="form-group">
            <label>Fecha</label>
            <input v-model="fecha.actual" type="date" />
          </div>
          <div class="form-group">
            <label>Hora</label>
            <input v-model="fecha.hora" type="time" />
          </div>
        </div>
        <button @click="CompraVenta" class="btn-principal">Operar</button>
      </div>
    </div>
  </div>
  <div v-else>
    <RequiereLogin />
  </div>

</template>

<script setup>
import ManagerCripto from "@/services/apiManagerCripto"
import { userStore } from "@/store/user"
import { ref, watch, onMounted } from "vue"
import { useRouter } from "vue-router"
import Transacciones from "@/services/apiTransacciones"
import NavBar from '@/components/BarraNavegacion.vue'
import RequiereLogin from "@/components/RequiereLogin.vue"
import { useToast } from 'vue-toastification';

const toast = useToast()
const ruta = useRouter()
const store = userStore()
const ManagerC = new ManagerCripto()

//creo un objeto para guardar todo lo que el usuario llena en el formulario de compra/venta:
let operacion = ref({
  user_id: store.Usuario,
  action: 'purchase', //por defecto es compra
  crypto_code: 'btc', //por defecto es bitcoin
  crypto_amount: 0, //cantidad que el usuario quiere comprar o vender
  money: 0, //cuánto dinero sería en $
  datetime: '' //la fecha y hora de la operación
})

//Función para actualizar el costo de las cripto en $:
const ActualizarPrecio = async () => {
  const cantidadCripto = Number(operacion.value.crypto_amount) || 0;
  if (cantidadCripto <= 0) {
    operacion.value.money = 0;
    return;
  }
  const { totalAsk, totalBid } = await ManagerC.TraerPrecio(operacion.value.crypto_code)//totalAsk es precio si compro, totalBid es precio si vendo
    const precio = operacion.value.action === "purchase" ? totalAsk : totalBid;
    operacion.value.money = (precio * cantidadCripto).toFixed(2);
    /* traer precio devuelve todos los datos del objeto: que lo obtiene llamando a la api que lo llamamos pasando el tipo de criptomoneda
  de todo ese objeto yo voy a usar dos datos:
"totalAsk": 109568192.72, -----> me trae el precio de compra
"totalBid": 100841520, -----> me trae el precio de venta.*/
      
}

//Esto es para la fecha y hora:
const fechaActual = new Date();
let fecha = ref({
  actual: fechaActual.toISOString().split('T')[0], //fecha en formato año/mes/día
  hora: fechaActual.toTimeString().slice(0, 5) //por defecto va a mostrar la hora actual al ingresar a la pantalla
});

const Fecha = () => {
  operacion.value.datetime = `${fecha.value.actual}T${fecha.value.hora}`;
}

const CompraVenta = async () => {
  const cantidadCripto = Number(operacion.value.crypto_amount);

  if (cantidadCripto <= 0) {
    toast.warning('Por favor ingrese una cantidad válida de criptomonedas.');
    return;
  }

  if (operacion.value.action === 'sale' && saldoDeUsuario.value < cantidadCripto) {
    toast.error('No tienes suficiente saldo para vender esta cantidad.');
    return;
  }

  try {
    Fecha(); //actualizo la fecha y hora
    await Transacciones.crearTransaccion(operacion.value);
    toast.success('Operación realizada con éxito.');
    ruta.push({ name: 'historial' });
  } catch (error) {
    console.error(error);
    toast.error('Error al realizar la operación.');
  }
};

const saldoDeUsuario = ref(0);
const conseguirSaldoUsuario = async () => {
  try {
    await Transacciones.traerTransacciones() //traigo las transacciones del usuario llamando a la api con la función
    const saldo = Transacciones.conseguirSaldo(); //calculo los saldos de cada cripto
    const moneda = saldo.find((cripto) => cripto.codigo === operacion.value.crypto_code);//Busca el saldo de la cripto que está seleccionada en el formulario
    saldoDeUsuario.value = moneda ? moneda.saldo : 0;//si moneda existe actualiza el saldo, sino pone 0
  }
  catch (error) {
    console.log(error)
  }

}
watch(() => operacion.value.crypto_amount, ActualizarPrecio); //si cambia un dato, ejecuta la función
watch(fecha, Fecha);
watch(() => operacion.value.crypto_code, conseguirSaldoUsuario)
onMounted(() => {
  Fecha();
  conseguirSaldoUsuario()
})
</script>

<style scoped>
* {
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.operar-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #c2dedd;
  padding: 20px;
}

.operar-box {
  background-color: #ffffff;
  padding: 28px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  width: 600px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

input,
select {
  padding: 12px;
  font-size: 15px;
  border: 1px solid #cfd8dc;
  border-radius: 4px;
  outline: none;
}

input:focus,
select:focus {
  border-color: #3949ab;
  box-shadow: 0 0 0 2px rgba(57, 73, 171, 0.1);
}

.btn-principal {
  background-color: #1a237e;
  color: white;
  border: none;
  padding: 12px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-principal:hover {
  background-color: #0d154c;
}

.form-group-row {
  display: flex;
  flex-direction: row;
  gap: 20px;
  justify-content: center;
}
</style>