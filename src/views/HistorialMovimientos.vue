<template>
    <div v-if="store.Logueado">
        <h2>Historial de operaciones</h2>
        <div>
            <table v-if="movimientos.length !== 0">
                <thead>
                    <tr>
                        <th></th> <!--en esta columna van a ir los números de renglones-->
                        <th>Tipo</th>
                        <th>Criptomoneda</th>
                        <th>Total</th>
                        <th>Dinero</th>
                        <th>Fecha y Hora</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(movimiento, i) in movimientos" :key="i">
                        <td>{{ i + 1 }}</td>
                        <td>{{ movimiento.action }}</td>
                        <td> {{ movimiento.crypto_code }}</td>
                        <td>{{ movimiento.crypto_amount }}</td>
                        <td> {{ movimiento.money }}</td>
                        <td> {{ new Date(movimiento.datetime).toLocaleDateString('es-ES', { timeZone: 'UTC' }) }}</td>
                        <th>
                            <button @click="borrar(movimiento._id)" >Eliminar</button>
                            <button>Editar</button>
                        </th>

                    </tr>
                </tbody>

            </table>
            <p v-else>No hay movimientos</p>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { userStore } from '@/store/user'; //1° importo la función del user
import Transacciones from '@/services/apiTransacciones';
import { onMounted } from 'vue';

const store = userStore() //2° luego creo una variable donde voy a guardar los datos que obtenga con dicha función

const movimientos = ref([
    {
        _id:"",
        action: "",
        crypto_code: "",
        crypto_amount: "",
        money: 0,
        datetime: ""
    }
]);

const datos = async () => {
    try {
        const datos = await Transacciones.traerTransacciones();
        movimientos.value = datos
        console.log(datos)
        console.log(movimientos.value)
    }
    catch (error) {
        console.log(error)
    }
}

const borrar = async (id) => {
    await Transacciones.borrarTransaccion(id)
    await datos()

}

onMounted(async () => {
    await datos()
    console.log("cargadp")
})

</script>

<style scoped>
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }

  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
  }

  th {
    background-color: #f2f2f2;
    font-weight: bold;
  }

  tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  tr:hover {
    background-color: #f1f1f1;
  }

  button {
    padding: 5px 10px;
    margin: 0 5px;
    border: none;
    border-radius: 4px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
  }

  button:hover {
    background-color: #0056b3;
  }
</style>