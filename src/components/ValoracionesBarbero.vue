<template>
    <section class="mt-5" aria-labelledby="valoraciones-titulo">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-2 mb-4">
            <div>
                <h2 id="valoraciones-titulo" class="h4 fw-bold text-dark mb-1">Mis valoraciones</h2>
                <p class="text-muted mb-0">Calificaciones que te dejaron tus clientes.</p>
            </div>
            <p v-if="!cargando && !error" class="mb-0">
                <template v-if="resumen.promedio !== null">
                    <span class="fw-bold fs-5">{{ resumen.promedio.toFixed(1) }} / 5</span>
                    <span class="text-muted small ms-1">({{ resumen.total }}
                        {{ resumen.total === 1 ? 'valoración' : 'valoraciones' }})</span>
                </template>
                <span v-else class="text-secondary fs-6">Aún no tienes valoraciones</span>
            </p>
        </div>

        <p v-if="cargando" class="text-secondary">Cargando valoraciones...</p>
        <div v-else-if="error" class="alert alert-danger" role="alert">{{ error }}</div>

        <div v-else class="d-flex flex-column gap-3">
            <article v-for="valoracion in valoraciones" :key="valoracion.idValora"
                class="bg-white border-0 shadow-sm rounded-4 p-3">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <div>
                        <p class="text-muted small mb-1">{{ valoracion.Fecha || '—' }}</p>
                        <h3 class="fw-bold fs-6 mb-0 text-dark">{{ valoracion.Cliente || 'Cliente' }}</h3>
                        <p class="text-muted small mb-0">{{ valoracion.Servicios || 'Servicio no especificado' }}</p>
                    </div>
                    <span class="badge text-bg-dark rounded-pill px-3 py-2 fw-normal text-nowrap">
                        Puntuación: {{ valoracion.puntuacion }} / 5
                    </span>
                </div>
                <p v-if="valoracion.comentario?.trim()" class="text-secondary fst-italic mt-2 mb-0">
                    {{ valoracion.comentario }}
                </p>
                <p v-else class="text-muted small fst-italic mt-2 mb-0 opacity-50">
                    Sin comentario escrito
                </p>
            </article>
            <div v-if="valoraciones.length === 0"
                class="bg-white border-0 shadow-sm rounded-4 p-4 text-center text-secondary">
                Todavía no has recibido valoraciones.
            </div>
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