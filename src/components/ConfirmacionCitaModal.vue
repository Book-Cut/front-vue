<template>
    <div
        v-if="mostrar"
        class="modal d-block bg-dark bg-opacity-75"
        tabindex="-1"
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-confirmacion-cita"
        @click.self="cerrar"
    >
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="titulo-confirmacion-cita" class="modal-title fs-5">
                        ¿Estás seguro de {{ accion }} esta cita?
                    </h2>
                    <button
                        class="btn-close"
                        type="button"
                        aria-label="Volver"
                        :disabled="procesando"
                        @click="cerrar"
                    ></button>
                </div>
                <div class="modal-footer">
                    <button
                        class="btn btn-secondary"
                        type="button"
                        :disabled="procesando"
                        @click="cerrar"
                    >
                        Volver
                    </button>
                    <button
                        class="btn"
                        :class="accion === 'cancelar' ? 'btn-danger' : 'btn-success'"
                        type="button"
                        :disabled="procesando"
                        @click="$emit('confirmar')"
                    >
                        {{ procesando ? 'Procesando...' : 'Confirmar' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
    mostrar: boolean
    accion: 'cancelar' | 'finalizar'
    procesando?: boolean
}>(), {
    procesando: false,
})

const emitir = defineEmits<{
    confirmar: []
    cerrar: []
}>()

function cerrar() {
    if (!props.procesando) {
        emitir('cerrar')
    }
}
</script>
