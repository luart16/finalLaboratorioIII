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
          <label for="">Criptomonedas disponibles: {{ saldoDeUsuario }}</label>
        </div>
        <div>
        </div>
        <div class="form-group">
          <label>Cantidad de criptomonedas</label>
          <input type="number" min="0.000001" v-model="operacion.crypto_amount" placeholder="Cantidad de criptomonedas">
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
import NavBar from '@/components/Navegacion-Component.vue'
import RequiereLogin from "@/components/RequiereLogin.vue"

import { useToast } from 'vue-toastification';
const toast = useToast()

const ruta = useRouter()
const store = userStore()
const ManagerC = new ManagerCripto()

let operacion = ref({
  user_id: store.Usuario,
  action: 'purchase', //compra
  crypto_code: 'btc',
  crypto_amount: 0,
  money: 0,
  datetime: ''
})
const ActualizarPrecio = async () => {
  function validarCantidadCripto(cantidad) {
    const numeroCantidad = Number(cantidad)
    return isNaN(numeroCantidad) || numeroCantidad <= 0 ? 0 : numeroCantidad
  }

  const cantidadCripto = validarCantidadCripto(operacion.value.crypto_amount)
  if (cantidadCripto > 0) {
    const { totalAsk, totalBid } = await ManagerC.TraerPrecio(operacion.value.crypto_code)
    const precio = operacion.value.action === "purchase" ? totalAsk : totalBid;
    operacion.value.money = (precio * cantidadCripto).toFixed(2);
    /* traer precio devuelve este dos datos del siguiente objeto: que lo obtiene llamando a la api que lo llamamos pasando el tipo de criptomoneda
    {
"ask": 109568192.72,
"totalAsk": 109568192.72, ++++++ me trae esto
"bid": 100841520,
"totalBid": 100841520, ++++++ y me trae esto. Son las dos cosas que le estoy pidiendo del objeto
"time": 1733306089
}
    */
  } else {
    operacion.value.money = 0
  }
}
//Esto es para la fecha y hora:
const fechaActual = new Date();
let fecha = ref({
  actual: fechaActual.toISOString().split('T')[0], //fecha en formato año/mes/día
  hora: "00:00", //hora inicial predeterminada que va a figurar en la pantalla antes de cambiarla
});

const Fecha = () => {
  const [anio, mes, dia] = fecha.value.actual.split("-").map(Number);
  const [hora, minuto] = fecha.value.hora.split(":").map(Number);
  operacion.value.datetime = new Date(anio, mes - 1, dia, hora, minuto).toISOString();
}

const CompraVenta = async () => {
  const { action, crypto_amount } = operacion.value;  
  if (!crypto_amount || crypto_amount <= 0) { //valido que se coloque una cantidad
    toast.warning('La cantidad debe ser mayor a cero. Operación cancelada');
    return;
  }

  try {
    if (action === 'purchase') {
      console.log(operacion.value);
      await Transacciones.postTransaccion({ ...operacion.value });
      toast.success('Compra exitosa');
      ruta.push({ name: 'historial' });
    } else {
      // Venta: verificar saldo
      if (saldoDeUsuario.value >= crypto_amount) {
        await Transacciones.postTransaccion({ ...operacion.value });
        toast.success('Venta exitosa');
        ruta.push({ name: 'historial' });
      } else {
        toast.warning('Cantidad de criptomonedas insuficientes. Operación cancelada');
      }
    }
  } catch (error) {
    console.error(error);
    toast.error('Ocurrió un error al procesar la transacción');
  }
};

const saldoDeUsuario = ref(0);
const conseguirSaldoUsuario = async () => {
  try {
    await Transacciones.traerTransacciones()
    const saldo = Transacciones.conseguirSaldo();
    console.log(saldo)
    const moneda = saldo.find((cripto) => cripto.codigo === operacion.value.crypto_code);
    console.log(moneda, "moneda")
    saldoDeUsuario.value = moneda ? moneda.saldo : 0;
    console.log(saldoDeUsuario.value, "saldo de usuario")
  }
  catch (error) {
    console.log(error)
  }

}
watch(ActualizarPrecio, operacion.value);
watch(fecha, Fecha());
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