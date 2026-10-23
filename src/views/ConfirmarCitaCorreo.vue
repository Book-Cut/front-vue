<template>
  <div class="bg-light min-vh-100 d-flex align-items-center">
    <main class="container py-5">
      <section class="bg-white border-0 shadow-sm rounded-4 p-4 p-md-5 mx-auto" style="max-width: 560px;">
        <h1 class="fs-3 fw-bold text-dark mb-3">Confirmar asistencia</h1>
        <p v-if="!claveConfirmacion" class="text-secondary mb-0">
          El enlace de confirmación no es válido.
        </p>
        <p v-else-if="confirmada" class="text-secondary">
          {{ mensaje }}
        </p>
        <p v-else class="text-secondary">
          Confirma que asistirás a tu cita. Tienes 30 minutos desde el envío del correo.
          Si ya no puedes asistir, cancélala desde Mis citas.
        </p>

        <div v-if="error" class="alert alert-danger" role="alert">{{ error }}</div>

        <div class="d-flex flex-column flex-sm-row gap-2 mt-4">
          <button v-if="claveConfirmacion && !confirmada" class="btn btn-dark rounded-pill px-4"
            type="button" :disabled="confirmando" @click="confirmar">
            {{ confirmando ? 'Confirmando...' : 'Confirmar asistencia' }}
          </button>
          <RouterLink class="btn btn-outline-dark rounded-pill px-4" to="/mis-citas">
            Ir a Mis citas
          </RouterLink>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { confirmarCitaDesdeCorreo } from '../services/citas.service'

const ruta = useRoute()
const claveConfirmacion = computed(() =>
  typeof ruta.query.token === 'string' ? ruta.query.token : '',
)
const confirmada = ref(false)
const confirmando = ref(false)
const mensaje = ref('')
const error = ref('')

async function confirmar() {
  if (!claveConfirmacion.value) return

  confirmando.value = true
  error.value = ''
  try {
    const respuesta = await confirmarCitaDesdeCorreo(claveConfirmacion.value)
    mensaje.value = respuesta.message
    confirmada.value = true
  } catch (errorConfirmando) {
    error.value = errorConfirmando instanceof Error
      ? errorConfirmando.message
      : 'No se pudo confirmar la cita.'
  } finally {
    confirmando.value = false
  }
}
</script>
