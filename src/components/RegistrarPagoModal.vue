<template>
    <div
        v-if="mostrar"
        class="modal d-block bg-dark bg-opacity-75"
        tabindex="-1"
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-registro-pago"
        @click.self="cerrar"
    >
        <div class="modal-dialog modal-dialog-centered" role="document">
            <form class="modal-content bg-white border-0 shadow-lg rounded-4" @submit.prevent="$emit('registrar', metodoPago)">
                <div class="modal-header border-bottom-0 px-4 pt-4">
                    <h2 id="titulo-registro-pago" class="modal-title fw-bold fs-5 text-dark">Registrar pago</h2>
                    <button
                        class="btn-close"
                        type="button"
                        aria-label="Volver"
                        :disabled="procesando"
                        @click="cerrar"
                    ></button>
                </div>
                <div class="modal-body px-4 py-3">
                    <p class="text-muted fs-6 mb-2">
                        Se registrará un solo pago para {{ cantidadCitas }} {{ cantidadCitas === 1 ? 'cita' : 'citas consecutivas' }}.
                    </p>
                    <p v-if="total !== undefined" class="fw-bold fs-4 text-dark mb-4">
                        {{ formatCurrency(total) }}
                    </p>
                    <label class="form-label text-muted small text-uppercase fw-bold mb-1" for="metodo-pago-cita">
                        Método de pago
                    </label>
                    <select id="metodo-pago-cita" v-model="metodoPago"
                        class="form-select bg-light border-0 py-2 rounded-3 shadow-none" required>
                        <option value="Efectivo">Efectivo</option>
                        <option value="Nequi">Nequi</option>
                        <option value="Tarjeta">Tarjeta</option>
                        <option value="Transferencia">Transferencia</option>
                    </select>
                </div>
                <div class="modal-footer border-top-0 px-4 pb-4 pt-0 d-flex justify-content-end gap-2">
                    <button class="btn btn-light text-dark fw-semibold rounded-pill px-4" type="button"
                        :disabled="procesando" @click="cerrar">
                        Volver
                    </button>
                    <button class="btn btn-dark rounded-pill px-4" type="submit" :disabled="procesando">
                        {{ procesando ? 'Registrando...' : 'Confirmar pago' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(defineProps<{
    mostrar: boolean
    procesando?: boolean
    total?: number
    cantidadCitas?: number
}>(), {
    procesando: false,
    cantidadCitas: 1,
})

const emitir = defineEmits<{
    registrar: [metodoPago: string]
    cerrar: []
}>()

const metodoPago = ref('Efectivo')

function formatCurrency(amount: number) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0,
    }).format(amount)
}

function cerrar() {
    if (!props.procesando) {
        emitir('cerrar')
    }
}
</script>
