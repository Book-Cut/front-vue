<template>
    <HeaderNav />

    <div class="container my-5">
        <div class="row justify-content-center">
            <div class="col-12 col-lg-9">
                <!-- Tarjeta Principal -->
                <div class="card border-dark border-2 rounded-3 shadow p-4">
                    <h2 class="text-center text-uppercase fw-bold text-dark mb-4">
                        <i class="bi bi-calendar-check me-2"></i>Agendar Citas
                    </h2>

                    <p v-if="loadingServicios" class="text-center text-secondary">Cargando servicios...</p>
                    <div v-if="errorMessage" class="alert alert-danger" role="alert">
                        {{ errorMessage }}
                    </div>

                    <!-- Formulario de Agendamiento Múltiple -->
                    <form @submit.prevent="confirmarReserva">

                        <!-- Listado de Citas Dynamic -->
                        <div v-for="(cita, index) in citas" :key="index"
                            class="border border-secondary rounded p-3 mb-4 position-relative bg-light">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <h5 class="fw-bold m-0 text-dark">
                                    <i class="bi bi-scissors me-1"></i> Cita #{{ index + 1 }}
                                </h5>
                                <!-- Botón para eliminar esta cita si hay más de una -->
                                <button v-if="citas.length > 1" type="button" class="btn btn-outline-danger btn-sm"
                                    @click="eliminarCita(index)">
                                    <i class="bi bi-trash"></i> Eliminar
                                </button>
                            </div>

                            <div class="row g-3">
                                <!-- Selección de Servicio -->
                                <div class="col-12">
                                    <label class="form-label fw-bold">Servicio</label>
                                    <select class="form-select border-dark" v-model="cita.servicioId" required
                                        :disabled="loadingServicios" @change="actualizarCitaServicio(index)">
                                        <option value="" disabled>Selecciona un servicio</option>
                                        <option v-for="serv in listaServicios" :key="serv.idServicio"
                                            :value="serv.idServicio">
                                            {{ serv.Nombre }} - ${{ serv.Precio }}
                                        </option>
                                    </select>
                                </div>

                                <!-- Selección de Especialista / Barbero -->
                                <div class="col-12 col-md-6">
                                    <label class="form-label fw-bold">Especialista / Barbero</label>
                                    <select class="form-select border-dark" v-model="cita.barberoId" required
                                        @change="actualizarDisponibilidadServidor(index)">
                                        <option value="" disabled>Selecciona un profesional</option>
                                        <option v-for="barbero in barberos" :key="barbero.id" :value="barbero.id">
                                            {{ barbero.nombre }}
                                        </option>
                                    </select>
                                </div>

                                <!-- Selección de Fecha -->
                                <div class="col-12 col-md-6">
                                    <label class="form-label fw-bold">Fecha de la cita</label>
                                    <input type="date" class="form-control border-dark" v-model="cita.fecha"
                                        :min="fechaMinima" required @change="actualizarDisponibilidadServidor(index)" />
                                </div>

                               <!-- Horarios Disponibles -->
                                <div class="col-12">
                                    <label class="form-label fw-bold d-block">Hora disponible</label>
                                    <div class="d-flex flex-wrap gap-2">
                                        <button type="button" v-for="hora in horasDisponibles" :key="hora" :class="[
                                            'btn',
                                            cita.hora === hora ? 'btn-dark' : 'btn-outline-dark',
                                            esHoraOcupadaEnOtraCita(index, hora) ? 'opacity-50 text-decoration-line-through' : ''
                                        ]" :disabled="esHoraOcupadaEnOtraCita(index, hora)" @click="cita.hora = hora">
                                            {{ hora }}
                                        </button>
                                    </div>

                                    <!-- Advertencias visuales -->
                                    <small v-if="!cita.hora" class="text-danger d-block mt-1">
                                        Por favor selecciona una hora.
                                    </small>
                                </div>

                            </div>
                        </div>

                        <!-- Botón para Agregar Otra Cita -->
                        <div class="text-center mb-4">
                            <button type="button" class="btn btn-outline-dark fw-bold" @click="agregarNuevaCita">
                                <i class="bi bi-plus-circle me-1"></i> Agregar otra cita
                            </button>
                        </div>

                        <!-- Resumen del Total -->
                        <div class="alert alert-dark d-flex justify-content-between align-items-center">
                            <span class="fw-bold fs-5">Total a Pagar ({{ citas.length }} {{ citas.length === 1 ? 'cita'
                                : 'citas' }}):</span>
                            <span class="fs-4 fw-bold">${{ calcularTotal }}</span>
                        </div>

                        <!-- Datos del Cliente -->
                        <hr class="my-4" />
                        <h5 class="fw-bold mb-3 text-dark">Datos de Confirmación</h5>

                        <div class="row g-3">
                            <div class="col-12 col-md-6">
                                <label class="form-label fw-bold">Nombre Completo</label>
                                <input type="text" class="form-control border-dark" v-model="cliente.nombreCliente"
                                    placeholder="Tu nombre completo" required />
                            </div>

                            <div class="col-12 col-md-6">
                                <label class="form-label fw-bold">Teléfono / WhatsApp</label>
                                <input type="tel" class="form-control border-dark" v-model="cliente.telefonoCliente"
                                    placeholder="Ej: 3001234567" required />
                            </div>

                            <div class="col-12">
                                <label class="form-label fw-bold">Notas u observaciones (Opcional)</label>
                                <textarea class="form-control border-dark" rows="2" v-model="cliente.notas"
                                    placeholder="Ej: Prefiero degrafilado en los lados..."></textarea>
                            </div>
                        </div>

                        <!-- Botones de Acción -->
                        <div class="d-flex gap-3 mt-4">
                            <button type="button" class="btn btn-outline-secondary w-50" @click="$router.back()">
                                Cancelar
                            </button>
                            <button type="submit" class="btn btn-dark w-50 fw-bold"
                                :disabled="!esFormularioValido || loadingServicios">
                                Confirmar Reserva ({{ citas.length }})
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
import { listarServicios } from '../services/servicios.service'

