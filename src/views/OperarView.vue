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
                Fecha: <input type="date"/>

            </label>
            <label>
                Hora: <input type="time"/>
                
            </label>

        </div>
    </div>

</template>

<script setup>
import ManagerCripto from "@/services/apiManagerCripto"
import { userStore } from "@/store/user"
import { ref, watch } from "vue"

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
    function calcularTotal(precio, tipoOperacion, cantidad) {
        if (tipoOperacion === 'purchase') {
            return precio.totalAsk * cantidad
        } else {
            return precio.totalBid * cantidad
        }
    }
    const cantidadCripto = validarCantidadCripto(operacion.value.crypto_amount)
    if (cantidadCripto > 0) {
        const precio = await ManagerC.TraerPrecio(operacion.value.crypto_code)
        /* traer precio devuelve este objeto: que lo obtiene llamando a la api que lo llamamos pasando el tipo de criptomoneda
        {
  "ask": 109568192.72,
  "totalAsk": 109568192.72,
  "bid": 100841520,
  "totalBid": 100841520,
  "time": 1733306089
}
        */
        operacion.value.money = calcularTotal(precio, operacion.value.action, cantidadCripto).toFixed(2)
    } else {
        operacion.value.money = 0
    }
}
watch(ActualizarPrecio, operacion.value)
</script>