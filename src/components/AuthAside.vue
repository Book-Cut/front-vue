<template>
  <section
    class="bc-aside col-12 col-lg-7 d-none d-lg-flex"
    :style="{ '--bc-hero-img': `url(${base}barberia.png)` }"
  >
    <div class="m-auto px-5" style="max-width: 520px;">
      <img :src="logo" alt="Book&Cut" style="max-width: 200px;" class="mb-4 img-fluid" />
      <h2 class="mb-3">{{ titulo }}</h2>
      <p class="text-white-50 mb-0">{{ subtitulo }}</p>
      <ul class="bc-aside-list">
        <li><i class="bi bi-scissors" aria-hidden="true"></i>Elige servicio y barbero</li>
        <li><i class="bi bi-calendar-check" aria-hidden="true"></i>Aparta tu horario en un minuto</li>
        <li><i class="bi bi-envelope-check" aria-hidden="true"></i>Confirma tu cita por correo</li>
      </ul>
    </div>
  </section>
</template>

<script setup>
defineProps({
  titulo: { type: String, default: 'Tu estilo, tu momento.' },
  subtitulo: { type: String, default: 'Reserva y gestiona tus citas en un solo lugar.' },
})
const base = import.meta.env.BASE_URL
const logo = `${base}logo_blanca.png`
</script>
