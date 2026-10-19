<template>
    <div class="p-3 p-lg-4 bg-body-tertiary">
        <div class="row g-3">
            <section class="col-12 col-lg-6" :aria-labelledby="`cita-${cita.idCita}-resumen`">
                <h3 :id="`cita-${cita.idCita}-resumen`" class="h6 text-uppercase text-secondary">Cita</h3>
                <dl class="row mb-0 small">
                    <dt class="col-5">Fecha</dt>
                    <dd class="col-7">{{ cita.Fecha || '—' }} {{ cita.Hora }}</dd>
                    <dt class="col-5">Barbero</dt>
                    <dd class="col-7">{{ cita.Barbero || '—' }}</dd>
                    <dt class="col-5">Estado</dt>
                    <dd class="col-7">
                        <span class="badge" :class="estadoClass(cita.Estado)">{{ cita.Estado || '—' }}</span>
                    </dd>
                    <dt class="col-5">Pago</dt>
                    <dd class="col-7">
                        {{ cita.ModalidadPago || '—' }}
                        <span v-if="cita.EstadoPago" class="text-secondary">· {{ cita.EstadoPago }}</span>
                    </dd>
                </dl>
            </section>

            <section class="col-12 col-lg-6" :aria-labelledby="`cita-${cita.idCita}-servicios`">
                <h3 :id="`cita-${cita.idCita}-servicios`" class="h6 text-uppercase text-secondary">Servicios</h3>
                <table class="table table-sm mb-0 small">
                    <thead>
                        <tr>
                            <th scope="col">Servicio</th>
                            <th scope="col" class="text-end">Duración</th>
                            <th scope="col" class="text-end">Precio</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(servicio, indice) in cita.ServiciosDetalle" :key="indice">
                            <td>{{ servicio.nombre || '—' }}</td>
                            <td class="text-end">{{ servicio.duracion === null ? '—' : `${servicio.duracion} min` }}</td>
                            <td class="text-end">{{ servicio.precio === null ? '—' : formatCurrency(servicio.precio) }}</td>
                        </tr>
                        <tr v-if="cita.ServiciosDetalle.length === 0">
                            <td colspan="3" class="text-secondary">Sin servicios registrados.</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section class="col-12 col-lg-6" :aria-labelledby="`cita-${cita.idCita}-factura`">
                <h3 :id="`cita-${cita.idCita}-factura`" class="h6 text-uppercase text-secondary">Factura</h3>
                <dl v-if="cita.Factura" class="row mb-0 small">
                    <dt class="col-5">Número</dt>
                    <dd class="col-7">{{ cita.Factura.numero || '—' }}</dd>
                    <dt class="col-5">Fecha de emisión</dt>
                    <dd class="col-7">{{ cita.Factura.fecha || '—' }}</dd>
                    <dt class="col-5">Subtotal</dt>
                    <dd class="col-7">{{ formatCurrency(cita.Factura.subtotal) }}</dd>
                    <dt class="col-5">Total</dt>
                    <dd class="col-7 fw-bold">{{ formatCurrency(cita.Factura.total) }}</dd>
                    <dt class="col-5">Método de pago</dt>
                    <dd class="col-7">{{ cita.Factura.metodoPago || '—' }}</dd>
                    <dt class="col-5">Estado</dt>
                    <dd class="col-7">{{ cita.Factura.estado || '—' }}</dd>
                </dl>
                <p v-else class="small text-secondary mb-0">
                    Aún no hay factura para esta cita. Se genera cuando se registra el pago.
                </p>
            </section>

            <section class="col-12 col-lg-6" :aria-labelledby="`cita-${cita.idCita}-beneficio`">
                <h3 :id="`cita-${cita.idCita}-beneficio`" class="h6 text-uppercase text-secondary">
                    Beneficio aplicado
                </h3>
                <p v-if="cita.Beneficio" class="small mb-0">
                    <span class="badge text-bg-success me-1">{{ cita.Beneficio.titulo }}</span>
                    <span v-if="cita.Beneficio.tipo" class="text-secondary">{{ cita.Beneficio.tipo }}</span>
                    <span v-if="descuento > 0" class="d-block mt-1">
                        Descuento: {{ formatCurrency(descuento) }}
                    </span>
                </p>
                <p v-else class="small text-secondary mb-0">
                    No se aplicó ningún beneficio a esta cita.
                </p>
            </section>

            <section v-if="cita.Estado === 'Finalizado'" class="col-12"
                :aria-labelledby="`cita-${cita.idCita}-valoracion`">
                <h3 :id="`cita-${cita.idCita}-valoracion`" class="h6 text-uppercase text-secondary">
                    Tu calificación
                </h3>

                <div v-if="cita.Valoracion" class="small">
                    <span :aria-label="`${cita.Valoracion.puntuacion} de 5 estrellas`" class="text-warning fs-5">
                        <i v-for="n in 5" :key="n" class="bi"
                            :class="n <= cita.Valoracion.puntuacion ? 'bi-star-fill' : 'bi-star'"></i>
                    </span>
                    <p v-if="cita.Valoracion.comentario" class="mb-0 mt-1">{{ cita.Valoracion.comentario }}</p>
                    <p v-else class="mb-0 mt-1 text-secondary">Sin comentario.</p>
                    <p class="mb-0 text-secondary">Gracias por calificar tu cita.</p>
                </div>

                <form v-else @submit.prevent="enviarCalificacion" novalidate>
                    <div role="radiogroup" aria-label="Puntuación de 1 a 5" class="text-warning fs-4 mb-2">
                        <button v-for="n in 5" :key="n" type="button" role="radio"
                            class="btn btn-link p-0 me-1 text-warning" :aria-checked="puntuacion === n"
                            :aria-label="`${n} ${n === 1 ? 'estrella' : 'estrellas'}`" :disabled="enviando"
                            @click="puntuacion = n">
                            <i class="bi" :class="n <= puntuacion ? 'bi-star-fill' : 'bi-star'"></i>
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