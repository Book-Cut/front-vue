<template>
    <tr>
        <td>{{ cita.Fecha || '—' }}</td>
        <td>{{ cita.Hora || '—' }}</td>
        <td>{{ cita.Barbero || '—' }}</td>
        <td>{{ cita.Servicios || '—' }}</td>
        <td>
            {{ cita.Estado || '—' }}
            <span v-if="cita.Estado === 'Finalizado' && !cita.Valoracion"
                class="badge text-bg-warning ms-1">Por calificar</span>
        </td>
        <template v-if="conPago">
            <td>{{ cita.EstadoPago }}</td>
            <td>{{ cita.ModalidadPago }}</td>
        </template>
        <td class="text-nowrap">
            <slot name="acciones"></slot>
            <button type="button" class="btn btn-sm btn-outline-dark ms-2" :aria-expanded="abierta"
                :aria-controls="`detalle-cita-${cita.idCita}`" @click="abierta = !abierta">
                {{ abierta ? 'Ocultar' : 'Ver detalle' }}
            </button>
        </td>
    </tr>
    <tr v-if="abierta" :id="`detalle-cita-${cita.idCita}`">
        <td :colspan="conPago ? 8 : 6" class="p-0">
            <CitaDetalle :cita="cita" @calificada="(idCita, valoracion) => emit('calificada', idCita, valoracion)" />
        </td>
    </tr>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CitaDetalle from './CitaDetalle.vue'
import type { Cita } from '../services/citas.service'
import type { Valoracion } from '../services/valoraciones.service'

defineProps<{ cita: Cita; conPago?: boolean }>()
const emit = defineEmits<{ (evento: 'calificada', idCita: number, valoracion: Valoracion): void }>()

const abierta = ref(false)
</script>