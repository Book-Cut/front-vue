<template>
    <HeaderNav />
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

                    <div class="bg-light p-3 rounded-3 mb-4 text-start">
                        <div class="d-flex justify-content-between mb-2">
                            <span class="fw-bold">Duración estimada:</span>
                            <span>{{ servicio.Duracion }} min</span>
                        </div>
                        <div class="d-flex justify-content-between">
                            <span class="fw-bold">Precio:</span>
                            <span class="text-success fw-bold">${{ servicio.Precio }}</span>
                        </div>
                    </div>

                    <div class="d-flex gap-2">
                        <button class="btn btn-outline-secondary w-50" @click="$router.back()">Volver</button>
                        <RouterLink
                            :to="{ name: 'AgendarServicio', query: { servicio: servicio.idServicio } }"
                            class="btn btn-dark w-50"
                        >
                            Agendar Servicio
                        </RouterLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="container text-center my-5">
        <p>Servicio no encontrado.</p>
        <RouterLink to="/" class="btn btn-dark">Volver a servicios</RouterLink>
    </div>
</template>

<script setup>
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