const route = useRoute()
const router = useRouter()

const listaServicios = ref([])
const loadingServicios = ref(false)
const errorMessage = ref('')

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

// Fecha mínima (hoy)
const fechaMinima = computed(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
})

// Arreglo reactivo para múltiples citas
const citas = ref([
    {
        servicioId: '',
        barberoId: '',
        fecha: fechaMinima.value,
        hora: '',
        precio: 0
    }
])

// Datos globales del cliente
const cliente = ref({
    nombreCliente: '',
    telefonoCliente: '',
    notas: ''
})

// Función para agregar un nuevo bloque de cita
const agregarNuevaCita = () => {
    citas.value.push({
        servicioId: '',
        barberoId: '',
        fecha: fechaMinima.value,
        hora: '',
        precio: 0
    })
}

// Función para eliminar un bloque de cita
const eliminarCita = (index) => {
    citas.value.splice(index, 1)
}

// Actualizar el precio de la cita cuando cambia el servicio
const actualizarCitaServicio = (index) => {
    const servId = citas.value[index].servicioId
    const servicioEncontrado = listaServicios.value.find(s => String(s.idServicio) === String(servId))
    if (servicioEncontrado) {
        citas.value[index].precio = Number(servicioEncontrado.Precio) || 0
    }
}

// Cálculo del precio total
const calcularTotal = computed(() => {
    return citas.value.reduce((total, cita) => total + (cita.precio || 0), 0)
})

// Validar que todas las citas tengan hora y servicio
const esFormularioValido = computed(() => {
    return citas.value.every(c => c.servicioId && c.hora && c.barberoId && c.fecha)
})

// Retorna 'true' si otra cita (diferente a la actual) ya seleccionó esa misma fecha y hora
const esHoraOcupadaEnOtraCita = (indexActual, hora) => {
    const citaActual = citas.value[indexActual]
    if (!citaActual.fecha) return false

    return citas.value.some((cita, idx) => {
        // Solo comparamos con OTRAS citas del arreglo (diferentes al índice actual)
        if (idx === indexActual) return false

        // Si coincide la fecha y la hora (opcionalmente puedes sumar barberoId si quieres limitar solo por barbero)
        return cita.fecha === citaActual.fecha && cita.hora === hora
    })
}

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
                citas.value[0].servicioId = encontrado.idServicio
                citas.value[0].precio = Number(encontrado.Precio) || 0
            }
        }

        if (typeof queryBarbero === 'string') {
            citas.value[0].barberoId = Number(queryBarbero)
        }
    } catch (error) {
        errorMessage.value = error instanceof Error
            ? error.message
            : 'No se pudieron cargar los servicios.'
    } finally {
        loadingServicios.value = false
    }

    citas.value[0].fecha = fechaMinima.value
})

const confirmarReserva = () => {
    const payload = {
        cliente: cliente.value,
        citas: citas.value,
        total: calcularTotal.value
    }

    console.log('Datos a enviar:', payload)
    alert(`¡Se han agendado ${citas.value.length} citas con éxito! Nos comunicaremos contigo para confirmar.`)
    router.push('/')
}
</script>