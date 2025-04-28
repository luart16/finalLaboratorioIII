<template>
    <div v-if="store.Logueado">
        <NavBar />
        <div class="estado-container">
            <h1>Estado Actual de tus Criptomonedas</h1>

            <table class="tabla-estado">
                <thead>
                    <tr>
                        <th>Criptomoneda</th>
                        <th>Saldo</th>
                        <th>Valor actual (ARS)</th>
                        <th>Total en ARS</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="cripto in estadoActual" :key="cripto.codigo">
                        <td>{{ cripto.codigo.toUpperCase() }}</td>
                        <td>{{ cripto.saldo.toFixed(6) }}</td>
                        <td>${{ cripto.precioARS.toFixed(2) }}</td>
                        <td>${{ cripto.totalARS.toFixed(2) }}</td>
                    </tr>
                </tbody>
            </table>

            <div class="total-global">
                <h2>Valor total: ${{ valorTotal.toFixed(2) }}</h2>
            </div>
        </div>
    </div>

    <div v-else>
        <RequiereLogin />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Transacciones from '@/services/apiTransacciones'
import { userStore } from '@/store/user'
import ManagerCripto from '@/services/apiManagerCripto'
import NavBar from '@/components/BarraNavegacion.vue'
import RequiereLogin from '@/components/RequiereLogin.vue'

const store = userStore();
const ManagerC = new ManagerCripto()
const estadoActual = ref([]);
const valorTotal = ref(0);

const traerEstadoActual = async () => {
    try {
        // 1.Trae todas las transacciones
        await Transacciones.traerTransacciones();

        // 2.Calcula el saldo disponible de cada cripto
        const saldos = Transacciones.conseguirSaldo();

        // 3.Trae el precio actual desde CriptoYa para cada cripto
        const precioActualCripto = saldos.map(async (cripto) => {
            const datosDelPrecio = await ManagerC.TraerPrecio(cripto.codigo);
            const precioARS = datosDelPrecio.ask || datosDelPrecio.totalAsk || 0;

            return {
                codigo: cripto.codigo,
                saldo: cripto.saldo,
                precioARS,
                totalARS: cripto.saldo * precioARS,
            };
        });

        const resultados = await Promise.all(precioActualCripto);
        estadoActual.value = resultados;

        // 4.Calcula valor total
        valorTotal.value = resultados.reduce((sum, cripto) => sum + cripto.totalARS, 0);
    } catch (error) {
        console.error('Error al traer el estado actual:', error);
    }
}

onMounted(() => {
    traerEstadoActual();
});
</script>

<style scoped>
.estado-container {
    padding: 20px;
    background-color: #eef2f7;
    min-height: 100vh;
}

.tabla-estado {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    background-color: #ffffff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    overflow: hidden;
}

.tabla-estado th,
.tabla-estado td {
    padding: 14px;
    text-align: center;
    border-bottom: 1px solid #ddd;
}

.tabla-estado th {
    background-color: #3949ab;
    color: white;
}

.tabla-estado tr:hover {
    background-color: #f1f1f1;
}

.total-global {
    margin-top: 30px;
    font-size: 24px;
    font-weight: bold;
    text-align: right;
}
</style>