<template>
    <div class="row g-4">
        <section class="col-12 col-md-4" :aria-labelledby="`cita-${cita.idCita}-resumen`">
            <h3 :id="`cita-${cita.idCita}-resumen`" class="small text-uppercase fw-semibold text-secondary mb-3">
                Cita
            </h3>
            <dl class="mb-0">
                <dt class="small text-uppercase text-secondary fw-normal">Fecha y hora</dt>
                <dd class="text-dark mb-3">{{ cita.Fecha || '—' }} · {{ cita.Hora || '—' }}</dd>
                <dt class="small text-uppercase text-secondary fw-normal">Barbero</dt>
                <dd class="text-dark mb-3">{{ cita.Barbero || '—' }}</dd>
                <dt class="small text-uppercase text-secondary fw-normal">Estado</dt>
                <dd class="text-dark mb-3">{{ cita.Estado || '—' }}</dd>
                <dt class="small text-uppercase text-secondary fw-normal">Modalidad</dt>
                <dd class="text-dark mb-0">{{ cita.ModalidadPago || '—' }}</dd>
            </dl>
        </section>

        <section class="col-12 col-md-4" :aria-labelledby="`cita-${cita.idCita}-servicios`">
            <h3 :id="`cita-${cita.idCita}-servicios`" class="small text-uppercase fw-semibold text-secondary mb-3">
                Servicios ({{ cita.CantidadServicios }})
            </h3>
            <p class="small text-secondary mb-3">Horario: {{ cita.HorarioServicios }}</p>
            <div v-if="cita.ServiciosDetalle.length" class="d-flex flex-column gap-3">
                <div v-for="(servicio, indice) in cita.ServiciosDetalle" :key="indice">
                    <div class="d-flex justify-content-between gap-3">
                        <p class="text-dark mb-0">
                            {{ servicio.nombre || 'Servicio' }}
                            <span class="text-secondary small">{{ servicio.fecha }} · {{ servicio.hora }}</span>
                        </p>
                        <p class="text-dark text-nowrap mb-0">
                            {{ servicio.precio === null ? '—' : formatCurrency(servicio.precio) }}
                        </p>
                    </div>
                    <p class="small text-secondary mb-0">
                        {{ servicio.duracion === null ? 'Duración no disponible' : `${servicio.duracion} min` }}
                    </p>
                </div>
            </div>
            <p v-else class="text-secondary mb-0">Sin servicios registrados.</p>
        </section>

        <section class="col-12 col-md-4" :aria-labelledby="`cita-${cita.idCita}-pago`">
            <h3 :id="`cita-${cita.idCita}-pago`" class="small text-uppercase fw-semibold text-secondary mb-3">
                Pago
            </h3>
            <dl class="mb-0">
                <dt class="small text-uppercase text-secondary fw-normal">Estado</dt>
                <dd class="text-dark mb-3">{{ cita.EstadoPago || 'Pendiente' }}</dd>
                <template v-if="cita.Factura">
                    <dt class="small text-uppercase text-secondary fw-normal">Factura</dt>
                    <dd class="text-dark mb-3">{{ cita.Factura.numero || '—' }}</dd>
                    <dt class="small text-uppercase text-secondary fw-normal">Método</dt>
                    <dd class="text-dark mb-3">{{ cita.Factura.metodoPago || '—' }}</dd>
                    <dt class="small text-uppercase text-secondary fw-normal">Total</dt>
                    <dd class="fw-semibold text-dark mb-0">{{ formatCurrency(cita.Factura.total) }}</dd>
                </template>
                <p v-else class="small text-secondary mb-0">
                    Aún no hay factura para esta cita.
                </p>
            </dl>
        </section>

        <section class="col-12 col-md-4" :aria-labelledby="`cita-${cita.idCita}-beneficio`">
            <h3 :id="`cita-${cita.idCita}-beneficio`" class="small text-uppercase fw-semibold text-secondary mb-3">
                Beneficio aplicado
            </h3>
            <p v-if="cita.Beneficio" class="text-dark mb-1">{{ cita.Beneficio.titulo }}</p>
            <p v-if="cita.Beneficio?.tipo" class="small text-secondary mb-1">{{ cita.Beneficio.tipo }}</p>
            <p v-if="descuento > 0" class="small text-secondary mb-0">
                Descuento: {{ formatCurrency(descuento) }}
            </p>
            <p v-if="!cita.Beneficio" class="text-secondary mb-0">No se aplicó ningún beneficio.</p>
        </section>

        <section v-if="cita.Estado === 'Finalizado'" class="col-12 col-md-8"
            :aria-labelledby="`cita-${cita.idCita}-valoracion`">
            <h3 :id="`cita-${cita.idCita}-valoracion`" class="small text-uppercase fw-semibold text-secondary mb-3">
                Tu calificación
            </h3>

            <div v-if="cita.Valoracion" class="small">
                <p class="fw-semibold text-dark mb-1">
                    {{ cita.Valoracion.puntuacion }} de 5
                </p>
                <p v-if="cita.Valoracion.comentario" class="mb-1">{{ cita.Valoracion.comentario }}</p>
                <p v-else class="text-secondary mb-1">Sin comentario.</p>
                <p class="text-secondary mb-0">Gracias por calificar tu cita.</p>
            </div>

            <form v-else @submit.prevent="enviarCalificacion" novalidate>
                <div role="radiogroup" aria-label="Puntuación de 1 a 5" class="d-flex gap-2 mb-3">
                    <button v-for="n in 5" :key="n" type="button" role="radio"
                        class="btn btn-sm" :class="puntuacion === n ? 'btn-dark' : 'btn-outline-secondary'"
                        :aria-checked="puntuacion === n" :aria-label="`${n} de 5`" :disabled="enviando"
                        @click="puntuacion = n">
                        {{ n }}
                    </button>
                </div>

                <label class="form-label small" :for="`cita-${cita.idCita}-comentario`">
                    Comentario (opcional)
                </label>
                <textarea :id="`cita-${cita.idCita}-comentario`" v-model="comentario" class="form-control mb-1"
                    rows="3" maxlength="500" :disabled="enviando"
                    placeholder="Cuéntanos cómo fue tu experiencia"></textarea>
                <div class="form-text mb-2">{{ comentario.length }}/500</div>

                <div v-if="errorCalificacion" class="alert alert-danger py-2 small" role="alert">
                    {{ errorCalificacion }}
                </div>

                <button type="submit" class="btn btn-dark btn-sm" :disabled="puntuacion === 0 || enviando">
                    {{ enviando ? 'Enviando...' : 'Enviar calificación' }}
                </button>
            </form>
        </section>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Cita } from '../services/citas.service'
