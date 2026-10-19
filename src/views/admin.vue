<template>
  <HeaderNav admin-page />

  <main class="container py-4">
    <div v-if="errorMessage" class="alert alert-danger" role="alert">
      {{ errorMessage }}
    </div>
    <ConfirmacionCitaModal
      :mostrar="Boolean(citaPorConfirmar)"
      :accion="accionCita"
      :procesando="saving"
      @confirmar="confirmarAccionCita"
      @cerrar="citaPorConfirmar = null"
    />
    <RegistrarPagoModal
      :mostrar="Boolean(citaPorPagar)"
      :procesando="saving"
      @registrar="registrarPago"
      @cerrar="citaPorPagar = null"
    />

    <ul class="nav nav-tabs mb-4">
      <li class="nav-item">
        <button
          class="nav-link"
          :class="{ active: activeTab === 'servicios' }"
          type="button"
          @click="activeTab = 'servicios'"
        >
          Servicios
        </button>
      </li>
      <li class="nav-item">
        <button
          class="nav-link"
          :class="{ active: activeTab === 'citas' }"
          type="button"
          @click="openCitas"
        >
          Citas
        </button>
      </li>
      <li class="nav-item">
        <button
          class="nav-link"
          :class="{ active: activeTab === 'facturas' }"
          type="button"
          @click="openFacturas"
        >
          Facturas
        </button>
      </li>
      <li class="nav-item">
        <button
          class="nav-link"
          :class="{ active: activeTab === 'estadisticas' }"
          type="button"
          @click="openEstadisticas"
        >
          Estadísticas
        </button>
      </li>
      <li class="nav-item">
        <button
          class="nav-link"
          :class="{ active: activeTab === 'beneficios' }"
          type="button"
          @click="openBeneficios"
        >
          Beneficios
        </button>
      </li>
    </ul>

    <section v-if="activeTab === 'servicios'">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h1 class="h2 mb-0">Servicios</h1>
        <button class="btn btn-primary" type="button" @click="newService">
          Agregar servicio
        </button>
      </div>

      <form
        v-if="showServiceForm"
        class="card card-body mb-3"
        @submit.prevent="saveService"
      >
        <div class="row g-3">
          <div class="col-md-4">
            <label class="form-label" for="service-name">Nombre</label>
            <input
              id="service-name"
              v-model="serviceForm.Nombre"
              class="form-control"
              required
            />
          </div>
          <div class="col-md-3">
            <label class="form-label" for="service-duration"
              >Duración (minutos)</label
            >
            <input
              id="service-duration"
              v-model.number="serviceForm.Duracion"
              class="form-control"
              type="number"
              min="1"
              required
            />
          </div>
          <div class="col-md-3">
            <label class="form-label" for="service-price">Precio</label>
            <input
              id="service-price"
              v-model="serviceForm.Precio"
              class="form-control"
              type="text"
              inputmode="numeric"
              pattern="[0-9]*"
              @input="
                serviceForm.Precio = serviceForm.Precio.replace(/[^0-9]/g, '')
              "
              required
            />
          </div>
          <div class="col-md-2 d-flex align-items-end gap-2">
            <button class="btn btn-success" type="submit" :disabled="saving">
              {{ saving ? "Guardando..." : "Guardar" }}
            </button>
            <button
              class="btn btn-secondary"
              type="button"
              @click="showServiceForm = false"
            >
              Cancelar
            </button>
          </div>
        </div>
      </form>

      <p v-if="loading" class="text-secondary">Cargando servicios...</p>

      <div v-else class="table-responsive">
        <table class="table table-striped align-middle">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Duración</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="service in services" :key="service.idServicio">
              <td>{{ service.Nombre }}</td>
              <td>{{ service.Duracion }} min</td>
              <td>{{ formatCurrency(service.Precio) }}</td>
              <td>
                <button
                  class="btn btn-sm btn-outline-primary me-2"
                  type="button"
                  @click="editService(service)"
                >
                  Editar
                </button>
                <button
                  class="btn btn-sm btn-outline-danger"
                  type="button"
                  @click="deleteService(service)"
                >
                  Eliminar
                </button>
              </td>
            </tr>
            <tr v-if="services.length === 0">
              <td colspan="4" class="text-center">No hay servicios.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section v-else-if="activeTab === 'citas'">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h1 class="h2 mb-0">Citas</h1>
        <button
          class="btn btn-outline-primary"
          type="button"
          :disabled="loadingCitas"
          @click="loadCitas"
        >
          Actualizar
        </button>
      </div>

      <div v-if="citasError" class="alert alert-danger" role="alert">
        {{ citasError }}
      </div>

      <p v-if="loadingCitas" class="text-secondary">Cargando citas...</p>

      <div v-else class="table-responsive">
        <table class="table table-striped align-middle">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Cliente</th>
              <th>Teléfono</th>
              <th>Servicios</th>
              <th>Barbero</th>
              <th>Estado</th>
              <th>Pago</th>
              <th>Modalidad</th>
              <th>Total</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cita in citas" :key="cita.idCita">
              <td>{{ cita.Fecha || "—" }}</td>
              <td>{{ cita.Hora || "—" }}</td>
              <td>{{ cita.Cliente || "—" }}</td>
              <td>{{ cita.Telefono || "—" }}</td>
              <td>{{ cita.Servicios || "—" }}</td>
              <td>{{ cita.Barbero || "—" }}</td>
              <td>
                <span
                  v-if="cita.Estado"
                  class="badge"
                  :class="estadoClass(cita.Estado)"
                  >{{ cita.Estado }}</span
                >
                <span v-else>—</span>
              </td>
              <td>{{ cita.EstadoPago }}</td>
              <td>{{ cita.ModalidadPago }}</td>
              <td>
                {{ cita.Total === null ? "—" : formatCurrency(cita.Total) }}
              </td>
              <td class="text-center">
                <button
                  v-if="
                    cita.ModalidadPago === 'Presencial' &&
                    cita.EstadoPago === 'Pendiente' &&
                    ['Confirmado', 'Finalizado'].includes(cita.Estado)
                  "
                  class="btn btn-sm btn-outline-primary me-2"
                  type="button"
                  :disabled="saving"
                  @click="abrirRegistroPago(cita.idCita)"
                >
                  Registrar pago
                </button>
                <button
                  v-if="cita.Estado === 'Confirmado'"
                  class="btn btn-sm btn-outline-success me-2"
                  type="button"
                  :disabled="saving"
                  @click="abrirConfirmacion(cita.idCita, 'finalizar')"
                >
                  Finalizar
                </button>
                <button
                  v-if="
                    cita.Estado !== 'Cancelado' && cita.Estado !== 'Finalizado'
                  "
                  class="btn btn-sm btn-outline-danger"
                  type="button"
                  :disabled="saving"
                  @click="abrirConfirmacion(cita.idCita, 'cancelar')"
                >
                  Cancelar
                </button>
                <span
                  v-if="cita.Estado === 'Cancelado'"
                  class="text-muted small"
                  >Cancelada</span
                >
                <span
                  v-else-if="cita.Estado === 'Finalizado'"
                  class="text-muted small"
                  >Finalizada</span
                >
              </td>
            </tr>
            <tr v-if="citas.length === 0 && !citasError">
              <td colspan="11" class="text-center">No hay citas.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section v-else-if="activeTab === 'facturas'">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h1 class="h2 mb-0">Facturas</h1>
        <button
          class="btn btn-outline-primary"
          type="button"
          :disabled="loadingFacturas"
          @click="cargarFacturas"
        >
          Actualizar
        </button>
      </div>

      <div v-if="facturasError" class="alert alert-danger" role="alert">
        {{ facturasError }}
      </div>

      <p v-if="loadingFacturas" class="text-secondary">Cargando facturas...</p>

      <div v-else class="table-responsive">
        <table class="table table-striped align-middle">
          <thead>
            <tr>
              <th>Número</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Barbero</th>
              <th>Servicios</th>
              <th>Método de pago</th>
              <th>Estado</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="factura in facturas" :key="factura.idfactura">
              <td>{{ factura.numero_factura }}</td>
              <td>
                {{
                  factura.fecha_emision?.replace("T", " ").slice(0, 16) || "—"
                }}
              </td>
              <td>{{ factura.cita?.cliente?.Nombre || "—" }}</td>
              <td>{{ factura.cita?.barbero?.Nombre || "—" }}</td>
              <td>
                {{
                  factura.cita?.servicios
                    ?.map((servicio) => servicio.Nombre)
                    .join(", ") || "—"
                }}
              </td>
              <td>{{ factura.metodo_pago }}</td>
              <td>
                <span
                  class="badge"
                  :class="estadoFacturaClass(factura.estado_factura)"
                >
                  {{ factura.estado_factura }}
                </span>
              </td>
              <td>{{ formatCurrency(factura.total_pagar) }}</td>
            </tr>
            <tr v-if="facturas.length === 0 && !facturasError">
              <td colspan="8" class="text-center">No hay facturas.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section v-else-if="activeTab === 'beneficios'">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h1 class="h2 mb-0">Beneficios</h1>
        <button class="btn btn-primary" type="button" @click="nuevoBeneficio">
          Agregar beneficio
        </button>
      </div>

      <div v-if="beneficiosError" class="alert alert-danger">
        {{ beneficiosError }}
      </div>

      <form
        v-if="showBeneficioForm"
        class="card card-body mb-3"
        @submit.prevent="guardarBeneficio"
      >
        <div class="row g-3">
          <div class="col-md-4">
            <label class="form-label" for="ben-titulo">Título</label>
            <input
              id="ben-titulo"
              v-model="beneficioForm.titulo"
              class="form-control"
              maxlength="100"
              required
            />
          </div>
          <div class="col-md-4">
            <label class="form-label" for="ben-tipo">Tipo</label>
            <input
              id="ben-tipo"
              v-model="beneficioForm.Tipo_beneficio"
              class="form-control"
              required
            />
          </div>
          <div class="col-md-2">
            <label class="form-label" for="ben-inicio">Inicio</label>
            <input
              id="ben-inicio"
              v-model="beneficioForm.Fecha_inicio"
              type="date"
              class="form-control"
              required
            />
          </div>
          <div class="col-md-2">
            <label class="form-label" for="ben-fin">Fin</label>
            <input
              id="ben-fin"
              v-model="beneficioForm.Fecha_fin"
              type="date"
              class="form-control"
              :min="beneficioForm.Fecha_inicio"
              required
            />
          </div>
          <div class="col-md-8">
            <label class="form-label" for="ben-imagen"
              >Imagen (se muestra en el carrusel)</label
            >
            <input
              id="ben-imagen"
              type="file"
              accept="image/*"
              class="form-control"
              @change="imagenBeneficio = $event.target.files[0]"
            />
          </div>
          <div class="col-md-4 d-flex align-items-end gap-2">
            <button class="btn btn-success" type="submit" :disabled="saving">
              {{ saving ? "Guardando..." : "Guardar" }}
            </button>
            <button
              class="btn btn-secondary"
              type="button"
              @click="showBeneficioForm = false"
            >
              Cancelar
            </button>
          </div>
        </div>
      </form>

      <p v-if="loadingBeneficios" class="text-secondary">
        Cargando beneficios...
      </p>
      <div v-else class="table-responsive">
        <table class="table table-striped align-middle">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Título</th>
              <th>Tipo</th>
              <th>Inicio</th>
              <th>Fin</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="b in beneficios" :key="b.ID_publicacion">
              <td>
                <img
                  v-if="b.imagen_url"
                  :src="b.imagen_url"
                  alt=""
                  height="40"
                />
              </td>
              <td>{{ b.titulo }}</td>
              <td>{{ b.Tipo_beneficio }}</td>
              <td>{{ b.Fecha_inicio }}</td>
              <td>{{ b.Fecha_fin }}</td>
              <td>
                <button
                  class="btn btn-sm btn-outline-primary me-2"
                  type="button"
                  @click="editarBeneficio(b)"
                >
                  Editar
                </button>
                <button
                  class="btn btn-sm btn-outline-danger"
                  type="button"
                  @click="borrarBeneficio(b)"
                >
                  Eliminar
                </button>
              </td>
            </tr>
            <tr v-if="beneficios.length === 0">
              <td colspan="6" class="text-center">No hay beneficios.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section v-else>
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h1 class="h2 mb-0">Estadísticas</h1>
        <button
          class="btn btn-outline-primary"
          type="button"
          :disabled="loadingEstadisticas"
          @click="cargarEstadisticas"
        >
          Actualizar
        </button>
      </div>

      <form class="card card-body mb-4" @submit.prevent="cargarEstadisticas">
        <div class="row g-3 align-items-end">
          <div class="col-md-4">
            <label class="form-label" for="filtro-mes">Filtrar por mes</label>
            <input
              id="filtro-mes"
              v-model="filtroMes"
              class="form-control"
              type="month"
              @input="
                filtroDesde = '';
                filtroHasta = '';
              "
            />
          </div>
          <div class="col-md-3">
            <label class="form-label" for="filtro-desde">Desde</label>
            <input
              id="filtro-desde"
              v-model="filtroDesde"
              class="form-control"
              type="date"
              :disabled="Boolean(filtroMes)"
              @input="filtroMes = ''"
            />
          </div>
          <div class="col-md-3">
            <label class="form-label" for="filtro-hasta">Hasta</label>
            <input
              id="filtro-hasta"
              v-model="filtroHasta"
              class="form-control"
              type="date"
              :min="filtroDesde || undefined"
              :disabled="Boolean(filtroMes)"
              @input="filtroMes = ''"
            />
          </div>
          <div class="col-md-2 d-flex gap-2">
            <button
              class="btn btn-primary"
              type="submit"
              :disabled="loadingEstadisticas"
            >
              Filtrar
            </button>
            <button
              class="btn btn-outline-secondary"
              type="button"
              :disabled="loadingEstadisticas"
              @click="limpiarFiltros"
            >
              Limpiar
            </button>
          </div>
        </div>
      </form>

      <div v-if="estadisticasError" class="alert alert-danger" role="alert">
        {{ estadisticasError }}
      </div>
      <p v-if="loadingEstadisticas" class="text-secondary">
        Cargando estadísticas...
      </p>

      <div v-else-if="estadisticas" class="row g-3">
        <div class="col-12 col-md-6 col-xl">
          <div class="card h-100 border-success">
            <div class="card-body">
              <h2 class="h6 text-secondary">Ganancia total</h2>
              <p class="h3 mb-0">
                {{ formatCurrency(estadisticas.gananciaTotal) }}
              </p>
              <small class="text-secondary">Facturas pagadas</small>
            </div>
          </div>
        </div>
        <div
          v-for="estado in estadosEstadisticas"
          :key="estado.clave"
          class="col-6 col-md-3 col-xl"
        >
          <div class="card h-100">
            <div class="card-body">
              <h2 class="h6 text-secondary">{{ estado.nombre }}</h2>
              <p class="h3 mb-0">{{ estadisticas.citas[estado.clave] }}</p>
              <small class="text-secondary">Citas</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { onMounted, ref } from "vue";
