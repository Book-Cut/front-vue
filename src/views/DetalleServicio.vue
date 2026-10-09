<template>
    <HeaderNav />
<<<<<<< HEAD
    <div v-if="loading" class="text-center my-5">
        <p>Cargando servicio...</p>
    </div>
    <div v-else-if="errorMessage" class="container text-center my-5">
        <p class="text-danger">{{ errorMessage }}</p>
        <RouterLink to="/" class="btn btn-dark">Volver a servicios</RouterLink>
    </div>
    <div v-else-if="servicio" class="container my-5">
        <div class="row justify-content-center">
            <div class="col-12 col-md-8 col-lg-6">
                <div class="card border-dark border-2 rounded-3 shadow p-4 text-center">
                    <i class="bi bi-scissors display-1 text-dark mb-3" aria-hidden="true"></i>
                    <h1 class="h3 fw-bold text-dark mb-3">{{ servicio.Nombre }}</h1>
=======
    <div class="container my-5" v-if="servicio">
        <div class="row justify-content-center">
            <div class="col-12 col-md-8 col-lg-6">
                <div class="card border-dark border-2 rounded-3 shadow p-4 text-center">
                    <i :class="['bi', servicio.icon, 'display-1 text-dark mb-3']"></i>
                    <h1 class="h3 fw-bold text-dark mb-3">{{ servicio.titulo }}</h1>
                    <p class="text-muted fs-5 mb-4">{{ servicio.descripcion }}</p>
>>>>>>> e347ec8582ff2c522e2a1946b6f62ef281bf9141

                    <div class="bg-light p-3 rounded-3 mb-4 text-start">
                        <div class="d-flex justify-content-between mb-2">
                            <span class="fw-bold">Duración estimada:</span>
<<<<<<< HEAD
                            <span>{{ servicio.Duracion }} min</span>
                        </div>
                        <div class="d-flex justify-content-between">
                            <span class="fw-bold">Precio:</span>
                            <span class="text-success fw-bold">${{ servicio.Precio }}</span>
=======
                            <span>{{ servicio.duracion }} min</span>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span class="fw-bold">Precio:</span>
                            <span class="text-success fw-bold">${{ servicio.precio }}</span>
                        </div>
                        <div class="mt-3">
                            <span class="fw-bold d-block mb-1">Incluye:</span>
                            <ul class="mb-0 ps-3 text-secondary">
                                <li v-for="(item, index) in servicio.incluye" :key="index">{{ item }}</li>
                            </ul>
>>>>>>> e347ec8582ff2c522e2a1946b6f62ef281bf9141
                        </div>
                    </div>

                    <div class="d-flex gap-2">
                        <button class="btn btn-outline-secondary w-50" @click="$router.back()">Volver</button>
<<<<<<< HEAD
                        <RouterLink
                            :to="{ name: 'AgendarServicio', query: { servicio: servicio.idServicio } }"
                            class="btn btn-dark w-50"
                        >
                            Agendar Servicio
                        </RouterLink>
=======
                        <button class="btn btn-dark w-50">Agendar Servicio</button>
>>>>>>> e347ec8582ff2c522e2a1946b6f62ef281bf9141
                    </div>
                </div>
            </div>
        </div>
    </div>
<<<<<<< HEAD
    <div v-else class="container text-center my-5">
        <p>Servicio no encontrado.</p>
        <RouterLink to="/" class="btn btn-dark">Volver a servicios</RouterLink>
=======
    <div v-else class="text-center my-5">
        <p>Servicio no encontrado.</p>
        <button class="btn btn-dark" @click="$router.push('/servicios')">Volver a Servicios</button>
>>>>>>> e347ec8582ff2c522e2a1946b6f62ef281bf9141
    </div>
</template>

<script setup>
<<<<<<< HEAD
import { onMounted, ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import HeaderNav from '../components/HeaderNav.vue'
import { listarServicios } from '../services/servicios.service'

const route = useRoute()
const servicio = ref(null)
const loading = ref(false)
const errorMessage = ref('')

onMounted(async () => {
    loading.value = true

    try {
        const servicios = await listarServicios()
        servicio.value = servicios.find(
            (item) => String(item.idServicio) === String(route.params.id),
        ) ?? null
    } catch (error) {
        errorMessage.value = error instanceof Error
            ? error.message
            : 'No se pudo cargar el servicio.'
    } finally {
        loading.value = false
    }
})
</script>
=======
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import HeaderNav from '../components/HeaderNav.vue'

const route = useRoute()
const servicio = ref(null)

// Datos simulados (puedes mover esto a un Store de Pinia o archivo JSON centralizado)
const serviciosData = [
    {
        id: 'corte-cabello',
        titulo: 'Corte de Cabello',
        descripcion: 'Asesoría de imagen, lavado, corte personalizado con acabado a navaja y peinado con producto profesional.',
        icon: 'bi-scissors',
        duracion: 30,
        precio: '20.000',
        incluye: ['Lavado capilar', 'Corte y peinado', 'Bebida de cortesía']
    },
    {
        id: 'corte-nino',
        titulo: 'Corte para Niño',
        descripcion: 'Experiencia paciente y divertida adaptada para los más pequeños.',
        icon: 'bi-person',
        duracion: 20,
        precio: '15.000',
        incluye: ['Corte estilizado', 'Peinado divertido', 'Sticker de cortesía']
    },
    {
        id: 'tinte-cabello',
        titulo: 'Tinte de Cabello',
        descripcion: 'Coloración profesional con productos de alta calidad para un acabado duradero y brillante.',
        icon: 'bi-palette',
        duracion: 60,
        precio: '35.000',
        incluye: ['Consulta de color', 'Aplicación de tinte', 'Tratamiento post-color']
    },
    {

        id: 'depilacion',
        titulo: 'Depilación con Cera',
        descripcion: 'Elimina el vello no deseado de manera efectiva y duradera.',
        icon: 'bi-droplet',
        duracion: 30,
        precio: '25.000',
        incluye: ['Depilación de la zona deseada', 'Aplicación de crema calmante']

    },
    {
        id: 'tratamiento-facial',
        titulo: 'Tratamiento Facial',
        descripcion: 'Cuidado especializado para tu piel, adaptado a tus necesidades y tipo de piel.',
        icon: 'bi-droplet-half',
        duracion: 45,
        precio: '30.000',
        incluye: ['Limpieza profunda', 'Mascarilla personalizada', 'Masaje facial relajante']
    },
    {
        id: 'tratamiento-capilar',
        titulo: 'Tratamiento Capilar',
        descripcion: 'Reparación y nutrición intensiva para tu cabello, dejándolo suave y brillante.',
        icon: 'bi-brush',
        duracion: 50,
        precio: '40.000',
        incluye: ['Diagnóstico capilar', 'Aplicación de tratamiento', 'Masaje del cuero cabelludo']
    }

    
]

onMounted(() => {
    const serviceId = route.params.id
    servicio.value = serviciosData.find(s => s.id === serviceId)
})
</script>
>>>>>>> e347ec8582ff2c522e2a1946b6f62ef281bf9141
