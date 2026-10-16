<template>
  <div class="bg-body-secondary min-vh-100">
    <HeaderNav />

    <main class="container-fluid text-center">
      <section id="inicio" class="min-vh-100 py-3">
        <h1 class="fs-6 fw-normal mb-4">BIENVENIDO A BOOK&CUT</h1>

        <div class="row justify-content-center">
          <div class="col-12 col-lg-8">
            <Carrucel />
          </div>
        </div>

        <a
          class="d-inline-block mt-2 fs-3 text-dark text-decoration-none"
          href="#locales"
          aria-label="Ver locales"
          >⌄</a
        >
      </section>

      <Servicios />

      <section id="locales" class="pantalla">
        <h2 class="text-center mb-5">CONOCE NUESTROS LOCALES</h2>

        <div id="contenedor-mapas" class="d-flex justify-content-sm-around">
          <div>
            <iframe
              class="mapas border border-dark rounded"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.5311882168758!2d-73.09823112500221!3d7.064236992938298!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e683f643971869b%3A0x204f2fcef3291579!2sCentro%20Industrial%20Del%20Dise%C3%B1o%20y%20La%20Manufactura%20SENA!5e0!3m2!1ses-419!2sco!4v1770729345156!5m2!1ses-419!2sco"
              width="600"
              height="450"
              style="border: 0"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
            <p>
              Kilómetro 6 Autopista Floridablanca #50-33, Floridablanca,
              Santander
            </p>
            <p>horario: Lunes a Viernes 8:00 a 20:00</p>
          </div>

          <div>
            <iframe
              class="mapas border border-dark rounded"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63352.49926015607!2d-73.13685582122488!3d7.0642351780108195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e68156f04227d0d%3A0xed3995d5e22ed85f!2sServicio%20Nacional%20De%20Aprendizaje%20-%20Sena!5e0!3m2!1ses-419!2sco!4v1770729556468!5m2!1ses-419!2sco"
              width="600"
              height="450"
              style="border: 0"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
            <p>Cl. 15 #27-37, Bucaramanga, Santander</p>
            <p>horario: Lunes a Viernes 8:00 a 20:00</p>
          </div>
        </div>

        <div>
          <a href="#inicio">
            <img style="transform: scaleY(-1)" class="flecha" src="" alt="" />
          </a>
        </div>
      </section>
    </main>

    <footer class="bg-dark text-white pt-4 pb-2">
      <div class="container text-center text-md-start">
        <div class="row text-center text-md-start">
          <div class="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
            <h5 class="text-uppercase mb-4 font-weight-bold text-warning">
              Informacion de contacto
            </h5>
            <p>
              Kilómetro 6 Autopista Floridablanca #50-33, Floridablanca,
              Santander
            </p>
            <p>Gmail: Luis@bookcut.com</p>
            <p>Tel: +57 3175647890</p>
          </div>

          <div class="col-md-3 col-lg-2 col-xl-2 mx-auto mt-3">
            <h5
              class="text-uppercase mb-4 font-weight-bold text-warning text-center"
            >
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
            <h5 class="text-uppercase mb-4 font-weight-bold text-warning">
              Síguenos
            </h5>
            <a
              href="#"
              class="btn btn-primary btn-floating m-1"
              style="background-color: #3b5998"
              ><i class="fab fa-facebook-f"></i
            ></a>
            <a
              href="#"
              class="btn btn-primary btn-floating m-1"
              style="background-color: #55acee"
              ><i class="fab fa-twitter"></i
            ></a>
            <a
              href="#"
              class="btn btn-primary btn-floating m-1"
              style="background-color: #ac2bac"
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
</script>