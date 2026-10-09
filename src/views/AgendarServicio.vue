<template>
    <HeaderNav />

    <div class="container my-5">
        <div class="row justify-content-center">
            <div class="col-12 col-lg-8">
                <!-- Tarjeta Principal -->
                <div class="card border-dark border-2 rounded-3 shadow p-4">
                    <h2 class="text-center text-uppercase fw-bold text-dark mb-4">
                        <i class="bi bi-calendar-check me-2"></i>Agendar Cita
                    </h2>

<<<<<<< HEAD
                    <p v-if="loadingServicios" class="text-center text-secondary">Cargando servicios...</p>
                    <div v-if="errorMessage" class="alert alert-danger" role="alert">
                        {{ errorMessage }}
                    </div>

=======
>>>>>>> e347ec8582ff2c522e2a1946b6f62ef281bf9141
                    <!-- Resumen del Servicio Seleccionado (si viene por query param) -->
                    <div v-if="servicioSeleccionado"
                        class="alert alert-secondary border-dark d-flex align-items-center justify-content-between mb-4">
                        <div>
                            <span class="fw-bold d-block">Servicio seleccionado:</span>
<<<<<<< HEAD
                            <span class="fs-5 text-dark fw-semibold">{{ servicioSeleccionado.Nombre }}</span>
                        </div>
                        <span class="badge bg-dark fs-6">${{ servicioSeleccionado.Precio }}</span>
=======
                            <span class="fs-5 text-dark fw-semibold">{{ servicioSeleccionado.titulo }}</span>
                        </div>
                        <span class="badge bg-dark fs-6">${{ servicioSeleccionado.precio }}</span>
>>>>>>> e347ec8582ff2c522e2a1946b6f62ef281bf9141
                    </div>

                    <!-- Formularios de Agendamiento -->
                    <form @submit.prevent="confirmarReserva">
                        <div class="row g-3">
                            <!-- Selección de Servicio (si no viene preseleccionado) -->
                            <div class="col-12" v-if="!servicioSeleccionado">
                                <label class="form-label fw-bold">Servicio</label>
<<<<<<< HEAD
                                <select class="form-select border-dark" v-model="form.servicioId" required
                                    :disabled="loadingServicios">
                                    <option value="" disabled>Selecciona un servicio</option>
                                    <option v-for="serv in listaServicios" :key="serv.idServicio" :value="serv.idServicio">
                                        {{ serv.Nombre }} - ${{ serv.Precio }}
=======
                                <select class="form-select border-dark" v-model="form.servicioId" required>
                                    <option value="" disabled>Selecciona un servicio</option>
                                    <option v-for="serv in listaServicios" :key="serv.id" :value="serv.id">
                                        {{ serv.titulo }} - ${{ serv.precio }}
>>>>>>> e347ec8582ff2c522e2a1946b6f62ef281bf9141
                                    </option>
                                </select>
                            </div>

                            <!-- Selección de Especialista/Barbero -->
                            <div class="col-12 col-md-6">
                                <label class="form-label fw-bold">Especialista / Barbero</label>
                                <select class="form-select border-dark" v-model="form.barberoId" required>
                                    <option value="" disabled>Selecciona un profesional</option>
                                    <option v-for="barbero in barberos" :key="barbero.id" :value="barbero.id">
                                        {{ barbero.nombre }}
                                    </option>
                                </select>
                            </div>

                            <!-- Selección de Fecha -->
                            <div class="col-12 col-md-6">
                                <label class="form-label fw-bold">Fecha de la cita</label>
                                <input type="date" class="form-control border-dark" v-model="form.fecha"
                                    :min="fechaMinima" required />
                            </div>

                            <!-- Horarios Disponibles -->
                            <div class="col-12">
                                <label class="form-label fw-bold d-block">Hora disponible</label>
                                <div class="d-flex flex-wrap gap-2">
                                    <button type="button" v-for="hora in horasDisponibles" :key="hora"
                                        :class="['btn', form.hora === hora ? 'btn-dark' : 'btn-outline-dark']"
                                        @click="form.hora = hora">
                                        {{ hora }}
                                    </button>
                                </div>
                                <small v-if="!form.hora" class="text-danger d-block mt-1">Por favor selecciona una
                                    hora.</small>
                            </div>

                            <!-- Datos del Cliente -->
                            <hr class="my-4" />
                            <h5 class="fw-bold mb-3 text-dark">Datos de Confirmación</h5>

                            <div class="col-12 col-md-6">
                                <label class="form-label fw-bold">Nombre Completo</label>
                                <input type="text" class="form-control border-dark" v-model="form.nombreCliente"
                                    placeholder="Tu nombre completo" required />
                            </div>

                            <div class="col-12 col-md-6">
                                <label class="form-label fw-bold">Teléfono / WhatsApp</label>
                                <input type="tel" class="form-control border-dark" v-model="form.telefonoCliente"
                                    placeholder="Ej: 3001234567" required />
                            </div>

                            <div class="col-12">
                                <label class="form-label fw-bold">Notas o observaciones (Opcional)</label>
                                <textarea class="form-control border-dark" rows="2" v-model="form.notas"
                                    placeholder="Ej: Prefiero degrafilado en los lados..."></textarea>
                            </div>
                        </div>

                        <!-- Botones de Acción -->
                        <div class="d-flex gap-3 mt-4">
                            <button type="button" class="btn btn-outline-secondary w-50" @click="$router.back()">
                                Cancelar
                            </button>
