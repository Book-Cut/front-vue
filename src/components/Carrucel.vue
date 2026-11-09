<template>
  <div
    id="beneficios"
    class="carousel slide bg-white shadow-sm rounded-4 overflow-hidden position-relative"
  >
    <!-- Indicadores de posición si hay más de 1 beneficio -->
    <div v-if="items.length > 1" class="carousel-indicators mb-2">
      <button
        v-for="(_, index) in items"
        :key="index"
        type="button"
        :class="{ active: index === indiceActual }"
        :aria-label="`Beneficio ${index + 1}`"
        @click.stop="indiceActual = index"
      ></button>
    </div>

    <div class="carousel-inner beneficio-inner">
      <div
        v-for="(b, i) in items"
        :key="b.ID_publicacion ?? i"
        class="beneficio-item"
        :class="{ active: i === indiceActual }"
        style="cursor: pointer;"
        @click="b.ID_publicacion && (seleccionado = b)"
      >
        <img
          :src="b.imagen_url || imagenParaBeneficio(b)"
          class="d-block w-100 h-100 object-fit-cover"
          :alt="b.titulo"
          @error="usarImagenAlternativa($event, b)"
        />
        <!-- Overlay con título y tipo para destacar la promoción -->
        <div
          v-if="b.titulo && b.ID_publicacion"
          class="position-absolute bottom-0 start-0 end-0 p-3 p-md-4 text-white text-start"
          style="background: linear-gradient(transparent, rgba(15, 23, 42, 0.88));"
        >
          <span v-if="b.Tipo_beneficio" class="badge rounded-pill bg-danger px-3 py-1 mb-2 fw-semibold">
            {{ b.Tipo_beneficio }}
          </span>
          <h4 class="fw-bold mb-1 text-white fs-5 fs-md-4">{{ b.titulo }}</h4>
          <p class="small mb-0 text-white-50">Toca para ver detalles de la promoción</p>
        </div>
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
        <div class="modal-content text-start rounded-4 border-0 shadow">
          <div class="modal-header">
            <h5 class="modal-title fw-bold text-dark">{{ seleccionado.titulo }}</h5>
            <button
              type="button"
              class="btn-close"
              aria-label="Cerrar"
              @click="seleccionado = null"
            ></button>
          </div>
          <img
            :src="seleccionado.imagen_url || imagenParaBeneficio(seleccionado)"
            class="img-fluid"
            :alt="seleccionado.titulo"
            @error="usarImagenAlternativa($event, seleccionado)"
          />
          <div class="modal-body">
            <p class="mb-2">
              <span class="badge bg-danger me-2">{{ seleccionado.Tipo_beneficio }}</span>
            </p>
            <p class="mb-0 text-secondary">
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
let componenteActivo = true;
const relleno = [
  {
    imagen_url: null,
    titulo: "Promociones BookCut",
    Tipo_beneficio: "Especiales",
  },
];
const items = computed(() => (Array.isArray(vigentes.value) && vigentes.value.length) ? vigentes.value : relleno);

function imagenParaBeneficio(b) {
  if (b?.imagen_url) return b.imagen_url;
  const texto = encodeURIComponent(b?.titulo || "Beneficio BookCut");
  return `https://placehold.co/1600x900/1e293b/ffffff.png?text=${texto}`;
}

function usarImagenAlternativa(evento, b) {
  const imagen = evento.target;
  const fallback = imagenParaBeneficio(b);
  if (imagen.src !== fallback) {
    imagen.src = fallback;
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
    const data = await beneficiosVigentes();
    vigentes.value = Array.isArray(data) ? data : [];
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
