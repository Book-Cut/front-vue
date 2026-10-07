<template>
  <div class="bg-body-secondary min-vh-100">
    <HeaderNav />

    <main class="container-fluid text-center">
      <section class="min-vh-100 py-3">
        <h1 class="fs-6 fw-normal mb-4">BIENVENIDO A BOOK&CUT</h1>

        <div class="row justify-content-center">
          <div class="col-12 col-lg-8">
            <Carrucel />
          </div>
        </div>

        <a class="d-inline-block mt-2 fs-3 text-dark text-decoration-none" href="#locales"
          aria-label="Ver locales">⌄</a>
      </section>

      <Servicios />

      
      <section id="locales" class="min-vh-100 py-5">
        <h2 class="fs-4 fw-normal">Locales</h2>
      </section>
    </main>
  </div>
</template>

<script setup>
import HeaderNav from '../components/HeaderNav.vue'
import Carrucel from '../components/Carrucel.vue'
import Servicios from '@/components/Servicios.vue';
</script>
