<template>
    <article class="card border-0 shadow-sm rounded-4 mb-3">
        <div class="d-flex align-items-center flex-wrap gap-3 p-3 p-md-4">
            <div class="flex-shrink-0">
                <p class="fs-5 fw-bold text-dark text-capitalize mb-0">{{ fechaCorta }}</p>
                <p class="text-muted fs-6 mb-0">{{ cita.Hora || '—' }}</p>
            </div>

            <div class="flex-grow-1">
                <p class="fw-semibold text-dark mb-0">{{ cita.Barbero || '—' }}</p>
                <p class="text-muted small mb-0">
                    {{ cita.Servicios || 'Sin servicios' }} <span aria-hidden="true">·</span> {{ cita.ModalidadPago || 'Presencial' }}
                </p>
                <p v-if="cita.confirmacionPendiente" class="text-warning-emphasis small mb-0">
                    Confirma tu asistencia en los próximos 30 minutos.
                </p>
            </div>

            <div class="d-flex flex-wrap gap-2">
                <span class="badge rounded-pill" :class="estadoClase(cita.Estado)">
                    {{ cita.Estado || '—' }}
                </span>
                <span v-if="conPago" class="badge rounded-pill bg-secondary-subtle text-secondary-emphasis">
                    Pago {{ cita.EstadoPago || 'Pendiente' }}
                </span>
                <span v-if="cita.Estado === 'Finalizado' && !cita.Valoracion"
                    class="badge rounded-pill bg-warning-subtle text-warning-emphasis">
                    Por calificar
                </span>
            </div>

            <div class="d-flex flex-wrap align-items-center gap-2 ms-lg-auto">
                <slot name="acciones"></slot>
                <button
                    class="btn btn-sm btn-link text-decoration-none text-dark px-2"
                    type="button"
                    :aria-expanded="abierta"
                    :aria-controls="`detalle-cita-${cita.idCita}`"
                    data-bs-toggle="collapse"
                    :data-bs-target="`#detalle-cita-${cita.idCita}`"
                >
                    {{ abierta ? 'Ver menos' : 'Ver más' }}
                </button>
            </div>
        </div>

        <div
            :id="`detalle-cita-${cita.idCita}`"
            class="collapse"
            ref="panelDetalles"
        >
            <div class="p-4 bg-light rounded-bottom-4">
                <CitaDetalle :cita="cita" @calificada="(idCita, valoracion) => emit('calificada', idCita, valoracion)" />
            </div>
        </div>
    </article>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import CitaDetalle from './CitaDetalle.vue'
import type { Cita } from '../services/citas.service'
import type { Valoracion } from '../services/valoraciones.service'

const props = defineProps<{ cita: Cita; conPago?: boolean }>()
const emit = defineEmits<{ (evento: 'calificada', idCita: number, valoracion: Valoracion): void }>()

const abierta = ref(false)
const panelDetalles = ref<HTMLElement | null>(null)
const fechaCorta = computed(() => {
    const [anio, mes, dia] = props.cita.Fecha.split('-').map(Number)
    if (!anio || !mes || !dia) return props.cita.Fecha || '—'

    return new Intl.DateTimeFormat('es', { day: '2-digit', month: 'short' })
        .format(new Date(anio, mes - 1, dia))
})

function mostrarDetalles() {
    abierta.value = true
}

function ocultarDetalles() {
    abierta.value = false
}

onMounted(() => {
    panelDetalles.value?.addEventListener('shown.bs.collapse', mostrarDetalles)
    panelDetalles.value?.addEventListener('hidden.bs.collapse', ocultarDetalles)
})

onBeforeUnmount(() => {
    panelDetalles.value?.removeEventListener('shown.bs.collapse', mostrarDetalles)
    panelDetalles.value?.removeEventListener('hidden.bs.collapse', ocultarDetalles)
})

function estadoClase(estado: string) {
    return {
        Confirmado: 'bg-success-subtle text-success-emphasis',
        Pendiente: 'bg-warning-subtle text-warning-emphasis',
        Cancelado: 'bg-danger-subtle text-danger-emphasis',
        Finalizado: 'bg-secondary-subtle text-secondary-emphasis',
    }[estado] ?? 'bg-secondary-subtle text-secondary-emphasis'
}
</script>
