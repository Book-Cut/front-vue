<template>
    <div class="bg-body-secondary min-vh-100">
        <HeaderNav />

        <ConfirmacionCitaModal
            :mostrar="Boolean(citaPorConfirmar)"
            accion="cancelar"
            :procesando="cancelandoCita"
            @confirmar="confirmarCancelacion"
            @cerrar="citaPorConfirmar = null"
        />

        <main class="container py-4 py-lg-5">
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-2 mb-4">
                <div>
                    <h1 class="h2 fw-bold mb-0">Mis citas</h1>
                </div>
            </div>

            <section class="mb-5" aria-labelledby="citas-proximas">
                <div class="mb-3">
                    <h2 id="citas-proximas" class="h5 fw-bold mb-0">Próximas citas</h2>
                </div>

                <p v-if="cargando" class="text-secondary">Cargando tus citas...</p>
                <div v-else-if="error" class="alert alert-danger" role="alert">
                    {{ error }}
                </div>
                <div v-if="errorAccion" class="alert alert-danger" role="alert">
                    {{ errorAccion }}
                </div>

                <div v-if="!cargando && !error && citasProximas.length === 0" class="card border-0 shadow-sm rounded-4">
                    <p class="text-center text-secondary p-4 mb-0">No tienes citas próximas.</p>
                </div>
                <CitaFila
                    v-for="cita in citasProximas"
                    :key="cita.idCita"
                    :cita="cita"
                    con-pago
                    @calificada="registrarValoracion"
                >
                    <template #acciones>
                        <button
                            v-if="cita.confirmacionPendiente"
                            class="btn btn-sm btn-outline-success"
                            type="button"
                            :disabled="confirmandoCita === cita.idCita"
                            @click="confirmarAsistenciaCita(cita)"
                        >
                            {{ confirmandoCita === cita.idCita ? 'Confirmando...' : 'Confirmar asistencia' }}
                        </button>
                        <button
                            v-if="!cita.confirmacionPendiente && puedeActualizarCita(cita) && cita.Estado !== 'Cancelado' && cita.Estado !== 'Finalizado'"
                            class="btn btn-sm btn-outline-secondary"
                            type="button"
                            @click="iniciarReagenda(cita)"
                        >
                            Reagendar
                        </button>
                        <button
                            v-if="!cita.confirmacionPendiente && puedeActualizarCita(cita) && cita.Estado !== 'Cancelado' && cita.Estado !== 'Finalizado'"
                            class="btn btn-sm btn-link text-decoration-none text-danger px-2"
                            type="button"
                            :disabled="cancelandoCita"
                            @click="citaPorConfirmar = cita.idCita"
                        >
                            Cancelar
                        </button>
                    </template>
                </CitaFila>

                <form
                    v-if="citaSeleccionada"
                    class="card bg-white border-0 rounded-4 shadow-sm card-body mt-3"
                    @submit.prevent="guardarReagenda"
                >
                    <h3 class="h6">Reagendar cita con {{ citaSeleccionada.Barbero }}</h3>
                    <div class="row g-3">
                        <div class="col-md-5">
                            <label class="form-label" for="nueva-fecha">Nueva fecha</label>
                            <input
                                id="nueva-fecha"
                                v-model="fechaNueva"
                                class="form-control"
                                type="date"
                                :min="fechaMinima"
                                required
                                @change="cargarHorarios"
                            />
                        </div>
                        <div class="col-md-5">
                            <label class="form-label" for="nueva-hora">Nueva hora disponible</label>
                            <select
                                id="nueva-hora"
                                v-model="horaNueva"
                                class="form-select"
                                :disabled="cargandoHorarios || horariosDisponibles.length === 0"
                                required
                            >
                                <option value="" disabled>
                                    {{ cargandoHorarios ? 'Buscando horarios...' : 'Selecciona una hora' }}
                                </option>
                                <option v-for="hora in horariosDisponibles" :key="hora" :value="hora">
                                    {{ hora }}
                                </option>
                            </select>
                        </div>
                        <div class="col-md-2 d-flex align-items-end gap-2">
                            <button class="btn btn-danger" type="submit" :disabled="guardandoReagenda || !horaNueva">
                                {{ guardandoReagenda ? 'Guardando...' : 'Guardar' }}
                            </button>
                            <button class="btn btn-outline-secondary" type="button" @click="cancelarReagenda">
                                Cerrar
                            </button>
                        </div>
                    </div>
                    <p v-if="errorReagenda" class="alert alert-danger mt-3 mb-0" role="alert">
                        {{ errorReagenda }}
                    </p>
                    <p v-else-if="fechaNueva && !cargandoHorarios && horariosDisponibles.length === 0" class="text-secondary mt-3 mb-0">
                        No hay horarios disponibles para esa fecha.
                    </p>
                </form>
            </section>

            <section aria-labelledby="historial-citas">
                <div class="mb-3">
                    <h2 id="historial-citas" class="h5 fw-bold mb-0">Citas anteriores</h2>
                </div>

                <div v-if="!cargando && !error && citasAnteriores.length === 0" class="card border-0 shadow-sm rounded-4">
                    <p class="text-center text-secondary p-4 mb-0">No tienes citas anteriores.</p>
                </div>
                <CitaFila
                    v-for="cita in citasAnteriores"
                    :key="cita.idCita"
                    :cita="cita"
                    @calificada="registrarValoracion"
                />
            </section>
        </main>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import HeaderNav from '../components/HeaderNav.vue'
