<template>
    <div class="bg-body-secondary min-vh-100">
        <HeaderNav />

        <main class="container py-4 py-lg-5">
            <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-2 mb-4">
                <div>
                    <h1 class="h2 mb-0">Mis citas</h1>
                </div>
            </div>

            <section class="mb-5" aria-labelledby="citas-proximas">
                <div class="d-flex align-items-center gap-2 mb-3">
                    <h2 id="citas-proximas" class="h5 mb-0">Próximas citas</h2>
                </div>

                <p v-if="cargando" class="text-secondary">Cargando tus citas...</p>
                <div v-else-if="error" class="alert alert-danger" role="alert">
                    {{ error }}
                </div>

                <div class="table-responsive bg-white border rounded-3 shadow-sm">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-light">
                            <tr>
                                <th scope="col">Fecha</th>
                                <th scope="col">Hora</th>
                                <th scope="col">Barbero</th>
                                <th scope="col">Servicios</th>
                                <th scope="col">Estado</th>
                                <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="cita in citasProximas" :key="cita.idCita">
                                <td>{{ cita.Fecha || '—' }}</td>
                                <td>{{ cita.Hora || '—' }}</td>
                                <td>{{ cita.Barbero || '—' }}</td>
                                <td>{{ cita.Servicios || '—' }}</td>
                                <td>{{ cita.Estado || '—' }}</td>
                                <td>
                                    <button
                                        v-if="cita.Estado !== 'Cancelado' && cita.Estado !== 'Finalizado'"
                                        class="btn btn-sm btn-outline-primary"
                                        type="button"
                                        @click="iniciarReagenda(cita)"
                                    >
                                        Reagendar
                                    </button>
                                    <span v-else class="text-secondary">—</span>
                                </td>
                            </tr>
                            <tr v-if="!cargando && !error && citasProximas.length === 0">
                                <td colspan="6" class="text-center text-secondary">
                                    No tienes citas próximas.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <form
                    v-if="citaSeleccionada"
                    class="card card-body mt-3"
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
                            <button class="btn btn-primary" type="submit" :disabled="guardandoReagenda || !horaNueva">
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
                <div class="d-flex align-items-center gap-2 mb-3">
                    <h2 id="historial-citas" class="h5 mb-0">Citas anteriores</h2>
                </div>

                <div class="table-responsive bg-white border rounded-3 shadow-sm">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-light">
                            <tr>
                                <th scope="col">Fecha</th>
                                <th scope="col">Hora</th>
                                <th scope="col">Barbero</th>
                                <th scope="col">Servicios</th>
                                <th scope="col">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="cita in citasAnteriores" :key="cita.idCita">
                                <td>{{ cita.Fecha || '—' }}</td>
                                <td>{{ cita.Hora || '—' }}</td>
                                <td>{{ cita.Barbero || '—' }}</td>
                                <td>{{ cita.Servicios || '—' }}</td>
                                <td>{{ cita.Estado || '—' }}</td>
                            </tr>
                            <tr v-if="!cargando && !error && citasAnteriores.length === 0">
                                <td colspan="5" class="text-center text-secondary">
                                    No tienes citas anteriores.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import HeaderNav from '../components/HeaderNav.vue'
import {
    listarCitas,
    listarHorasDisponibles,
    reagendarCita as actualizarCita,
} from '../services/citas.service'
import type { Cita } from '../services/citas.service'

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
const hoy = new Date()
const fechaMinima = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`

const citasProximas = computed(() =>
    citas.value.filter((cita) => new Date(`${cita.Fecha}T${cita.Hora || '00:00'}`) >= new Date()),
)

const citasAnteriores = computed(() =>
    citas.value.filter((cita) => new Date(`${cita.Fecha}T${cita.Hora || '00:00'}`) < new Date()),
)

onMounted(async () => {
    await cargarCitas()
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
</script>