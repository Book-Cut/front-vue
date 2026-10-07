<template>
  <div class="bg-body-secondary min-vh-100">
    <HeaderNav />

    <main class="container-fluid text-center">
      <!-- Sección Hero / Banner -->
      <section class="min-vh-100 py-3 d-flex flex-column justify-content-center align-items-center">
        <h1 class="fs-6 fw-normal mb-4">BIENVENIDO A BOOK&CUT</h1>

        <div class="row justify-content-center w-100">
          <div class="col-12 col-lg-8">
            <Carrucel />
          </div>
        </div>

        <a class="d-inline-block mt-4 fs-3 text-dark text-decoration-none" href="#servicios" aria-label="Ver servicios">⌄</a>
      </section>

      <!-- Nueva Sección de Servicios (3 Contenedores Individuales) -->
      <section id="servicios" class="py-5 bg-white shadow-sm rounded-4 my-4 container">
        <h2 class="fs-4 fw-bold mb-2 text-uppercase">Nuestros Servicios</h2>
        <p class="text-muted mb-4">Elige el servicio perfecto para tu estilo</p>

        <div class="row g-4 justify-content-center px-2">
          <!-- Servicio 1 -->
          <div class="col-12 col-md-6 col-lg-4">
            <div class="card h-100 border-0 shadow-sm service-card p-3">
              <div class="card-body d-flex flex-column justify-content-between">
                <div>
                  <div class="icon-wrapper mb-3 text-primary fs-1">
                    ✂️
                  </div>
                  <h3 class="card-title fs-5 fw-bold mb-2">Corte Clasico</h3>
                  <p class="card-text text-secondary fs-6">
                    Asesoría de imagen, corte personalizado a tijera o máquina, lavado y peinado con cera premium.
                  </p>
                </div>
                <div class="mt-4 pt-3 border-top d-flex justify-content-between align-items-center">
                  <span class="fw-bold fs-5 text-dark">$20.000</span>
                  <button class="btn btn-outline-dark btn-sm rounded-pill px-3">Reservar</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Servicio 2 -->
          <div class="col-12 col-md-6 col-lg-4">
            <div class="card h-100 border-0 shadow-sm service-card p-3">
              <div class="card-body d-flex flex-column justify-content-between">
                <div>
                  <div class="icon-wrapper mb-3 text-primary fs-1">
                    🪒
                  </div>
                  <h3 class="card-title fs-5 fw-bold mb-2">Perfilado de Barba</h3>
                  <p class="card-text text-secondary fs-6">
                    Perfilado tradicional con navaja, tratamiento de toalla caliente, aceites hidratantes y masaje.
                  </p>
                </div>
                <div class="mt-4 pt-3 border-top d-flex justify-content-between align-items-center">
                  <span class="fw-bold fs-5 text-dark">$15.000</span>
                  <button class="btn btn-outline-dark btn-sm rounded-pill px-3">Reservar</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Servicio 3 -->
          <div class="col-12 col-md-6 col-lg-4">
            <div class="card h-100 border-0 shadow-sm service-card p-3">
              <div class="card-body d-flex flex-column justify-content-between">
                <div>
                  <div class="icon-wrapper mb-3 text-primary fs-1">
                    👑
                  </div>
                  <h3 class="card-title fs-5 fw-bold mb-2">Corte y Barba Premium</h3>
                  <p class="card-text text-secondary fs-6">
                    Experiencia completa: Corte + Ritual de Barba + Exfoliación facial y limpieza de cejas.
                  </p>
                </div>
                <div class="mt-4 pt-3 border-top d-flex justify-content-between align-items-center">
                  <span class="fw-bold fs-5 text-dark">$35.000</span>
                  <button class="btn btn-dark btn-sm rounded-pill px-3">Reservar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Sección Locales -->
      <section id="locales" class="min-vh-100 py-5">
        <h2 class="fs-4 fw-normal">Locales</h2>
      </section>
    </main>
  </div>
</template>

<script setup>
import HeaderNav from '../components/HeaderNav.vue'
import Carrucel from '../components/Carrucel.vue'
</script>

<style scoped>
.service-card {
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  border-radius: 1rem;
}

.service-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12) !important;
}
</style>