import ConfirmacionCitaModal from '../components/ConfirmacionCitaModal.vue'
import CitaFila from '../components/CitaFila.vue'
import {
    cancelarCita,
    confirmarAsistencia,
    listarCitas,
    listarHorasDisponibles,
    reagendarCita as actualizarCita,
} from '../services/citas.service'
import type { Cita } from '../services/citas.service'
import type { Valoracion } from '../services/valoraciones.service'

const citas = ref<Cita[]>([])
const cargando = ref(true)
const error = ref('')
const citaSeleccionada = ref<Cita | null>(null)
const fechaNueva = ref('')
const horaNueva = ref('')
const horariosDisponibles = ref<string[]>([])
const cargandoHorarios = ref(false)
const guardandoReagenda = ref(false)
const errorReagenda = ref('')
const citaPorConfirmar = ref<number | null>(null)
const cancelandoCita = ref(false)
const confirmandoCita = ref<number | null>(null)
const errorAccion = ref('')
const hoy = new Date()
const fechaMinima = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`
let intervaloActualizacion: ReturnType<typeof setInterval> | null = null

// Una cita finalizada siempre va en el historial (donde se puede calificar),
// aunque se haya finalizado antes de su hora programada.
const esAnterior = (cita: Cita) =>
    cita.Estado === 'Finalizado' || new Date(`${cita.Fecha}T${cita.Hora || '00:00'}`) < new Date()

const citasProximas = computed(() => citas.value.filter((cita) => !esAnterior(cita)))

const citasAnteriores = computed(() => citas.value.filter(esAnterior))

function puedeActualizarCita(cita: Cita) {
    const inicio = new Date(`${cita.Fecha}T${cita.Hora || '00:00'}`).getTime()
    return inicio - Date.now() > 60 * 60 * 1000
}

function registrarValoracion(idCita: number, valoracion: Valoracion) {
    const cita = citas.value.find((item) => item.idCita === idCita)
    if (cita) cita.Valoracion = valoracion
}

onMounted(async () => {
    await cargarCitas()
    intervaloActualizacion = setInterval(() => {
        if (!cargando.value) void cargarCitas()
    }, 60_000)
})

onBeforeUnmount(() => {
    if (intervaloActualizacion) clearInterval(intervaloActualizacion)
})

async function cargarCitas() {
    cargando.value = true
    error.value = ''
    try {
        citas.value = await listarCitas()
    } catch (errorCargando) {
        error.value = errorCargando instanceof Error
            ? errorCargando.message
            : 'No se pudieron cargar tus citas.'
    } finally {
        cargando.value = false
    }
}

function iniciarReagenda(cita: Cita) {
    citaSeleccionada.value = cita
    fechaNueva.value = ''
    horaNueva.value = ''
    horariosDisponibles.value = []
    errorReagenda.value = cita.duracion > 0
        ? ''
        : 'No se pudo determinar la duración de los servicios de esta cita.'
}

function cancelarReagenda() {
    citaSeleccionada.value = null
    fechaNueva.value = ''
    horaNueva.value = ''
    horariosDisponibles.value = []
    errorReagenda.value = ''
}

async function cargarHorarios() {
    horaNueva.value = ''
    horariosDisponibles.value = []
    errorReagenda.value = ''

    if (!citaSeleccionada.value || !fechaNueva.value || citaSeleccionada.value.duracion <= 0) {
        return
    }

    cargandoHorarios.value = true
    try {
        horariosDisponibles.value = await listarHorasDisponibles(
            citaSeleccionada.value.barberoId,
            fechaNueva.value,
            citaSeleccionada.value.duracion,
            citaSeleccionada.value.idCita,
        )
    } catch (errorCargando) {
        errorReagenda.value = errorCargando instanceof Error
            ? errorCargando.message
            : 'No se pudieron consultar los horarios disponibles.'
    } finally {
        cargandoHorarios.value = false
    }
}

async function guardarReagenda() {
    if (!citaSeleccionada.value || !fechaNueva.value || !horaNueva.value) return

    guardandoReagenda.value = true
    errorReagenda.value = ''
    try {
        await actualizarCita(citaSeleccionada.value.idCita, fechaNueva.value, horaNueva.value)
        cancelarReagenda()
        await cargarCitas()
    } catch (errorGuardando) {
        errorReagenda.value = errorGuardando instanceof Error
            ? errorGuardando.message
            : 'No se pudo reagendar la cita.'
    } finally {
        guardandoReagenda.value = false
    }
}

async function confirmarCancelacion() {
    if (citaPorConfirmar.value === null) return

    cancelandoCita.value = true
    errorAccion.value = ''
    try {
        await cancelarCita(citaPorConfirmar.value)
        citaPorConfirmar.value = null
        await cargarCitas()
    } catch (errorCancelando) {
        errorAccion.value = errorCancelando instanceof Error
            ? errorCancelando.message
            : 'No se pudo cancelar la cita.'
        citaPorConfirmar.value = null
    } finally {
        cancelandoCita.value = false
    }
}

async function confirmarAsistenciaCita(cita: Cita) {
    confirmandoCita.value = cita.idCita
    errorAccion.value = ''
    try {
        await confirmarAsistencia(cita.idCita)
        await cargarCitas()
    } catch (errorConfirmando) {
        errorAccion.value = errorConfirmando instanceof Error
            ? errorConfirmando.message
            : 'No se pudo confirmar tu asistencia.'
        await cargarCitas()
    } finally {
        confirmandoCita.value = null
    }
}
</script>