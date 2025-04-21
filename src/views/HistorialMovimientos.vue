<template>
  <div v-if="store.Logueado">
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
              <th>Tipo</th>
              <th>Criptomoneda</th>
              <th>Total</th>
              <th>Dinero</th>
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
              <td>{{ new Date(movimiento.datetime).toLocaleDateString('es-ES', { timeZone: 'UTC' }) }}</td>
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
            <option v-for="cripto in managerCripto.TraerCrypto()" 
                    :key="cripto._id" 
                    :value="cripto.code">
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
          <button @click="mostrarModal = false" class="btn-cancel">Cancelar</button>
        </div>
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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { userStore } from '@/store/user'
import Transacciones from '@/services/apiTransacciones'
import { onMounted } from 'vue'
import ManagerCripto from '@/services/apiManagerCripto'

const managerCripto = new ManagerCripto()
const store = userStore()

// Estados reactivos
const isLoading = ref(true)
const mensaje = ref('')
const movimientoAEditar = ref({ time: '00:00' })
const mostrarModal = ref(false)
const mostrarModalEliminar = ref(false)
const movimientoAEliminar = ref(null)
const movimientos = ref([])

// Obtener datos iniciales
const datos = async () => {
  try {
    const respuesta = await Transacciones.traerTransacciones()
    movimientos.value = respuesta
  } catch (error) {
    console.error('Error al cargar transacciones:', error)
    mensaje.value = "Error al cargar los datos"
  }
}

// Lógica de eliminación
const borrar = (id) => {
  movimientoAEliminar.value = id
  mostrarModalEliminar.value = true
}

const confirmarBorrado = async () => {
  try {
    await Transacciones.borrarTransaccion(movimientoAEliminar.value)
    await datos()
  } catch (error) {
    console.error('Error al eliminar:', error)
    mensaje.value = "Error al eliminar la transacción"
  } finally {
    mostrarModalEliminar.value = false
  }
}

// Lógica de edición
const verificarParaEditar = async (id) => {
  mensaje.value = ""
  const transaccion = movimientos.value.find(mov => mov._id === id)
  
  if (await validarTransaccion(transaccion)) {
    const fechaUTC = new Date(transaccion.datetime)
    const fechaLocal = new Date(fechaUTC.getTime() + fechaUTC.getTimezoneOffset() * 60000)
    
    movimientoAEditar.value = {
      ...transaccion,
      datetime: fechaLocal.toISOString().split('T')[0],
      time: `${String(fechaLocal.getHours()).padStart(2, '0')}:${String(fechaLocal.getMinutes()).padStart(2, '0')}`
    }
    mostrarModal.value = true
  }
}

const validarTransaccion = async (transaccion) => {
  if (!transaccion) {
    mensaje.value = "Transacción no válida"
    return false
  }
  
  const cantidad = Number(transaccion.crypto_amount)
  if (isNaN(cantidad) || cantidad <= 0) {
    mensaje.value = "El monto debe ser un número positivo"
    return false
  }

  try {
    const saldoDeCuenta = await Transacciones.conseguirSaldo()
    const criptoBalance = saldoDeCuenta.find(c => c.codigo === transaccion.crypto_code)
    
    if (!criptoBalance) {
      mensaje.value = "Criptomoneda no encontrada en el balance"
      return false
    }
    
    if (transaccion.action === 'sale' && cantidad > criptoBalance.saldo) {
      mensaje.value = "Fondos insuficientes para esta transacción"
      return false
    }
    
    return true
  } catch (error) {
    console.error('Error en validación:', error)
    mensaje.value = "Error al validar la transacción"
    return false
  }
}

const guardarLoEditado = async () => {
  try {
    mensaje.value = ""
    
    if (await validarTransaccion(movimientoAEditar.value)) {
      const [horas, minutos] = movimientoAEditar.value.time.split(':')
      const fechaActual = new Date(movimientoAEditar.value.datetime)
      fechaActual.setHours(horas)
      fechaActual.setMinutes(minutos)
      
      await Transacciones.editarTransacciones({
        ...movimientoAEditar.value,
        datetime: fechaActual.toISOString()
      })
      
      await datos()
      mostrarModal.value = false
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
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

th, td {
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
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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
input, select {
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