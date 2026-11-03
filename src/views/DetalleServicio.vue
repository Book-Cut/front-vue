<template>
    <HeaderNav />
    <main class="bg-light">
        <div v-if="loading" class="min-vh-100 d-flex justify-content-center align-items-center bg-light">
            <p class="text-secondary mb-0">Cargando servicio...</p>
        </div>
        <div v-else-if="errorMessage" class="min-vh-100 d-flex flex-column justify-content-center align-items-center gap-3 bg-light">
            <p class="text-danger mb-0">{{ errorMessage }}</p>
            <RouterLink to="/" class="btn btn-dark rounded-pill px-4 py-2">Volver a servicios</RouterLink>
        </div>
        <div v-else-if="servicio" class="container py-5 mt-3 mt-lg-5">
            <div class="row g-5">
                <section class="col-12 col-lg-7">
                    <h1 class="display-4 fw-bold text-dark mb-4">{{ servicio.Nombre }}</h1>
                    <h2 class="h5 fw-bold text-dark mb-2">Sobre el servicio</h2>
                    <p class="text-muted fs-5 mb-4">
                        Reserva este espacio para disfrutar de una atención profesional y personalizada.
                        Nuestro objetivo es brindarte la mejor experiencia.
                    </p>
                    <div>
                        <p class="text-uppercase text-muted small fw-bold mb-1">Duración estimada</p>
                        <p class="fs-5 fw-semibold text-dark mb-4">{{ servicio.Duracion }} min</p>
                    </div>
                </section>

                <aside class="col-12 col-lg-5 col-xl-4 offset-xl-1">
                    <section class="bg-white border-0 shadow-lg rounded-4 p-4 p-md-5 sticky-top"
                        style="top: 2rem;">
                        <span class="text-uppercase text-muted small fw-bold mb-1 d-block">Precio</span>
                        <p class="display-5 fw-bold text-dark mb-4">{{ formatCurrency(servicio.Precio) }}</p>
                        <hr class="text-secondary mb-4">
                        <RouterLink
                            :to="{ name: 'AgendarServicio', query: { servicio: servicio.idServicio } }"
                            class="btn btn-dark w-100 rounded-pill py-3 fw-bold mb-3"
                        >
                            Agendar Servicio
                        </RouterLink>
                        <button
                            class="btn btn-link text-muted text-decoration-none w-100 fw-semibold"
                            type="button"
                            @click="$router.back()"
                        >
                            Volver
                        </button>
                    </section>
                </aside>
                </div>
            </div>
        <div v-else class="min-vh-100 d-flex flex-column justify-content-center align-items-center gap-3 bg-light">
            <p class="text-secondary mb-0">Servicio no encontrado.</p>
            <RouterLink to="/" class="btn btn-dark rounded-pill px-4 py-2">Volver a servicios</RouterLink>
        </div>
    </main>
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

function formatCurrency(precio) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0,
    }).format(Number(precio || 0))
}

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