import HeaderNav from "../components/HeaderNav.vue";
import ConfirmacionCitaModal from "../components/ConfirmacionCitaModal.vue";
import RegistrarPagoModal from "../components/RegistrarPagoModal.vue";
import {
  consultarEstadisticas,
  listarFacturas,
} from "../services/facturas.service";
import {
  actualizarServicio,
  crearServicio,
  eliminarServicio,
  listarServicios,
} from "../services/servicios.service";
import {
  listarCitas,
  cancelarCita,
  finalizarCita,
  pagarCita,
} from "../services/citas.service";
//import { error } from 'console'
import { useAuthStore } from "../stores/auth";
import {
  listarBeneficios,
  crearBeneficio,
  actualizarBeneficio,
  eliminarBeneficio,
} from "../services/beneficios.service";

const activeTab = ref("servicios");
const citas = ref([]);
const loadingCitas = ref(false);
const citasError = ref("");
const services = ref([]);
const loading = ref(false);
const saving = ref(false);
const errorMessage = ref("");
const showServiceForm = ref(false);
const serviceForm = ref({
  idServicio: null,
  Nombre: "",
  Duracion: 30,
  Precio: 0,
});
const citaPorConfirmar = ref(null);
const citaPorPagar = ref(null);
const accionCita = ref("cancelar");
const facturas = ref([]);
const loadingFacturas = ref(false);
const facturasError = ref("");
const estadisticas = ref(null);
const loadingEstadisticas = ref(false);
const estadisticasError = ref("");
const filtroMes = ref("");
const filtroDesde = ref("");
const filtroHasta = ref("");
const estadosEstadisticas = [
  { clave: "Finalizado", nombre: "Finalizadas" },
  { clave: "Cancelado", nombre: "Canceladas" },
  { clave: "Pendiente", nombre: "Pendientes" },
  { clave: "Confirmado", nombre: "Confirmadas" },
];
const authStore = useAuthStore();
const beneficios = ref([]);
const loadingBeneficios = ref(false);
const beneficiosError = ref("");
const showBeneficioForm = ref(false);
const beneficioForm = ref({});
const imagenBeneficio = ref(null);

