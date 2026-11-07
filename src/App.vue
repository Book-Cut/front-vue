<template>
  <RouterView />
</template>

<script setup>
import { onBeforeUnmount, onMounted } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { apiRequest, SESSION_EXPIRED_EVENT } from './services/api'

const router = useRouter()
const authStore = useAuthStore()
let timerValidacion
let validandoSesion = false

function manejarSesionExpirada() {
  authStore.logout()
  void router.replace({ name: 'login', query: { sesion: 'expirada' } })
}

async function validarSesion() {
  if (!authStore.token || validandoSesion) return

  validandoSesion = true
  try {
    await apiRequest('/perfil')
  } catch (error) {
    console.warn('No se pudo validar la sesión.', error)
  } finally {
    validandoSesion = false
  }
}

function validarAlVolver() {
  if (document.visibilityState === 'visible') {
    void validarSesion()
  }
}

onMounted(() => {
  window.addEventListener(SESSION_EXPIRED_EVENT, manejarSesionExpirada)
  document.addEventListener('visibilitychange', validarAlVolver)
  timerValidacion = window.setInterval(() => {
    if (document.visibilityState === 'visible') {
      void validarSesion()
    }
  }, 60_000)
  void validarSesion()
})

onBeforeUnmount(() => {
  window.removeEventListener(SESSION_EXPIRED_EVENT, manejarSesionExpirada)
  document.removeEventListener('visibilitychange', validarAlVolver)
  if (timerValidacion !== undefined) window.clearInterval(timerValidacion)
})
</script>