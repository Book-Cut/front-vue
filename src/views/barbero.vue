<template>
    <HeaderNav />

    <main class="container py-4">
        <ConfirmacionCitaModal
            :mostrar="Boolean(citaPorConfirmar)"
            :accion="accionCita"
            :procesando="saving"
            @confirmar="confirmarAccionCita"
            @cerrar="citaPorConfirmar = null"
        />
        <RegistrarPagoModal
            :mostrar="Boolean(citaPorPagar)"
            :procesando="saving"
            @registrar="registrarPago"
            @cerrar="citaPorPagar = null"
        />
        <div v-if="errorMessage" class="alert alert-danger" role="alert">
            {{ errorMessage }}
        </div>

        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h1 class="h2 mb-0"><i class="bi bi-calendar-check me-2"></i>Mis Citas Asignadas</h1>
                <p class="text-secondary m-0">Consulta y administra las citas programadas en tu agenda.</p>
            </div>
            <button class="btn btn-outline-dark" type="button" :disabled="loadingCitas" @click="loadCitas">
                <i class="bi bi-arrow-clockwise me-1"></i> Actualizar
            </button>
        </div>

        <div v-if="citasError" class="alert alert-danger" role="alert">
            {{ citasError }}
        </div>

        <p v-if="loadingCitas" class="text-secondary text-center py-4">Cargando tus citas...</p>

        <div v-else class="table-responsive shadow-sm rounded border">
            <table class="table table-striped align-middle mb-0">
                <thead class="table-dark">
                    <tr>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Cliente</th>
                        <th>Teléfono</th>
                        <th>Servicios</th>
                        <th>Estado</th>
                        <th>Pago</th>
                        <th>Modalidad</th>
                        <th>Total</th>
                        <th class="text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="cita in citas" :key="cita.idCita">
                        <td>{{ cita.Fecha || '—' }}</td>
                        <td>{{ cita.Hora || '—' }}</td>
                        <td class="fw-bold">{{ cita.Cliente || '—' }}</td>
                        <td>{{ cita.Telefono || '—' }}</td>
                        <td>{{ cita.Servicios || '—' }}</td>
                        <td>
                            <span v-if="cita.Estado" class="badge" :class="estadoClass(cita.Estado)">
                                {{ cita.Estado }}
                            </span>
                            <span v-else>—</span>
                        </td>
                        <td>{{ cita.EstadoPago }}</td>
                        <td>{{ cita.ModalidadPago }}</td>
                        <td class="fw-bold">{{ cita.Total === null ? '—' : formatCurrency(cita.Total) }}</td>
                        <td class="text-center">
                            <button
                                v-if="cita.ModalidadPago === 'Presencial' && cita.EstadoPago === 'Pendiente' && ['Confirmado', 'Finalizado'].includes(cita.Estado)"
                                class="btn btn-sm btn-outline-primary me-2"
                                type="button"
                                :disabled="saving"
                                @click="abrirRegistroPago(cita.idCita)"
                            >
                                Registrar pago
                            </button>
                            <button
                                v-if="cita.Estado === 'Confirmado'"
                                class="btn btn-sm btn-outline-success me-2"
                                type="button"
                                :disabled="saving"
                                @click="abrirConfirmacion(cita.idCita, 'finalizar')"
                            >
                                Finalizar
                            </button>
                            <button
                                v-if="cita.Estado !== 'Cancelado' && cita.Estado !== 'Finalizado'"
                                class="btn btn-sm btn-outline-danger"
                                type="button"
                                :disabled="saving"
                                @click="abrirConfirmacion(cita.idCita, 'cancelar')"
                            >
                                Cancelar
                            </button>
                            <span v-if="cita.Estado === 'Cancelado'" class="text-muted small">Cancelada</span>
                            <span v-else-if="cita.Estado === 'Finalizado'" class="text-muted small">Finalizada</span>
                        </td>
                    </tr>
                    <tr v-if="citas.length === 0 && !citasError">
                        <td colspan="10" class="text-center py-4 text-secondary">No tienes citas asignadas actualmente.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import HeaderNav from '../components/HeaderNav.vue'
import ConfirmacionCitaModal from '../components/ConfirmacionCitaModal.vue'
import RegistrarPagoModal from '../components/RegistrarPagoModal.vue'
import { listarCitas, cancelarCita, finalizarCita, pagarCita } from '../services/citas.service'

const citas = ref([])
const loadingCitas = ref(false)
const citasError = ref('')
const errorMessage = ref('')
const saving = ref(false)
const citaPorConfirmar = ref(null)
const citaPorPagar = ref(null)
const accionCita = ref('cancelar')

onMounted(() => {
    loadCitas()
})

async function loadCitas() {
    loadingCitas.value = true
    citasError.value = ''

    try {
        // El backend ya filtra las citas según el barbero logueado, 
        // así que solo llamamos a la función y asignamos directamente el resultado.
        citas.value = await listarCitas()
    } catch (error) {
        citas.value = []
        citasError.value = error.message || 'Error al cargar las citas.'
    } finally {
        loadingCitas.value = false
    }
}

function estadoClass(estado) {
    return {
        Confirmado: 'bg-success',
        Pendiente: 'bg-warning text-dark',
        Cancelado: 'bg-danger',
        Finalizado: 'bg-secondary',
    }[estado] ?? 'bg-secondary'
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
    }).format(Number(amount || 0))
}

function abrirConfirmacion(idCita, accion) {
    citaPorConfirmar.value = idCita
    accionCita.value = accion
}

function abrirRegistroPago(idCita) {
    citaPorPagar.value = idCita
}

async function registrarPago(metodoPago) {
    if (!citaPorPagar.value) return
    saving.value = true
    errorMessage.value = ''

    try {
        await pagarCita(citaPorPagar.value, metodoPago)
        citaPorPagar.value = null
        await loadCitas()
    } catch (error) {
        errorMessage.value = error.message || 'No se pudo registrar el pago.'
    } finally {
        saving.value = false
    }
}

async function confirmarAccionCita() {
    if (!citaPorConfirmar.value) return
    saving.value = true
    errorMessage.value = ''

    try {
        if (accionCita.value === 'finalizar') {
            await finalizarCita(citaPorConfirmar.value)
        } else {
            await cancelarCita(citaPorConfirmar.value)
        }
        citaPorConfirmar.value = null
        await loadCitas()
    } catch (error) {
        citaPorConfirmar.value = null
        errorMessage.value = error.message || 'No se pudo actualizar la cita.'
    } finally {
        saving.value = false
    }
}
</script>