onMounted(loadServices);

async function loadServices() {
  loading.value = true;
  errorMessage.value = "";

  try {
    services.value = await listarServicios();
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    loading.value = false;
  }
}

function estadoClass(estado) {
  return (
    {
      Confirmado: "bg-success",
      Pendiente: "bg-warning text-dark",
      Cancelado: "bg-danger",
      Finalizado: "bg-secondary",
    }[estado] ?? "bg-secondary"
  );
}

function openCitas() {
  activeTab.value = "citas";
  loadCitas();
}

function abrirRegistroPago(idCita) {
  citaPorPagar.value = idCita;
}

async function registrarPago(metodoPago) {
  if (!citaPorPagar.value) return;
  saving.value = true;
  citasError.value = "";

  try {
    await pagarCita(citaPorPagar.value, metodoPago);
    citaPorPagar.value = null;
    await loadCitas();
  } catch (error) {
    citasError.value = error.message || "No se pudo registrar el pago.";
  } finally {
    saving.value = false;
  }
}

function openFacturas() {
  activeTab.value = "facturas";
  cargarFacturas();
}

function openEstadisticas() {
  activeTab.value = "estadisticas";
  cargarEstadisticas();
}

async function loadCitas() {
  loadingCitas.value = true;
  citasError.value = "";

  try {
    citas.value = await listarCitas();
  } catch (error) {
    citas.value = [];
    citasError.value = error.message;
  } finally {
    loadingCitas.value = false;
  }
}

