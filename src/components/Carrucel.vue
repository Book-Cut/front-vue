<template>
  <div
    id="beneficios"
    ref="carrusel"
    class="carousel slide bg-white shadow-sm rounded-4 overflow-hidden"
  >
    <div class="carousel-inner">
      <div
        v-for="(b, i) in items"
        :key="b.ID_publicacion ?? b.tipo ?? i"
        class="carousel-item"
        :class="{ active: i === 0 }"
      >
        <div class="ratio ratio-16x9 position-relative">
          <img
            :src="b.imagen_url"
            class="d-block w-100 h-100 object-fit-cover"
            :alt="b.titulo"
            @click="b.ID_publicacion && (seleccionado = b)"
          />
          <div
            v-if="b.tipo === 'reserva'"
            class="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center text-center text-white p-3"
            style="background: linear-gradient(0deg, rgb(15 23 42 / 82%), rgb(15 23 42 / 25%))"
          >
            <h2 class="display-6 fw-bold mb-2">¿Listo para un nuevo estilo?</h2>
            <p class="fs-5 mb-3">Reserva tu próxima cita en Book&Cut.</p>
            <RouterLink
              to="/agendar-servicio"
              class="btn btn-danger rounded-pill px-4 fw-bold"
            >
              Reservar cita
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
    <button
      class="carousel-control-prev"
      type="button"
      aria-label="Beneficio anterior"
      :disabled="items.length < 2"
      @click="instanciaCarrusel?.prev()"
    >
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Anterior</span>
    </button>
    <button
      class="carousel-control-next"
      type="button"
      aria-label="Beneficio siguiente"
      :disabled="items.length < 2"
      @click="instanciaCarrusel?.next()"
    >
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Siguiente</span>
    </button>
  </div>

  <div v-if="seleccionado">
    <div
      class="modal fade show d-block"
      tabindex="-1"
      role="dialog"
      @click.self="seleccionado = null"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content text-start">
          <div class="modal-header">
            <h5 class="modal-title">{{ seleccionado.titulo }}</h5>
            <button
              type="button"
              class="btn-close"
              aria-label="Cerrar"
              @click="seleccionado = null"
            ></button>
          </div>
          <img
            :src="seleccionado.imagen_url"
            class="img-fluid"
            :alt="seleccionado.titulo"
          />
          <div class="modal-body">
            <p class="mb-1">
              <strong>Tipo:</strong> {{ seleccionado.Tipo_beneficio }}
            </p>
            <p class="mb-0">
              <strong>Vigencia:</strong> del {{ seleccionado.Fecha_inicio }} al
              {{ seleccionado.Fecha_fin }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show"></div>
  </div>
</template>

<script setup>
import Carousel from "bootstrap/js/dist/carousel";
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { beneficiosVigentes } from "../services/beneficios.service";

const vigentes = ref([]);
const seleccionado = ref(null);
const carrusel = ref(null);
let instanciaCarrusel;
const diapositivaReserva = {
  tipo: "reserva",
  imagen_url: `${import.meta.env.BASE_URL}barberia.png`,
  titulo: "Reserva tu próxima cita",
};
const relleno = [
  {
    ...diapositivaReserva,
  },
];
const items = computed(() => {
  const beneficios = vigentes.value.map((beneficio) => ({
    ...beneficio,
    tipo: "beneficio",
  }));

  if (beneficios.length === 1) {
    beneficios.push(diapositivaReserva);
  }

  return beneficios.length ? beneficios : relleno;
});

onMounted(async () => {
  try {
    vigentes.value = await beneficiosVigentes();
  } catch {
    vigentes.value = [];
  }

  await nextTick();
  if (items.value.length > 1) {
    instanciaCarrusel = new Carousel(carrusel.value, {
      interval: 5000,
      pause: false,
      wrap: true,
    });
    instanciaCarrusel.cycle();
  }
});

onBeforeUnmount(() => instanciaCarrusel?.dispose());
</script>
