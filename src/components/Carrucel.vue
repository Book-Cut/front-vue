<template>
  <div
    id="beneficios"
    ref="carrusel"
    class="carousel slide bg-white shadow-sm rounded-4 overflow-hidden"
  >
    <div class="carousel-inner">
      <div
        v-for="(b, i) in items"
        :key="b.ID_publicacion ?? i"
        class="carousel-item"
        :class="{ active: i === 0 }"
      >
        <div class="ratio ratio-16x9">
          <img
            :src="b.imagen_url"
            class="d-block w-100 h-100 object-fit-cover"
            :alt="b.titulo"
            @click="b.ID_publicacion && (seleccionado = b)"
          />
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
import { beneficiosVigentes } from "../services/beneficios.service";

const vigentes = ref([]);
const seleccionado = ref(null);
const carrusel = ref(null);
let instanciaCarrusel;
const relleno = [
  {
    imagen_url: "https://placehold.co/1600x900.png?text=Anuncio+1",
    titulo: "Anuncio",
  },
];
const items = computed(() =>
  vigentes.value.length ? vigentes.value : relleno,
);

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
      ride: "carousel",
      wrap: true,
    });
    instanciaCarrusel.cycle();
  }
});

onBeforeUnmount(() => instanciaCarrusel?.dispose());
</script>
