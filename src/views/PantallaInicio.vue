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
              <div class="ratio ratio-16x9">
              <iframe
              class="w-100"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.5311882168758!2d-73.09823112500221!3d7.064236992938298!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e683f643971869b%3A0x204f2fcef3291579!2sCentro%20Industrial%20Del%20Dise%C3%B1o%20y%20La%20Manufactura%20SENA!5e0!3m2!1ses-419!2sco!4v1770729345156!5m2!1ses-419!2sco"
              width="600"
              height="450"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
              </div>
            <div class="card-body">
            <h3 class="h5 text-dark fw-bold">Floridablanca</h3>
            <p class="mb-2">
              Kilómetro 6 Autopista Floridablanca #50-33, Floridablanca,
              Santander
            </p>
            <p class="mb-0"><i class="bi bi-clock me-2 text-dark" aria-hidden="true"></i>Lunes a viernes, 8:00 a 20:00</p>
            </div>
            </div>
          </article>

          <article class="col-12 col-lg-6">
            <div class="card bg-white h-100 shadow-sm border-0 rounded-4 overflow-hidden">
              <div class="ratio ratio-16x9">
              <iframe
              class="w-100"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63352.49926015607!2d-73.13685582122488!3d7.0642351780108195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e68156f04227d0d%3A0xed3995d5e22ed85f!2sServicio%20Nacional%20De%20Aprendizaje%20-%20Sena!5e0!3m2!1ses-419!2sco!4v1770729556468!5m2!1ses-419!2sco"
              width="600"
              height="450"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
              </div>
            <div class="card-body">
            <h3 class="h5 text-dark fw-bold">Bucaramanga</h3>
            <p class="mb-2">Cl. 15 #27-37, Bucaramanga, Santander</p>
            <p class="mb-0"><i class="bi bi-clock me-2 text-dark" aria-hidden="true"></i>Lunes a viernes, 8:00 a 20:00</p>
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
</script>