async function cargarFacturas() {
  loadingFacturas.value = true;
  facturasError.value = "";

  try {
    facturas.value = await listarFacturas();
  } catch (error) {
    facturas.value = [];
    facturasError.value =
      error.message || "No se pudieron cargar las facturas.";
  } finally {
    loadingFacturas.value = false;
  }
}

async function cargarEstadisticas() {
  loadingEstadisticas.value = true;
  estadisticasError.value = "";

  try {
    estadisticas.value = await consultarEstadisticas({
      mes: filtroMes.value,
      desde: filtroDesde.value,
      hasta: filtroHasta.value,
    });
  } catch (error) {
    estadisticasError.value =
      error.message || "No se pudieron cargar las estadísticas.";
  } finally {
    loadingEstadisticas.value = false;
  }
}

function limpiarFiltros() {
  filtroMes.value = "";
  filtroDesde.value = "";
  filtroHasta.value = "";
  cargarEstadisticas();
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(Number(amount || 0));
}

function estadoFacturaClass(estado) {
  return (
    {
      Anulada: "bg-danger",
      Pagada: "bg-success",
    }[estado] ?? "bg-secondary"
  );
}

function newService() {
  serviceForm.value = { idServicio: null, Nombre: "", Duracion: 30, Precio: 0 };
  showServiceForm.value = true;
}

