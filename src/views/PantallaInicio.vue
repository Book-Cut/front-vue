<template>
  <div class="text-dark">
    <HeaderNav />

    <main>
      <section id="inicio" class="bc-hero" :style="{ '--bc-hero-img': `url(${base}barberia.png)` }">
        <div class="container position-relative py-5">
          <div class="row align-items-center g-5 py-lg-4">
            <div class="col-12 col-lg-5">
              <h1 class="bc-rise mb-3">Tu estilo merece un buen corte.</h1>
              <p class="bc-rise lead text-white-50 mb-4">
                Elige tu servicio, tu barbero y tu horario. Reserva en un minuto.
              </p>
              <div class="bc-rise d-flex flex-wrap gap-2 mb-4">
                <RouterLink class="btn btn-danger btn-lg" :to="{ name: 'AgendarServicio' }">
                  <i class="bi bi-calendar-check me-2" aria-hidden="true"></i>Reservar cita
                </RouterLink>
                <RouterLink class="btn btn-outline-light btn-lg" :to="{ name: 'inicio', hash: '#servicios' }">
                  Ver servicios
                </RouterLink>
              </div>
              <ul class="bc-rise bc-points">
                <li><i class="bi bi-telephone-x" aria-hidden="true"></i>Sin llamadas</li>
                <li><i class="bi bi-person-check" aria-hidden="true"></i>Eliges a tu barbero</li>
                <li><i class="bi bi-clock" aria-hidden="true"></i>Lunes a viernes, 8:00 a 20:00</li>
              </ul>
            </div>
            <div class="col-12 col-lg-7 ps-lg-5">
              <div class="bc-frame">
                <Carrucel />
              </div>
            </div>
          </div>
        </div>
        <div class="bc-pole bc-pole-anim"></div>
      </section>

      <Servicios />

      <section id="como-funciona" class="bc-section pt-0">
        <div class="container">
          <h2 class="bc-title display-6">Reservar es así de simple</h2>
          <p class="bc-lead mb-5">Tres pasos y tu silla queda apartada.</p>
          <div class="bc-steps">
            <article class="bc-step">
              <div class="bc-step-n">1</div>
              <h3 class="mb-1">Elige tu servicio</h3>
              <p class="text-secondary mb-0">Corte, barba o lavado, con precio y duración a la vista.</p>
            </article>
            <article class="bc-step">
              <div class="bc-step-n">2</div>
              <h3 class="mb-1">Escoge barbero y hora</h3>
              <p class="text-secondary mb-0">Ve los horarios libres y aparta el que te quede mejor.</p>
            </article>
            <article class="bc-step">
              <div class="bc-step-n">3</div>
              <h3 class="mb-1">Confirma por correo</h3>
              <p class="text-secondary mb-0">Te llega un enlace para confirmar que asistirás.</p>
            </article>
          </div>
        </div>
      </section>

      <section id="locales" class="bc-section bg-white">
        <div class="container">
          <h2 class="bc-title display-6">Encuentra tu Book&amp;Cut</h2>
          <p class="bc-lead mb-5">Dos sedes en Santander. Escoge la más cercana.</p>

          <div id="contenedor-mapas" class="row g-4 justify-content-center">
            <article class="col-12 col-lg-6">
              <div class="bc-sede h-100">
                <div class="ratio ratio-16x9">
                  <iframe
                    title="Mapa de Book&Cut Floridablanca"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.5311882168758!2d-73.09823112500221!3d7.064236992938298!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e683f643971869b%3A0x204f2fcef3291579!2sCentro%20Industrial%20Del%20Dise%C3%B1o%20y%20La%20Manufactura%20SENA!5e0!3m2!1ses-419!2sco!4v1770729345156!5m2!1ses-419!2sco"
                    width="600"
                    height="450"
                    style="border: 0"
                    allowfullscreen
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
                <div class="p-4">
                  <span class="bc-chip mb-2"><i class="bi bi-geo-alt-fill" aria-hidden="true"></i>Sede</span>
                  <h3 class="h4 mb-2">Floridablanca</h3>
                  <p class="mb-2 text-secondary">
                    Kilómetro 6 Autopista Floridablanca #50-33, Floridablanca, Santander
                  </p>
                  <p class="mb-0">
                    <i class="bi bi-clock me-2 text-danger" aria-hidden="true"></i>Lunes a viernes, 8:00 a 20:00
                  </p>
                </div>
              </div>
            </article>

            <article class="col-12 col-lg-6">
              <div class="bc-sede h-100">
                <div class="ratio ratio-16x9">
                  <iframe
                    title="Mapa de Book&Cut Bucaramanga"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63352.49926015607!2d-73.13685582122488!3d7.0642351780108195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e68156f04227d0d%3A0xed3995d5e22ed85f!2sServicio%20Nacional%20De%20Aprendizaje%20-%20Sena!5e0!3m2!1ses-419!2sco!4v1770729556468!5m2!1ses-419!2sco"
                    width="600"
                    height="450"
                    style="border: 0"
                    allowfullscreen
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
                <div class="p-4">
                  <span class="bc-chip mb-2"><i class="bi bi-geo-alt-fill" aria-hidden="true"></i>Sede</span>
                  <h3 class="h4 mb-2">Bucaramanga</h3>
                  <p class="mb-2 text-secondary">Cl. 15 #27-37, Bucaramanga, Santander</p>
                  <p class="mb-0">
                    <i class="bi bi-clock me-2 text-danger" aria-hidden="true"></i>Lunes a viernes, 8:00 a 20:00
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>

    <footer class="bc-footer">
      <div class="container py-5">
        <div class="row g-4">
          <div class="col-12 col-md-5">
            <img :src="logo" alt="Book&Cut" width="150" class="mb-3" />
            <p class="text-white-50 mb-0">Reserva tu corte, tu barba o tu lavado sin llamadas ni filas.</p>
          </div>
          <div class="col-6 col-md-3">
            <h3 class="h6 text-white mb-3">Navegar</h3>
            <ul class="list-unstyled d-grid gap-2 mb-0">
              <li><RouterLink :to="{ name: 'inicio', hash: '#inicio' }" class="link-light link-opacity-75 text-decoration-none">Inicio</RouterLink></li>
              <li><RouterLink :to="{ name: 'inicio', hash: '#servicios' }" class="link-light link-opacity-75 text-decoration-none">Servicios</RouterLink></li>
              <li><RouterLink :to="{ name: 'inicio', hash: '#locales' }" class="link-light link-opacity-75 text-decoration-none">Sedes</RouterLink></li>
            </ul>
          </div>
          <div class="col-6 col-md-4">
            <h3 class="h6 text-white mb-3">Contacto</h3>
            <ul class="list-unstyled d-grid gap-2 mb-0 text-white-50">
              <li>Km 6 Autopista Floridablanca #50-33, Santander</li>
              <li><a class="link-light link-opacity-75 text-decoration-none" href="mailto:Luis@bookcut.com">Luis@bookcut.com</a></li>
              <li><a class="link-light link-opacity-75 text-decoration-none" href="tel:+573175647890">+57 317 564 7890</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="bc-footer-bottom py-3">
        <div class="container">© {{ new Date().getFullYear() }} Book&amp;Cut. Todos los derechos reservados.</div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import HeaderNav from "../components/HeaderNav.vue";
import Carrucel from "../components/Carrucel.vue";
import Servicios from "@/components/Servicios.vue";
import { RouterLink } from "vue-router";
const base = import.meta.env.BASE_URL;
const logo = `${import.meta.env.BASE_URL}logo_blanca.png`;
</script>