import { calificarCita } from '../services/valoraciones.service'
import type { Valoracion } from '../services/valoraciones.service'

const props = defineProps<{ cita: Cita }>()
const emit = defineEmits<{ (evento: 'calificada', idCita: number, valoracion: Valoracion): void }>()

const puntuacion = ref(0)
const comentario = ref('')
const enviando = ref(false)
const errorCalificacion = ref('')

const descuento = computed(() =>
    props.cita.Factura ? props.cita.Factura.subtotal - props.cita.Factura.total : 0,
)

function estadoClass(estado: string) {
    return {
        Confirmado: 'bg-success',
        Pendiente: 'bg-warning text-dark',
        Cancelado: 'bg-danger',
        Finalizado: 'bg-secondary',
    }[estado] ?? 'bg-secondary'
}

function formatCurrency(amount: number) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
    }).format(Number(amount || 0))
}

async function enviarCalificacion() {
    if (puntuacion.value < 1 || enviando.value) return

    enviando.value = true
    errorCalificacion.value = ''

    try {
        const valoracion = await calificarCita(props.cita.idCita, {
            puntuacion: puntuacion.value,
            comentario: comentario.value.trim() || undefined,
        })
        emit('calificada', props.cita.idCita, valoracion)
    } catch (error) {
        errorCalificacion.value = error instanceof Error
            ? error.message
            : 'No se pudo enviar la calificación.'
    } finally {
        enviando.value = false
    }
}
</script>