function editService(service) {
  serviceForm.value = { ...service };
  showServiceForm.value = true;
}

async function saveService() {
  saving.value = true;
  errorMessage.value = "";

  try {
    const editing = Boolean(serviceForm.value.idServicio);
    const payload = {
      Nombre: serviceForm.value.Nombre,
      Duracion: serviceForm.value.Duracion,
      Precio: serviceForm.value.Precio,
    };

    if (editing) {
      await actualizarServicio(serviceForm.value.idServicio, payload);
    } else {
      await crearServicio(payload);
    }
    showServiceForm.value = false;
    await loadServices();
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    saving.value = false;
  }
}

async function deleteService(service) {
  if (!window.confirm(`¿Eliminar el servicio "${service.Nombre}"?`)) return;
  errorMessage.value = "";

  try {
    await eliminarServicio(service.idServicio);
    await loadServices();
  } catch (error) {
    errorMessage.value = error.message;
  }
}

function abrirConfirmacion(idCita, accion) {
  citaPorConfirmar.value = idCita;
  accionCita.value = accion;
}

async function confirmarAccionCita() {
  if (!citaPorConfirmar.value) return;

  saving.value = true;
  errorMessage.value = "";

  try {
    if (accionCita.value === "finalizar") {
      await finalizarCita(citaPorConfirmar.value);
    } else {
      await cancelarCita(citaPorConfirmar.value);
    }
    citaPorConfirmar.value = null;
    await loadCitas();
  } catch (error) {
    citaPorConfirmar.value = null;
    errorMessage.value = error.message;
  } finally {
    saving.value = false;
  }
}

