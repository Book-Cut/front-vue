<template>
    <HeaderNav admin-page />

    <main class="container py-4">
        <div v-if="errorMessage" class="alert alert-danger" role="alert">
            {{ errorMessage }}
        </div>

<<<<<<< HEAD
        <ul class="nav nav-tabs mb-4">
            <li class="nav-item">
                <button
                    class="nav-link"
                    :class="{ active: activeTab === 'servicios' }"
                    type="button"
                    @click="activeTab = 'servicios'"
                >
                    Servicios
                </button>
            </li>
            <li class="nav-item">
                <button
                    class="nav-link"
                    :class="{ active: activeTab === 'citas' }"
                    type="button"
                    @click="openCitas"
                >
                    Citas
                </button>
            </li>
        </ul>

        <section v-if="activeTab === 'servicios'">
=======
>>>>>>> e347ec8582ff2c522e2a1946b6f62ef281bf9141
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h1 class="h2 mb-0">Servicios</h1>
            <button class="btn btn-primary" type="button" @click="newService">
                Agregar servicio
            </button>
        </div>

        <form v-if="showServiceForm" class="card card-body mb-3" @submit.prevent="saveService">
            <div class="row g-3">
                <div class="col-md-4">
                    <label class="form-label" for="service-name">Nombre</label>
                    <input id="service-name" v-model="serviceForm.Nombre" class="form-control" required />
                </div>
                <div class="col-md-3">
                    <label class="form-label" for="service-duration">Duración (minutos)</label>
                    <input
                        id="service-duration"
                        v-model.number="serviceForm.Duracion"
                        class="form-control"
                        type="number"
                        min="1"
                        required
                    />
                </div>
                <div class="col-md-3">
                    <label class="form-label" for="service-price">Precio</label>
                    <input
                        id="service-price"
                        v-model.number="serviceForm.Precio"
                        class="form-control"
                        type="number"
                        min="0"
                        required
                    />
                </div>
                <div class="col-md-2 d-flex align-items-end gap-2">
                    <button class="btn btn-success" type="submit" :disabled="saving">
                        {{ saving ? 'Guardando...' : 'Guardar' }}
                    </button>
                    <button class="btn btn-secondary" type="button" @click="showServiceForm = false">
                        Cancelar
                    </button>
                </div>
            </div>
        </form>

        <p v-if="loading" class="text-secondary">Cargando servicios...</p>

        <div v-else class="table-responsive">
            <table class="table table-striped align-middle">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Duración</th>
                        <th>Precio</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="service in services" :key="service.idServicio">
                        <td>{{ service.Nombre }}</td>
                        <td>{{ service.Duracion }} min</td>
                        <td>{{ formatCurrency(service.Precio) }}</td>
                        <td>
                            <button
                                class="btn btn-sm btn-outline-primary me-2"
                                type="button"
                                @click="editService(service)"
                            >
                                Editar
                            </button>
                            <button
                                class="btn btn-sm btn-outline-danger"
                                type="button"
                                @click="deleteService(service)"
                            >
                                Eliminar
                            </button>
                        </td>
                    </tr>
                    <tr v-if="services.length === 0">
                        <td colspan="4" class="text-center">No hay servicios.</td>
                    </tr>
                </tbody>
            </table>
        </div>
