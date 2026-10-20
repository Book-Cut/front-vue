<template>
  <div id="servicios" class="carousel slide" data-bs-ride="carousel">
    <div class="carousel-inner">
      <div
        v-for="(b, i) in items"
        :key="b.ID_publicacion ?? i"
        class="carousel-item"
        :class="{ active: i === 0 }"
      >
        <img
          :src="b.imagen_url"
          class="d-block w-100"
          :alt="b.titulo"
          style="aspect-ratio: 16/9; object-fit: cover; cursor: pointer"
          @click="b.ID_publicacion && (seleccionado = b)"
        />
      </div>
    </div>
    <button
      class="carousel-control-prev"
      type="button"
      data-bs-target="#servicios"
      data-bs-slide="prev"
    >
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Anterior</span>
    </button>
    <button
      class="carousel-control-next"
      type="button"
      data-bs-target="#servicios"
      data-bs-slide="next"
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
import { computed, onMounted, ref } from "vue";
import { beneficiosVigentes } from "../services/beneficios.service";

const vigentes = ref([]);
const seleccionado = ref(null);
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
});
</script>