<<<<<<< HEAD
                            <button type="submit" class="btn btn-dark w-50 fw-bold"
                                :disabled="!form.hora || !form.servicioId || loadingServicios">
=======
                            <button type="submit" class="btn btn-dark w-50 fw-bold" :disabled="!form.hora">
>>>>>>> e347ec8582ff2c522e2a1946b6f62ef281bf9141
                                Confirmar Reserva
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import HeaderNav from '../components/HeaderNav.vue'
<<<<<<< HEAD
import { listarServicios } from '../services/servicios.service'
=======
>>>>>>> e347ec8582ff2c522e2a1946b6f62ef281bf9141

const route = useRoute()
const router = useRouter()

<<<<<<< HEAD
const listaServicios = ref([])
const loadingServicios = ref(false)
const errorMessage = ref('')
=======
// Lista base de servicios
const listaServicios = [
    { id: 'corte-cabello', titulo: 'Corte de Cabello', precio: '20.000' },
    { id: 'corte-nino', titulo: 'Corte para Niño', precio: '15.000' },
    { id: 'tinte-cabello', titulo: 'Tinte de Cabello', precio: '35.000' },
    { id: 'depilacion', titulo: 'Depilación con Cera', precio: '25.000' },
    { id: 'tratamiento-facial', titulo: 'Tratamiento Facial', precio: '30.000' },
    { id: 'tratamiento-capilar', titulo: 'Tratamiento Capilar', precio: '40.000' }
]
>>>>>>> e347ec8582ff2c522e2a1946b6f62ef281bf9141

// Lista de especialistas
const barberos = [
    { id: 1, nombre: 'Barbero 1 - Especialista en Cortes' },
    { id: 2, nombre: 'Barbero 2 - Especialista en Color/Tinte' },
    { id: 3, nombre: 'Barbero 3 - Detallista y Barba' }
]

// Horarios de atención disponibles
const horasDisponibles = [
    '09:00 AM', '10:00 AM', '11:00 AM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'
]

const servicioSeleccionado = ref(null)

const form = ref({
    servicioId: '',
    barberoId: '',
    fecha: '',
    hora: '',
    nombreCliente: '',
    telefonoCliente: '',
    notas: ''
})

// Calcular la fecha mínima para evitar agendar en días pasados
const fechaMinima = computed(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
})

<<<<<<< HEAD
onMounted(async () => {
    loadingServicios.value = true
    try {
        listaServicios.value = await listarServicios()

        const queryServicio = route.query.servicio
        const queryBarbero = route.query.barbero

        if (typeof queryServicio === 'string') {
            const encontrado = listaServicios.value.find(
                (servicio) => String(servicio.idServicio) === queryServicio,
            )
            if (encontrado) {
                servicioSeleccionado.value = encontrado
                form.value.servicioId = encontrado.idServicio
            }
        }

        if (typeof queryBarbero === 'string') {
            form.value.barberoId = Number(queryBarbero)
        }
    } catch (error) {
        errorMessage.value = error instanceof Error
            ? error.message
            : 'No se pudieron cargar los servicios.'
    } finally {
        loadingServicios.value = false
    }

=======
onMounted(() => {
    // Capturar parámetros pasados por URL
    const queryServicio = route.query.servicio
    const queryBarbero = route.query.barbero

    if (queryServicio) {
        const encontrado = listaServicios.find(s => s.id === queryServicio)
        if (encontrado) {
            servicioSeleccionado.value = encontrado
            form.value.servicioId = encontrado.id
        }
    }

    if (queryBarbero) {
        form.value.barberoId = Number(queryBarbero)
    }

    // Establecer fecha por defecto (hoy)
>>>>>>> e347ec8582ff2c522e2a1946b6f62ef281bf9141
    form.value.fecha = fechaMinima.value
})

const confirmarReserva = () => {
    console.log('Datos de la reserva:', form.value)
    alert('¡Cita agendada con éxito! Nos comunicaremos contigo para confirmar.')
<<<<<<< HEAD
    router.push('/')
=======
    router.push('/servicios')
>>>>>>> e347ec8582ff2c522e2a1946b6f62ef281bf9141
}
</script>