<<<<<<< HEAD
        </section>

        <section v-else>
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h1 class="h2 mb-0">Citas</h1>
                <button class="btn btn-outline-primary" type="button" :disabled="loadingCitas" @click="loadCitas">
                    Actualizar
                </button>
            </div>

            <div v-if="citasError" class="alert alert-danger" role="alert">
                {{ citasError }}
            </div>

            <p v-if="loadingCitas" class="text-secondary">Cargando citas...</p>

            <div v-else class="table-responsive">
                <table class="table table-striped align-middle">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Hora</th>
                            <th>Cliente</th>
                            <th>Teléfono</th>
                            <th>Servicios</th>
                            <th>Barbero</th>
                            <th>Estado</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="cita in citas" :key="cita.idCita">
                            <td>{{ cita.Fecha || '—' }}</td>
                            <td>{{ cita.Hora || '—' }}</td>
                            <td>{{ cita.Cliente || '—' }}</td>
                            <td>{{ cita.Telefono || '—' }}</td>
                            <td>{{ cita.Servicios || '—' }}</td>
                            <td>{{ cita.Barbero || '—' }}</td>
                            <td>
                                <span v-if="cita.Estado" class="badge" :class="estadoClass(cita.Estado)">{{ cita.Estado }}</span>
                                <span v-else>—</span>
                            </td>
                            <td>{{ cita.Total === null ? '—' : formatCurrency(cita.Total) }}</td>
                        </tr>
                        <tr v-if="citas.length === 0 && !citasError">
                            <td colspan="8" class="text-center">No hay citas.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
=======
>>>>>>> e347ec8582ff2c522e2a1946b6f62ef281bf9141
    </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import HeaderNav from '../components/HeaderNav.vue'
import {
    actualizarServicio,
    crearServicio,
    eliminarServicio,
    listarServicios,
} from '../services/servicios.service'
<<<<<<< HEAD
import { listarCitas } from '../services/citas.service'

const activeTab = ref('servicios')
const citas = ref([])
const loadingCitas = ref(false)
const citasError = ref('')
=======

>>>>>>> e347ec8582ff2c522e2a1946b6f62ef281bf9141
const services = ref([])
const loading = ref(false)
const saving = ref(false)
const errorMessage = ref('')
const showServiceForm = ref(false)
const serviceForm = ref({ idServicio: null, Nombre: '', Duracion: 30, Precio: 0 })

onMounted(loadServices)

async function loadServices() {
    loading.value = true
    errorMessage.value = ''

    try {
        services.value = await listarServicios()
    } catch (error) {
        errorMessage.value = error.message
    } finally {
        loading.value = false
    }
}

<<<<<<< HEAD
function estadoClass(estado) {
    return {
        Confirmado: 'bg-success',
        Pendiente: 'bg-warning text-dark',
        Cancelado: 'bg-danger',
        Finalizado: 'bg-secondary',
    }[estado] ?? 'bg-secondary'
}

function openCitas() {
    activeTab.value = 'citas'
    loadCitas()
}

async function loadCitas() {
    loadingCitas.value = true
    citasError.value = ''

    try {
        citas.value = await listarCitas()
    } catch (error) {
        citas.value = []
        citasError.value = error.message
    } finally {
        loadingCitas.value = false
    }
}

=======
>>>>>>> e347ec8582ff2c522e2a1946b6f62ef281bf9141
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
    }).format(Number(amount || 0))
}

function newService() {
    serviceForm.value = { idServicio: null, Nombre: '', Duracion: 30, Precio: 0 }
    showServiceForm.value = true
}

function editService(service) {
    serviceForm.value = { ...service }
    showServiceForm.value = true
}

async function saveService() {
    saving.value = true
    errorMessage.value = ''

    try {
        const editing = Boolean(serviceForm.value.idServicio)
        const payload = {
            Nombre: serviceForm.value.Nombre,
            Duracion: serviceForm.value.Duracion,
            Precio: serviceForm.value.Precio,
        }

        if (editing) {
            await actualizarServicio(serviceForm.value.idServicio, payload)
        } else {
            await crearServicio(payload)
        }
        showServiceForm.value = false
        await loadServices()
    } catch (error) {
        errorMessage.value = error.message
    } finally {
        saving.value = false
    }
}

async function deleteService(service) {
    if (!window.confirm(`¿Eliminar el servicio "${service.Nombre}"?`)) return
    errorMessage.value = ''

    try {
        await eliminarServicio(service.idServicio)
        await loadServices()
    } catch (error) {
        errorMessage.value = error.message
    }
}
<<<<<<< HEAD
</script>
=======
</script>
>>>>>>> e347ec8582ff2c522e2a1946b6f62ef281bf9141
