<template>
    <div>
        <div> <!--este div es para los cuadritos de venta y opción de criptomoneda  -->
            <select v-model="operacion.action">
                <option v-for="operacion in ManagerC.TraerOperaciones()" :key="operacion.option"
                    :value="operacion.option">
                    {{ operacion.name }}
                </option>
            </select>
            <select v-model="operacion.crypto_code">
                <option v-for="moneda in ManagerC.TraerCrypto()" :key="moneda.code" :value="moneda.code">
                    {{ moneda.name }}
                </option>
            </select>
        </div>
        <div> <!--este div es para el cuadro de cantidad de criptomonedas  -->
            <input type="number" min="0.000001" v-model="operacion.crypto_amount"
                placeholder="Cantidad de criptomonedas">
            <p>Cantidad en pesos argentinos ${{ operacion.money }}</p>
        </div>
        <div><!--este div es para la fecha y hora  -->
            <label>
                Fecha: <input v-model="fecha.actual" type="date" />

            </label>
            <label>
                Hora: <input v-model="fecha.hora" type="time" />

            </label>

        </div>
        <div>
            <button @click="CompraVenta"> Operar</button>
        </div>
    </div>

</template>

<script setup>
import ManagerCripto from "@/services/apiManagerCripto"
import { userStore } from "@/store/user"
import { ref, watch, onMounted } from "vue"
import Transacciones from "@/services/apiTransacciones"

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
        const { totalAsk, totalBid} = await ManagerC.TraerPrecio(operacion.value.crypto_code)
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

const Fecha = () =>  {
    const [anio, mes, dia] = fecha.value.actual.split("-").map(Number);
    const [hora, minuto] = fecha.value.hora.split(":").map(Number);
    operacion.value.datetime = new Date(anio, mes -1, dia, hora, minuto).toISOString();
}

const CompraVenta = async () => {
    const { action } = operacion.value;
    try {
        if (action === "purchase") {
            console.log(operacion.value)
            await Transacciones.postTransaccion({...operacion.value})
            console.log("Operación exitosa")

        }
    }
    catch(error) {
        console.log(error)
    }
}

watch(ActualizarPrecio, operacion.value);
watch(fecha, Fecha());

onMounted(() => {
    Fecha();
})
</script>