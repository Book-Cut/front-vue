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
            <form class="modal-content" @submit.prevent="$emit('registrar', metodoPago)">
                <div class="modal-header">
                    <h2 id="titulo-registro-pago" class="modal-title fs-5">Registrar pago presencial</h2>
                    <button
                        class="btn-close"
                        type="button"
                        aria-label="Volver"
                        :disabled="procesando"
                        @click="cerrar"
                    ></button>
                </div>
                <div class="modal-body">
                    <label class="form-label" for="metodo-pago-cita">Método de pago</label>
                    <select id="metodo-pago-cita" v-model="metodoPago" class="form-select" required>
                        <option value="Efectivo">Efectivo</option>
                        <option value="Nequi">Nequi</option>
                        <option value="Tarjeta">Tarjeta</option>
                        <option value="Transferencia">Transferencia</option>
                    </select>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" :disabled="procesando" @click="cerrar">
                        Volver
                    </button>
                    <button class="btn btn-success" type="submit" :disabled="procesando">
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
}>(), {
    procesando: false,
})

const emitir = defineEmits<{
    registrar: [metodoPago: string]
    cerrar: []
}>()

const metodoPago = ref('Efectivo')

function cerrar() {
    if (!props.procesando) {
        emitir('cerrar')
    }
}
</script>
