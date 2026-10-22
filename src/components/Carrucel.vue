<template>
  <div
    id="servicios"
    class="carousel slide"
  >
    <div class="carousel-inner">
      <div
        class="beneficios-pista"
        :style="{ transform: `translateX(-${indiceActual * 100}%)` }"
      >
        <div
          v-for="(b, i) in items"
          :key="b.ID_publicacion ?? i"
          class="beneficio-item"
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
    </div>
    <button
      class="carousel-control-prev"
      type="button"
      aria-label="Beneficio anterior"
      :disabled="items.length < 2"
      @click="moverAnterior"
    >
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Anterior</span>
    </button>
    <button
      class="carousel-control-next"
      type="button"
      aria-label="Beneficio siguiente"
      :disabled="items.length < 2"
      @click="moverSiguiente"
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
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { beneficiosVigentes } from "../services/beneficios.service";

const vigentes = ref([]);
const seleccionado = ref(null);
const indiceActual = ref(0);
let temporizador;
const relleno = [
  {
    imagen_url: "https://placehold.co/1600x900.png?text=Anuncio+1",
    titulo: "Anuncio",
  },
];
const items = computed(() =>
  vigentes.value.length ? vigentes.value : relleno,
);

function moverSiguiente() {
  indiceActual.value = (indiceActual.value + 1) % items.value.length;
}

function moverAnterior() {
  indiceActual.value =
    (indiceActual.value - 1 + items.value.length) % items.value.length;
}

onMounted(async () => {
  try {
    vigentes.value = await beneficiosVigentes();
  } catch {
    vigentes.value = [];
  }

  if (items.value.length > 1) {
    temporizador = setInterval(moverSiguiente, 5000);
  }
});

onBeforeUnmount(() => clearInterval(temporizador));
</script>

<style scoped>
.beneficios-pista {
  display: flex;
  width: 100%;
  transition: transform 0.6s ease;
}

.beneficio-item {
  flex: 0 0 100%;
}
</style>
