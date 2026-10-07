<template>
    <HeaderNav />
    <div class="container my-5" v-if="servicio">
        <div class="row justify-content-center">
            <div class="col-12 col-md-8 col-lg-6">
                <div class="card border-dark border-2 rounded-3 shadow p-4 text-center">
                    <i :class="['bi', servicio.icon, 'display-1 text-dark mb-3']"></i>
                    <h1 class="h3 fw-bold text-dark mb-3">{{ servicio.titulo }}</h1>
                    <p class="text-muted fs-5 mb-4">{{ servicio.descripcion }}</p>

                    <div class="bg-light p-3 rounded-3 mb-4 text-start">
                        <div class="d-flex justify-content-between mb-2">
                            <span class="fw-bold">Duración estimada:</span>
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
                        </div>
                    </div>

                    <div class="d-flex gap-2">
                        <button class="btn btn-outline-secondary w-50" @click="$router.back()">Volver</button>
                        <button class="btn btn-dark w-50">Agendar Servicio</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="text-center my-5">
        <p>Servicio no encontrado.</p>
        <button class="btn btn-dark" @click="$router.push('/servicios')">Volver a Servicios</button>
    </div>
</template>

<script setup>
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