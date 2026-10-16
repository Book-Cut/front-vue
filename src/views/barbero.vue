<template>
    <HeaderNav />

    <main class="container py-4">
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
                        <td class="fw-bold">{{ cita.Total === null ? '—' : formatCurrency(cita.Total) }}</td>
                        <td class="text-center">
                            <button v-if="cita.Estado !== 'Cancelado'" class="btn btn-sm btn-outline-danger"
                                type="button" @click="cancelaCita(cita.idCita)">
                                Cancelar
                            </button>
                            <span v-else class="text-muted small">Cancelada</span>
                        </td>
                    </tr>
                    <tr v-if="citas.length === 0 && !citasError">
                        <td colspan="8" class="text-center py-4 text-secondary">No tienes citas asignadas actualmente.
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
import { listarCitas, cancelarCita } from '../services/citas.service'

const citas = ref([])
const loadingCitas = ref(false)
const citasError = ref('')
const errorMessage = ref('')
const saving = ref(false)

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

async function cancelaCita(idCita) {
    if (!window.confirm('¿Estás seguro de que deseas cancelar esta cita?')) return

    saving.value = true
    errorMessage.value = ''

    try {
        await cancelarCita(idCita)
        await loadCitas()
    } catch (error) {
        errorMessage.value = error.message || 'No se pudo cancelar la cita.'
    } finally {
        saving.value = false
    }
}
</script>