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
            <div class="modal-content bg-white border-0 shadow-lg rounded-4">
                <div class="modal-header border-bottom-0 px-4 pt-4">
                    <h2 id="titulo-confirmacion-cita" class="modal-title fw-bold fs-5 text-dark">
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
                <div class="modal-body px-4 py-3">
                    <p class="text-muted fs-6 mb-0">
                        {{ accion === 'cancelar' ? 'La cita se marcará como cancelada.' : 'La cita se marcará como finalizada.' }}
                    </p>
                </div>
                <div class="modal-footer border-top-0 px-4 pb-4 pt-0 d-flex justify-content-end gap-2">
                    <button
                        class="btn btn-light text-dark fw-semibold rounded-pill px-4"
                        type="button"
                        :disabled="procesando"
                        @click="cerrar"
                    >
                        Volver
                    </button>
                    <button
                        class="btn rounded-pill px-4"
                        :class="accion === 'cancelar' ? 'btn-danger' : 'btn-dark'"
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
