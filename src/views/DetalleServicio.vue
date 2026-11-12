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
        <template v-else-if="servicio">
            <section class="bc-detail-hero">
                <div class="container position-relative pt-4 pb-5">
                    <RouterLink to="/#servicios" class="text-decoration-none text-white-50 small d-inline-block mb-4">
                        <i class="bi bi-arrow-left me-1" aria-hidden="true"></i>Todos los servicios
                    </RouterLink>
                    <h1 class="display-3 text-white mb-3">{{ servicio.Nombre }}</h1>
                    <p class="fs-5 text-white-50 mb-0" style="max-width: 46ch;">
                        Atención profesional y personalizada, en el horario que mejor te quede.
                    </p>
                </div>
                <div class="bc-pole"></div>
            </section>

            <div class="container pb-5">
                <div class="row g-5 align-items-start">
                    <section class="col-12 col-lg-7 pt-5">
                        <h2 class="bc-title h3">Lo que incluye</h2>
                        <div class="row g-3 mt-2">
                            <div class="col-12 col-sm-6">
                                <div class="bc-fact">
                                    <i class="bi bi-clock" aria-hidden="true"></i>
                                    <div>
                                        <div class="small text-secondary fw-semibold">Duración</div>
                                        <div class="fs-5 fw-bold">{{ servicio.Duracion }} min</div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6">
                                <div class="bc-fact">
                                    <i class="bi bi-person-check" aria-hidden="true"></i>
                                    <div>
                                        <div class="small text-secondary fw-semibold">Atención</div>
                                        <div class="fs-5 fw-bold">Con barbero</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <aside class="col-12 col-lg-5 col-xl-4 offset-xl-1" style="margin-top: -3.2rem;">
                        <section class="card border-0 shadow-lg p-4 p-md-5 sticky-top overflow-hidden" style="top: 6rem;">
                            <p class="small text-secondary fw-semibold mb-1">Precio</p>
                            <p class="bc-price display-5 text-dark mb-4">{{ formatCurrency(servicio.Precio) }}</p>
                            <RouterLink
                                :to="{ name: 'AgendarServicio', query: { servicio: servicio.idServicio } }"
                                class="btn btn-danger btn-lg w-100 mb-2"
                            >
                                Agendar servicio
                            </RouterLink>
                            <button class="btn btn-link text-secondary text-decoration-none w-100" type="button" @click="$router.back()">
                                Volver
                            </button>
                        </section>
                    </aside>
                </div>
            </div>
        </template>
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
