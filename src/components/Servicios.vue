<template>
  <section class="container my-4">
    <h2 class="text-center text-uppercase text-dark fs-4 fw-bold mb-5">AGENDA TU CITA</h2>

    <p v-if="loading" class="text-center text-secondary">Cargando servicios...</p>
    <div v-else-if="errorMessage" class="alert alert-danger text-center" role="alert">
      {{ errorMessage }}
      <button class="btn btn-outline-danger btn-sm ms-2" type="button" @click="cargarServicios">
        Reintentar
      </button>
    </div>
    <p v-else-if="servicios.length === 0" class="text-center text-secondary">
      No hay servicios disponibles.
    </p>

    <div v-else class="row g-4 justify-content-center">
      <div v-for="servicio in servicios" :key="servicio.idServicio" class="col-12 col-md-6 col-lg-4">
        <article
          class="card border-dark border-2 rounded-3 shadow text-center p-4 h-100 d-flex flex-column align-items-center justify-content-between">
          <i :class="['bi', servicio.icono, 'fs-1', 'text-dark', 'mb-3']" aria-hidden="true"></i>
          <h3 class="h5 text-dark fw-bold mb-2">{{ servicio.titulo }}</h3>
          <p class="text-secondary fs-6 lh-sm mb-4">{{ servicio.descripcion }}</p>
          <RouterLink :to="{ name: 'DetalleServicio', params: { id: servicio.idServicio } }"
            class="btn btn-outline-dark w-100 mt-auto fw-semibold">
            Ver detalle
          </RouterLink>
        </article>
      </div>
    </div>

    <div class="text-center mt-5">
      <a href="#locales" aria-label="Ver locales" class="d-inline-block text-dark">
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </a>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { listarServicios } from '../services/servicios.service'

const presentacionServicios = {
}

const servicios = ref([])
const loading = ref(false)
const errorMessage = ref('')

onMounted(cargarServicios)

async function cargarServicios() {
  loading.value = true
  errorMessage.value = ''

  try {
    const data = await listarServicios({ authenticated: false })
    servicios.value = data.map((servicio) => {
      const normalizar = (texto) => texto
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase('es')
      const nombre = normalizar(servicio.Nombre)
      const presentacion = Object.entries(presentacionServicios)
        .find(([clave]) => normalizar(clave) === nombre)?.[1]

      return {
        ...servicio,
        titulo: presentacion?.titulo ?? servicio.Nombre,
        icono: presentacion?.icono ?? 'bi-scissors',
        descripcion: presentacion?.descripcion
          ?? `Servicio de ${servicio.Nombre}, con duración de ${servicio.Duracion} minutos.`,
      }
    })
  } catch (error) {
    errorMessage.value = error instanceof Error
      ? error.message
      : 'No se pudieron cargar los servicios.'
  } finally {
    loading.value = false
  }
}
</script>