function openBeneficios() {
  activeTab.value = "beneficios";
  cargarBeneficios();
}

async function cargarBeneficios() {
  loadingBeneficios.value = true;
  beneficiosError.value = "";
  try {
    beneficios.value = await listarBeneficios();
  } catch (e) {
    beneficiosError.value = e.message;
  } finally {
    loadingBeneficios.value = false;
  }
}

function nuevoBeneficio() {
  beneficioForm.value = {
    ID_publicacion: null,
    titulo: "",
    Tipo_beneficio: "",
    Fecha_inicio: "",
    Fecha_fin: "",
  };
  imagenBeneficio.value = null;
  showBeneficioForm.value = true;
}

function editarBeneficio(b) {
  beneficioForm.value = { ...b };
  imagenBeneficio.value = null;
  showBeneficioForm.value = true;
}

async function guardarBeneficio() {
  saving.value = true;
  beneficiosError.value = "";
  try {
    const f = beneficioForm.value;
    const fd = new FormData();
    fd.append("titulo", f.titulo);
    fd.append("Tipo_beneficio", f.Tipo_beneficio);
    fd.append("Fecha_inicio", f.Fecha_inicio);
    fd.append("Fecha_fin", f.Fecha_fin);
    fd.append("Usuario_idUsuario", authStore.user.idUsuario);
    if (imagenBeneficio.value) fd.append("imagen", imagenBeneficio.value);

    if (f.ID_publicacion) await actualizarBeneficio(f.ID_publicacion, fd);
    else await crearBeneficio(fd);

    showBeneficioForm.value = false;
    await cargarBeneficios();
  } catch (e) {
    beneficiosError.value = e.message;
  } finally {
    saving.value = false;
  }
}

async function borrarBeneficio(b) {
  if (!window.confirm(`¿Eliminar el beneficio "${b.titulo}"?`)) return;
  try {
    await eliminarBeneficio(b.ID_publicacion);
    await cargarBeneficios();
  } catch (e) {
    beneficiosError.value = e.message;
  }
}
</script>
