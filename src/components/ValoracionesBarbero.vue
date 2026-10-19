<template>
    <section class="mt-5" aria-labelledby="valoraciones-titulo">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-2 mb-3">
            <div>
                <h2 id="valoraciones-titulo" class="h4 mb-0">
                    <i class="bi bi-star me-2"></i>Mis valoraciones
                </h2>
                <p class="text-secondary m-0">Calificaciones que te dejaron tus clientes.</p>
            </div>
            <p v-if="!cargando && !error" class="mb-0 fs-5">
                <template v-if="resumen.promedio !== null">
                    <i class="bi bi-star-fill text-warning me-1"></i>
                    <strong>{{ resumen.promedio.toFixed(1) }}</strong>
                    <span class="text-secondary fs-6"> / 5 · {{ resumen.total }}
                        {{ resumen.total === 1 ? 'valoración' : 'valoraciones' }}</span>
                </template>
                <span v-else class="text-secondary fs-6">Aún no tienes valoraciones</span>
            </p>
        </div>

        <p v-if="cargando" class="text-secondary">Cargando valoraciones...</p>
        <div v-else-if="error" class="alert alert-danger" role="alert">{{ error }}</div>

        <div v-else class="table-responsive shadow-sm rounded border">
            <table class="table table-striped align-middle mb-0">
                <thead class="table-dark">
                    <tr>
                        <th scope="col">Fecha</th>
                        <th scope="col">Cliente</th>
                        <th scope="col">Servicios</th>
                        <th scope="col">Puntuación</th>
                        <th scope="col">Comentario</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="valoracion in valoraciones" :key="valoracion.idValora">
                        <td>{{ valoracion.Fecha || '—' }}</td>
                        <td>{{ valoracion.Cliente || '—' }}</td>
                        <td>{{ valoracion.Servicios || '—' }}</td>
                        <td class="text-nowrap text-warning" :aria-label="`${valoracion.puntuacion} de 5 estrellas`">
                            <i v-for="n in 5" :key="n" class="bi"
                                :class="n <= valoracion.puntuacion ? 'bi-star-fill' : 'bi-star'"></i>
                        </td>
                        <td>{{ valoracion.comentario || '—' }}</td>
                    </tr>
                    <tr v-if="valoraciones.length === 0">
                        <td colspan="5" class="text-center py-4 text-secondary">
                            Todavía no has recibido valoraciones.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { listarValoracionesRecibidas } from '../services/valoraciones.service'
import type { ResumenValoraciones, ValoracionRecibida } from '../services/valoraciones.service'

const valoraciones = ref<ValoracionRecibida[]>([])
const resumen = ref<ResumenValoraciones>({ total: 0, promedio: null })
const cargando = ref(true)
const error = ref('')

onMounted(async () => {
    try {
        const respuesta = await listarValoracionesRecibidas()
        valoraciones.value = respuesta.valoraciones
        resumen.value = respuesta.resumen
    } catch (errorCargando) {
        error.value = errorCargando instanceof Error
            ? errorCargando.message
            : 'No se pudieron cargar tus valoraciones.'
    } finally {
        cargando.value = false
    }
})
</script>