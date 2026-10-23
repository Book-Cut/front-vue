<template>
    <HeaderNav />

    <main class="bg-light min-vh-100">
      <div class="container py-4 py-lg-5">
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

        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-4">
            <div>
                <h1 class="h2 fw-bold text-dark mb-1">Mis Citas Asignadas</h1>
                <p class="text-muted mb-0">Consulta y administra las citas programadas en tu agenda.</p>
            </div>
            <button class="btn btn-outline-dark rounded-pill px-4" type="button" :disabled="loadingCitas" @click="loadCitas">
                Actualizar
            </button>
        </div>

        <div v-if="citasError" class="alert alert-danger" role="alert">
            {{ citasError }}
        </div>

        <p v-if="loadingCitas" class="text-secondary text-center py-4">Cargando tus citas...</p>

        <div v-else class="d-flex flex-column gap-3">
            <article v-for="cita in citas" :key="cita.idCita"
                class="bg-white border-0 shadow-sm rounded-4 p-3 p-md-4">
                <div class="row align-items-center w-100 m-0 g-3">
                    <div class="col-6 col-lg-2">
                        <p class="fw-bold text-dark mb-1">{{ cita.Fecha || '—' }}</p>
                        <p class="text-muted small mb-0">{{ cita.Hora || '—' }}</p>
                    </div>
                    <div class="col-6 col-lg-2">
                        <p class="fw-bold text-dark mb-1">{{ cita.Cliente || '—' }}</p>
                        <p class="text-muted small mb-0">{{ cita.Telefono || '—' }}</p>
                    </div>
                    <div class="col-12 col-lg-3">
                        <div class="d-flex align-items-center mb-2">
                            <span class="text-muted small text-uppercase fw-bold">Servicios</span>
                            <span v-if="cita.ServiciosDetalle.length > 1"
                                class="badge bg-light text-secondary border rounded-pill ms-2 fw-normal">
                                {{ cita.ServiciosDetalle.length }} servicios
                            </span>
                        </div>
                        <div v-if="cita.ServiciosDetalle.length" class="d-flex flex-column gap-1">
                            <div v-for="(servicio, indice) in cita.ServiciosDetalle"
                                :key="`${servicio.nombre}-${indice}`" class="text-dark fs-6">
                                {{ servicio.nombre }}
                            </div>
                        </div>
                        <p v-else class="text-muted small mb-0">Sin servicios</p>
                    </div>
                    <div class="col-6 col-lg-2">
                        <div class="d-flex flex-wrap gap-2 mb-2">
                            <span v-if="cita.Estado" class="badge rounded-pill" :class="estadoClass(cita.Estado)">
                                {{ cita.Estado }}
                            </span>
                            <span class="badge rounded-pill bg-light text-dark">
                                Pago {{ cita.EstadoPago || 'Pendiente' }}
                            </span>
                        </div>
                        <p class="text-muted small mb-0">Pago presencial</p>
                    </div>
                    <div class="col-6 col-lg-1">
                        <p class="text-muted small text-uppercase fw-semibold mb-1">Total</p>
                        <p class="fs-5 fw-bold text-dark mb-0">
                            {{ cita.Total === null ? '—' : formatCurrency(cita.Total) }}
                        </p>
                    </div>
                    <div class="col-auto ms-auto d-grid gap-2" style="min-width: 120px; text-align: center;">
                        <button v-if="cita.EstadoPago === 'Pendiente' && cita.Estado === 'Finalizado'"
                            class="btn btn-sm btn-dark rounded-pill" type="button" :disabled="saving"
                            @click="abrirRegistroPago(cita.idCita)">
                            Registrar pago
                        </button>
                        <button v-if="cita.Estado === 'Confirmado'"
                            class="btn btn-sm btn-outline-dark rounded-pill" type="button" :disabled="saving"
                            @click="abrirConfirmacion(cita.idCita, 'finalizar')">
                            Finalizar
                        </button>
                        <button v-if="cita.Estado !== 'Cancelado' && cita.Estado !== 'Finalizado'"
                            class="btn btn-sm btn-outline-secondary rounded-pill" type="button" :disabled="saving"
                            @click="abrirConfirmacion(cita.idCita, 'cancelar')">
                            Cancelar
                        </button>
                        <span v-if="cita.Estado === 'Cancelado'" class="text-muted small">Cancelada</span>
                        <span v-else-if="cita.Estado === 'Finalizado' && cita.EstadoPago !== 'Pendiente'"
                            class="text-muted small">Finalizada</span>
                    </div>
                </div>
            </article>
            <div v-if="citas.length === 0 && !citasError"
                class="bg-white border-0 shadow-sm rounded-4 p-4 text-center text-secondary">
                No tienes citas asignadas actualmente.
            </div>
        </div>

        <ValoracionesBarbero />
      </div>
    </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import HeaderNav from '../components/HeaderNav.vue'
import ConfirmacionCitaModal from '../components/ConfirmacionCitaModal.vue'
import RegistrarPagoModal from '../components/RegistrarPagoModal.vue'
import ValoracionesBarbero from '../components/ValoracionesBarbero.vue'
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
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0,
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