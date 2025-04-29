<template>
  <div v-if="store.Logueado">
    <NavBar />

    <!-- Pantalla de carga -->
    <div v-if="isLoading" class="loading-screen">
      <div class="spinner"></div>
      <p>Cargando...</p>
    </div>

    <!-- Contenido principal -->
    <div v-if="!isLoading">
      <h2>Historial de operaciones</h2>

      <div>
        <table v-if="movimientos.length !== 0">
          <thead>
            <tr>
              <th>#</th>
              <th>Tipo Operación</th>
              <th>Criptomoneda</th>
              <th>Total</th>
              <th>Dinero (ARS)</th>
              <th>Fecha y Hora</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(movimiento, i) in movimientos" :key="movimiento._id">
              <td>{{ i + 1 }}</td>
              <td>{{ movimiento.action }}</td>
              <td>{{ movimiento.crypto_code }}</td>
              <td>{{ movimiento.crypto_amount }}</td>
              <td>{{ movimiento.money }}</td>
              <td>{{ new Date(movimiento.datetime).toLocaleString('es-ES', { timeZone: 'UTC' }) }}</td>
              <td>
                <button @click="borrar(movimiento._id)">Eliminar</button>
                <button @click="verificarParaEditar(movimiento._id)">Editar</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else>No hay movimientos</p>
      </div>
    </div>

    <!-- Modal Eliminar -->
    <div v-if="mostrarModalEliminar" class="modal-overlay">
      <div class="modal-content">
        <h2>¿Eliminar movimiento?</h2>
        <p>Esta acción no se puede deshacer</p>
        <div class="modal-actions">
          <button @click="confirmarBorrado" class="btn-danger">Eliminar</button>
          <button @click="mostrarModalEliminar = false" class="btn-cancel">Cancelar</button>
        </div>
      </div>
    </div>

    <!-- Modal Editar -->
    <div v-if="mostrarModal" class="modal-overlay">
      <div class="modal-content">
        <h2>Editar movimiento</h2>
        <div>
          <label>Cantidad de criptomonedas:</label>
          <input type="number" v-model="movimientoAEditar.crypto_amount" required step="0.000001" min="0">
        </div>
        <div>
          <label>Tipo de criptomoneda:</label>
          <select v-model="movimientoAEditar.crypto_code" required>
            <option v-for="cripto in managerCripto.TraerCrypto()" :key="cripto._id" :value="cripto.code">
              {{ cripto.code }}
            </option>
          </select>
        </div>
        <div>
          <label>Fecha:</label>
          <input type="date" v-model="movimientoAEditar.datetime">
        </div>
        <div>
          <label>Hora:</label>
          <input type="time" v-model="movimientoAEditar.time">
        </div>
        <div>
          <p v-if="mensaje" class="error-message">{{ mensaje }}</p>
        </div>
        <div class="modal-actions">
          <button @click="guardarLoEditado" class="btn-save">Guardar</button>
          <button @click="mostrarModalEditar = false" class="btn-cancel">Cancelar</button>
        </div>
      </div>
    </div>


  </div>
  <div v-else>
    <RequiereLogin />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { userStore } from '@/store/user'
import Transacciones from '@/services/apiTransacciones'
import { onMounted } from 'vue'
import ManagerCripto from '@/services/apiManagerCripto'
import NavBar from '@/components/BarraNavegacion.vue'
import RequiereLogin from "@/components/RequiereLogin.vue"
import { useToast } from 'vue-toastification';
const toast = useToast()

const managerCripto = new ManagerCripto()
const store = userStore()

// variables reactivas
const isLoading = ref(true)
const mensaje = ref('')
const movimientoAEditar = ref({ time: '00:00' })
const mostrarModalEditar = ref(false) //abre y cierra modal
const mostrarModalEliminar = ref(false)
const movimientoAEliminar = ref(null) //guarda el id que se quiere borrar
const movimientos = ref([])

// Obtener datos iniciales: este método me trae todas las transacciones por usuario y lo guarda en movimientos, variable que voy a usar en el html para mostrarlos
const datos = async () => {
  try {
    const respuesta = await Transacciones.traerTransacciones()
    movimientos.value = respuesta.sort((a, b) => new Date(a.datetime) - new Date(b.datetime))//ordeno las transacciones de más viejas a más nuevas
  } catch (error) {
    console.error('Error al cargar transacciones:', error)
    toast.warning("Error al cargar los datos")
  }
}

