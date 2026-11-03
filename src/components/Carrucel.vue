<template>
  <div
    id="beneficios"
    class="carousel slide bg-white shadow-sm rounded-4 overflow-hidden"
  >
    <div class="carousel-inner beneficio-inner">
      <div
        v-for="(b, i) in items"
        :key="b.ID_publicacion ?? i"
        class="beneficio-item"
        :class="{ active: i === indiceActual }"
      >
        <img
          :src="b.imagen_url || imagenAlternativa"
          class="d-block w-100 h-100 object-fit-cover"
          :alt="b.titulo"
          @error="usarImagenAlternativa"
          @click="b.ID_publicacion && (seleccionado = b)"
        />
      </div>
    </div>
    <button
      class="carousel-control-prev"
      type="button"
      aria-label="Beneficio anterior"
      :disabled="items.length < 2"
      @click="mostrarAnterior"
    >
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Anterior</span>
    </button>
    <button
      class="carousel-control-next"
      type="button"
      aria-label="Beneficio siguiente"
      :disabled="items.length < 2"
      @click="mostrarSiguiente"
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
            :src="seleccionado.imagen_url || imagenAlternativa"
            class="img-fluid"
            :alt="seleccionado.titulo"
            @error="usarImagenAlternativa"
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
const imagenAlternativa = "https://placehold.co/1600x900.png?text=Servicio+1";
let temporizador;
let componenteActivo = true;
const relleno = [
  {
    imagen_url: null,
    titulo: "Servicio 1",
  },
];
const items = computed(() => vigentes.value.length ? vigentes.value : relleno);

function usarImagenAlternativa(evento) {
  const imagen = evento.target;
  if (imagen.src !== imagenAlternativa) {
    imagen.src = imagenAlternativa;
  }
}

function mostrarSiguiente() {
  indiceActual.value = (indiceActual.value + 1) % items.value.length;
}

function mostrarAnterior() {
  indiceActual.value = (indiceActual.value - 1 + items.value.length) % items.value.length;
}

onMounted(async () => {
  try {
    vigentes.value = await beneficiosVigentes();
  } catch {
    vigentes.value = [];
  }

  if (!componenteActivo) return;

  if (items.value.length > 1) {
    temporizador = window.setInterval(mostrarSiguiente, 5000);
  }
});

onBeforeUnmount(() => {
  componenteActivo = false;
  window.clearInterval(temporizador);
});
</script>

<style scoped>
.beneficio-inner {
  aspect-ratio: 16 / 9;
}

.beneficio-item {
  position: absolute;
  inset: 0;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.6s ease;
}

.beneficio-item.active {
  opacity: 1;
  pointer-events: auto;
}
</style>
