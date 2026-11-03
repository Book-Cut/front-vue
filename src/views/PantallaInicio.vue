<template>
  <div class="bg-light text-dark">
    <HeaderNav />

    <main>
      <section id="inicio" class="bg-light text-center">
        <div class="container py-5">
          <p class="text-dark text-uppercase fw-semibold small mb-3">
            <span class="border-bottom border-3 border-danger pb-1">Estilo, precisión y cuidado</span>
          </p>
          <h1 class="display-4 text-dark fw-bold mb-3">Tu estilo merece<br class="d-md-none" /> un buen corte.</h1>
          <p class="text-secondary mx-auto mb-4">
            Encuentra tu servicio ideal y reserva tu próxima visita en Book&Cut.
          </p>
          <RouterLink class="btn btn-carmine btn-lg rounded-pill fw-bold px-4 mb-5 shadow" :to="{ name: 'AgendarServicio' }">
            <i class="bi bi-calendar-check me-2" aria-hidden="true"></i>
            Reservar cita
          </RouterLink>

          <div class="row justify-content-center">
            <div class="col-12 col-lg-9">
            <Carrucel />
            </div>
          </div>
          <a class="d-inline-block text-dark fs-4 mt-4" href="#servicios" aria-label="Ver servicios">
            <i class="bi bi-chevron-down" aria-hidden="true"></i>
          </a>
        </div>
      </section>

      <Servicios />

      <section id="locales" class="bg-light text-dark py-5">
        <div class="container">
          <p class="text-secondary text-center text-uppercase fw-semibold small mb-2">VISÍTANOS</p>
          <h2 class="text-center fw-bold mb-5">Encuentra tu Book&Cut</h2>

        <div id="contenedor-mapas" class="row g-4 justify-content-center">
          <article class="col-12 col-lg-6">
            <div class="card bg-white h-100 shadow-sm border-0 rounded-4 overflow-hidden">
              <img
                :src="imagenBarberia"
                alt="Herramientas de barbería Book&Cut"
                class="w-100 object-fit-cover"
                style="height: 260px"
                loading="lazy"
              />
            <div class="card-body">
            <h3 class="h5 text-dark fw-bold">Floridablanca</h3>
            <p class="mb-2">
              Kilómetro 6 Autopista Floridablanca #50-33, Floridablanca,
              Santander
            </p>
            <p class="mb-0"><i class="bi bi-clock me-2 text-dark" aria-hidden="true"></i>Lunes a viernes, 8:00 a 20:00</p>
            <a
              class="btn btn-outline-dark rounded-pill mt-3"
              href="https://www.google.com/maps/search/?api=1&query=7.064236992938298%2C-73.09823112500221"
              target="_blank"
              rel="noopener noreferrer"
            >
              Abrir en Google Maps
            </a>
            </div>
            </div>
          </article>

          <article class="col-12 col-lg-6">
            <div class="card bg-white h-100 shadow-sm border-0 rounded-4 overflow-hidden">
              <img
                :src="imagenBarberia"
                alt="Herramientas de barbería Book&Cut"
                class="w-100 object-fit-cover"
                style="height: 260px"
                loading="lazy"
              />
            <div class="card-body">
            <h3 class="h5 text-dark fw-bold">Bucaramanga</h3>
            <p class="mb-2">Cl. 15 #27-37, Bucaramanga, Santander</p>
            <p class="mb-0"><i class="bi bi-clock me-2 text-dark" aria-hidden="true"></i>Lunes a viernes, 8:00 a 20:00</p>
            <a
              class="btn btn-outline-dark rounded-pill mt-3"
              href="https://www.google.com/maps/search/?api=1&query=7.0642351780108195%2C-73.13685582122488"
              target="_blank"
              rel="noopener noreferrer"
            >
              Abrir en Google Maps
            </a>
            </div>
            </div>
          </article>
        </div>
        </div>
      </section>
    </main>

    <footer class="bg-dark text-white pt-5 pb-3">
      <div class="container text-center text-md-start">
        <div class="row text-center text-md-start">
          <div class="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
            <h5 class="text-light text-uppercase mb-4 fw-bold">
              Información de contacto
            </h5>
            <p>
              Kilómetro 6 Autopista Floridablanca #50-33, Floridablanca,
              Santander
            </p>
            <p>Gmail: Luis@bookcut.com</p>
            <p>Tel: +57 3175647890</p>
          </div>

          <div class="col-md-3 col-lg-2 col-xl-2 mx-auto mt-3">
            <h5 class="text-light text-uppercase mb-4 fw-bold text-center">
              Enlaces
            </h5>
            <div class="d-flex flex-column gap-3">
              <a href="#inicio" class="btn btn-outline-light w-100"> Inicio </a>
              <a href="#servicios" class="btn btn-outline-light w-100">
                Servicios
              </a>
            </div>
          </div>

          <div class="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
            <h5 class="text-light text-uppercase mb-4 fw-bold">
              Síguenos
            </h5>
            <a
              href="#"
              class="btn btn-primary m-1"
              ><i class="fab fa-facebook-f"></i
            ></a>
            <a
              href="#"
              class="btn btn-primary m-1"
              ><i class="fab fa-twitter"></i
            ></a>
            <a
              href="#"
              class="btn btn-primary m-1"
              ><i class="fab fa-instagram"></i
            ></a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import HeaderNav from '../components/HeaderNav.vue'
import Carrucel from '../components/Carrucel.vue'
import Servicios from '@/components/Servicios.vue';
import { RouterLink } from 'vue-router'
const imagenBarberia = `${import.meta.env.BASE_URL}barberia.png`
</script>