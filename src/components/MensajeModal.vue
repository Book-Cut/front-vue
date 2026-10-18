<template>
    <div
        v-if="mostrar"
        class="modal d-block bg-dark bg-opacity-75"
        tabindex="-1"
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-mensaje-modal"
    >
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="titulo-mensaje-modal" class="modal-title fs-5">
                        {{ titulo }}
                    </h2>
                </div>
                <div class="modal-body">
                    {{ mensaje }}
                </div>
                <div class="modal-footer">
                    <button class="btn btn-dark" type="button" @click="$emit('aceptar')">
                        Aceptar
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    mostrar: boolean
    titulo: string
    mensaje: string
}>()

defineEmits<{
    aceptar: []
}>()
</script>