// Método de eliminar: recibe el id y lo guarda en la variable, pasa el modal a true y se muestra el modal y pasa a la función de confirmar eliminar
const borrar = (id) => {
  movimientoAEliminar.value = id
  mostrarModalEliminar.value = true
}

const confirmarBorrado = async () => {
  try {
    await Transacciones.borrarTransaccion(movimientoAEliminar.value) //recibe el id guardado 
    toast.warning('Borrado realizado')
    await datos() // y recarga los movimientos ya actualizados con ese valor borrado
  } catch (error) {
    console.error('Error al eliminar:', error)
    toast.warning("Error al eliminar la transacción")
  } finally {
    mostrarModalEliminar.value = false //y por último vuelve el modal a false para cerrarlo
  }
}

// Lógica de edición
const verificarParaEditar = async (id) => {
  const transaccion = movimientos.value.find(mov => mov._id === id)

  if (await validarTransaccion(transaccion)) {
    const fechaOriginalTransaccion = new Date(transaccion.datetime)

    const fechaSinHora = fechaOriginalTransaccion.toISOString().split('T')[0] // YYYY-MM-DD
    const horaSinFecha = fechaOriginalTransaccion.toISOString().split('T')[1].slice(0, 5) // HH:MM

    movimientoAEditar.value = {
      ...transaccion,
      datetime: fechaSinHora,
      time: horaSinFecha
    }
    mostrarModalEditar.value = true
  }
}

const validarTransaccion = async (transaccion) => {
  if (!transaccion) { //verifica que exista
    toast.warning("Transacción no válida")
    return false
  }

  const cantidad = Number(transaccion.crypto_amount)
  if (isNaN(cantidad) || cantidad <= 0) { //que el monto sea válido
    toast.warning("El monto debe ser un número positivo")
    return false
  }

  try {
    const saldoDeCuenta = await Transacciones.conseguirSaldo()
    const criptoBalance = saldoDeCuenta.find(c => c.codigo === transaccion.crypto_code)

    if (!criptoBalance) {
      toast.warning("Criptomoneda no encontrada en el balance")
      return false
    }

    if (transaccion.action === 'sale' && cantidad > criptoBalance.saldo) {//que haya saldo
      toast.warning("Fondos insuficientes para esta transacción")
      return false
    }

    return true
  } catch (error) {
    console.error('Error en validación:', error)
    toast.warning("Error al validar la transacción")
    return false
  }
}

const guardarLoEditado = async () => {
  try {
    mensaje.value = ""

    if (await validarTransaccion(movimientoAEditar.value)) {
      // Crear fecha en UTC
      const [anio, mes, dias] = movimientoAEditar.value.datetime.split('-')
      const [horas, minutos] = movimientoAEditar.value.time.split(':')

      const fechaActual = new Date(Date.UTC(
        parseInt(anio),
        parseInt(mes) - 1, // Los meses van de 0-11
        parseInt(dias),
        parseInt(horas),
        parseInt(minutos)
      )
      )

      await Transacciones.editarTransacciones({
        ...movimientoAEditar.value,
        datetime: fechaActual.toISOString()
      })
      toast.success("Modificación exitosa")
      await datos()
      mostrarModalEditar.value = false
    }
  } catch (error) {
    console.error('Error al guardar:', error)
    mensaje.value = "Error al guardar los cambios"
  }
}
// Carga inicial
onMounted(async () => {
  try {
    await datos()
  } catch (error) {
    console.error('Error en montaje:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
/* Estilos de tabla */
table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

th,
td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f8f9fa;
  font-weight: 600;
}

tr:hover {
  background-color: #f1f1f1;
}

/* Botones principales */
button {
  padding: 8px 16px;
  margin: 0 4px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

button:hover {
  transform: translateY(-1px);
}

/* Pantalla de carga */
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* Modales */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-actions {
  margin-top: 1.5rem;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

/* Estilos específicos de botones */
.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-save {
  background-color: #28a745;
  color: white;
}

.btn-cancel {
  background-color: #6c757d;
  color: white;
}

.error-message {
  color: #dc3545;
  margin: 10px 0;
  font-weight: bold;
}

/* Ajustes inputs */
input,
select {
  width: 100%;
  padding: 8px;
  margin: 5px 0 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}


input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>