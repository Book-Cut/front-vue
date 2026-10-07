<template>
  <div class="container my-4">
    <!-- Título de la sección -->
    <h2 class="text-center text-uppercase text-dark fs-4 fw-bold mb-5">AGENDA TU CITA</h2>

    <!-- Grid de Servicios -->
    <div class="row g-4 justify-content-center">
      <div v-for="(servicio, index) in servicios" :key="index" class="col-12 col-md-6 col-lg-4">
        <div class="card border-dark border-2 rounded-3 shadow text-center p-4 h-100 d-flex flex-column align-items-center justify-content-between">
          <div class="d-flex align-items-center justify-content-center text-dark mb-3">
            <i :class="['bi', servicio.icon, 'fs-1']" aria-hidden="true"></i>
          </div>

          <!-- Título del servicio -->
          <h3 class="h5 text-dark fw-normal mb-2">
            {{ servicio.titulo }}
          </h3>

          <!-- Descripción / Frase motivacional -->
          <p class="text-secondary fs-6 lh-sm mb-0">
            {{ servicio.descripcion }}
          </p>
        </div>
      </div>
    </div>

    <!-- Indicador / Flecha inferior -->
    <div class="text-center mt-5">
      <a href="#locales" aria-label="Ver locales" class="d-inline-block text-dark">
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import 'bootstrap-icons/font/bootstrap-icons.css'

const servicios = ref([
  {
    titulo: 'Corte de Cabello',
    descripcion: 'No solo estás cortando tu cabello, estás soltando versiones antiguas de ti para dejar espacio a lo nuevo. ¡Atrévete!',
    icon: 'bi-scissors'
  },
  {
    titulo: 'Corte para Niño',
    descripcion: '"Dale play a la diversión y deja que tu pequeño brille con un corte que refleje su personalidad única."',
    icon: 'bi-person'
  },
  {
    titulo: 'Tinte de Cabello',
    descripcion: '"Un nuevo color no es solo tinte, es el comienzo de una nueva versión de ti."',
    icon: 'bi-brush'
  },
  {
    titulo: 'Depilacion',
    descripcion: '"Dile adiós a la rutina diaria y hola a la suavidad duradera."',
    icon: 'bi-droplet'
  },
  {
    titulo: 'Tratamiento Facial',
    descripcion: '"Tu piel es tu mejor accesorio: cuídala, protégela y hazla brillar."',
    icon: 'bi-emoji-smile'
  },
  {
    titulo: 'Tratamiento Capilar',
    descripcion: '"¡Tu cabello es la corona que nunca te quitas, así que dale el amor que se merece!"',
    icon: 'bi-stars'
  }
])


</script>
