<template>
  <HeaderNav />
  <MensajeModal
    :mostrar="citaAgendada"
    titulo="Reserva confirmada"
    mensaje="¡Se han agendado tus citas con éxito!"
    @aceptar="router.push('/')"
  />

  <main class="bg-light min-vh-100">
    <div class="container py-4 py-md-5">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-8">
          <div class="bg-white border-0 shadow-lg rounded-4 p-4 p-md-5">
          <h1 class="fs-3 fw-bold text-dark mb-4">Agendar Cita</h1>
          <p class="text-muted mb-4">
            Puedes reservar varios servicios para el mismo día, incluso si hay espacios entre sus horarios.
          </p>
          <p class="small text-secondary mb-4">
            El pago se realiza en la barbería al finalizar la cita. Allí se elegirá el método de pago.
          </p>

          <p v-if="loadingServicios" class="text-center text-secondary">
            Cargando servicios...
          </p>
          <div v-if="errorMessage" class="alert alert-danger" role="alert">
            {{ errorMessage }}
          </div>

          <!-- Formulario de Agendamiento Múltiple -->
          <form @submit.prevent="confirmarReserva">
            <!-- Listado de Citas Dynamic -->
            <div
              v-for="(cita, index) in citas"
              :key="index"
              class="border border-2 border-light rounded-4 bg-light p-4 mb-3"
            >
              <div
                class="d-flex justify-content-between align-items-center mb-3"
              >
                <h2 class="text-muted small text-uppercase fw-bold mb-0">Servicio {{ index + 1 }}</h2>
                <button
                  v-if="citas.length > 1"
                  type="button"
                  class="btn btn-sm btn-outline-danger rounded-pill px-3"
                  @click="eliminarCita(index)"
                >
                  Eliminar servicio
                </button>
              </div>

              <div class="row g-3">
                <!-- Selección de Servicio -->
                <div class="col-12">
                  <label class="form-label text-muted small text-uppercase fw-bold mb-1">Servicio</label>
                  <select
                    class="form-select bg-white border border-secondary-subtle py-2 px-3 rounded-3 shadow-none"
                    v-model="cita.servicioId"
                    required
                    :disabled="loadingServicios"
                    @change="actualizarCitaServicio(index)"
                  >
                    <option value="" disabled>Selecciona un servicio</option>
                    <option
                      v-for="serv in listaServicios"
                      :key="serv.idServicio"
                      :value="serv.idServicio"
                    >
                      {{ serv.Nombre }} - ${{ serv.Precio }}
                    </option>
                  </select>
                </div>

                <!-- Selección de Especialista / Barbero -->
                <div v-if="index === 0" class="col-12 col-md-6">
                  <label class="form-label text-muted small text-uppercase fw-bold mb-1"
                    >Especialista / Barbero</label
                  >
                  <select
                    class="form-select bg-white border border-secondary-subtle py-2 px-3 rounded-3 shadow-none"
                    v-model="cita.barberoId"
                    required
                    @change="actualizarHorarioReserva"
                  >
                    <option value="" disabled>Selecciona un profesional</option>
                    <option
                      v-for="barbero in barberos"
                      :key="barbero.idUsuario"
                      :value="barbero.idUsuario"
                    >
                      {{ barbero.Nombre
                      }}{{
                        barbero.especialidad ? ` - ${barbero.especialidad}` : ""
                      }}
                    </option>
                  </select>
                </div>

                <!-- Selección de Fecha -->
                <div v-if="index === 0" class="col-12 col-md-6">
                  <label class="form-label text-muted small text-uppercase fw-bold mb-1">Fecha de la cita</label>
                  <input
                    type="date"
                    class="form-control bg-white border border-secondary-subtle py-2 px-3 rounded-3 shadow-none"
                    v-model="cita.fecha"
                    :min="fechaMinima"
                    required
                    @change="actualizarHorarioReserva"
                  />
                </div>

                <!-- Horarios Disponibles -->
                <div class="col-12">
                  <label class="form-label text-muted small text-uppercase fw-bold mb-2 d-block"
                    >Hora disponible</label
                  >
                  <div class="d-flex flex-wrap gap-2">
                    <button
                      type="button"
                      v-for="hora in horasDisponibles[index] || []"
                      :key="hora"
                      :class="[
                        'btn rounded-pill px-3',
                        cita.hora === hora ? 'btn-dark' : 'btn-outline-secondary',
                      ]"
                      :disabled="
                        loadingDisponibilidad ||
                        esHoraOcupadaEnOtraCita(index, hora)
                      "
                      @click="cita.hora = hora"
                    >
                      {{ hora }}
                    </button>
                  </div>

                  <small
                    v-if="loadingDisponibilidad"
                    class="text-secondary d-block mt-1"
                  >
                    Consultando disponibilidad...
                  </small>
                  <small
                    v-else-if="
                      citas[0].barberoId &&
                      citas[0].fecha &&
                      cita.servicioId &&
                      !(horasDisponibles[index] || []).length
                    "
                    class="text-secondary d-block mt-1"
                  >
                    No hay horarios disponibles para este servicio en esta
                    fecha.
                  </small>
                  <small
                    v-else-if="
                      !cita.hora && (horasDisponibles[index] || []).length
                    "
                    class="text-danger d-block mt-1"
                  >
                    Selecciona una hora.
                  </small>
                  <small
                    v-else-if="
                      cita.hora && esHoraOcupadaEnOtraCita(index, cita.hora)
                    "
                    class="text-danger d-block mt-1"
                  >
                    Esta hora se cruza con otro servicio de la reserva.
                  </small>
                </div>

                <div v-if="index > 0" class="col-12">
                  <small class="text-secondary"
                    >Comparte profesional y fecha; elige una hora
                    independiente.</small
                  >
                </div>
              </div>
            </div>

            <!-- Botón para agregar otro servicio -->
            <div class="mb-4">
              <button
                type="button"
                class="btn btn-outline-dark btn-sm rounded-pill px-3 fw-semibold"
                @click="agregarNuevaCita"
              >
                Agregar otro servicio
              </button>
            </div>

            <!-- Resumen del Total -->
            <div class="d-flex justify-content-between align-items-center py-3 px-4 bg-light rounded-3 mb-4 mt-2">
              <p class="text-muted text-uppercase small fw-bold mb-0">
                Total ({{ citas.length }} {{ citas.length === 1 ? "servicio" : "servicios" }})
              </p>
              <p class="fs-3 fw-bold text-dark mb-0">${{ calcularTotal }}</p>
            </div>

            <!-- Datos del Cliente -->
            <h2 class="fs-5 fw-bold text-dark mt-4 mb-3">Datos de confirmación</h2>

            <div class="row g-3">
              <div class="col-12 col-md-6">
                <label class="form-label text-muted small text-uppercase fw-bold mb-1">Nombre completo</label>
                <input
                  type="text"
                  class="form-control bg-light border border-secondary-subtle py-2 px-3 rounded-3 shadow-none"
                  v-model="cliente.nombreCliente"
                  placeholder="Tu nombre completo"
                  required
                />
              </div>

              <div class="col-12 col-md-6">
                <label class="form-label text-muted small text-uppercase fw-bold mb-1">Teléfono / WhatsApp</label>
                <input
                  type="tel"
                  class="form-control bg-light border border-secondary-subtle py-2 px-3 rounded-3 shadow-none"
                  v-model="cliente.telefonoCliente"
                  placeholder="Ej: 3001234567"
                  required
                />
              </div>

              <div class="col-12">
                <label class="form-label text-muted small text-uppercase fw-bold mb-1"
                  >Notas u observaciones (Opcional)</label
                >
                <textarea
                  class="form-control bg-light border border-secondary-subtle py-2 px-3 rounded-3 shadow-none"
                  rows="2"
                  v-model="cliente.notas"
                  placeholder="Ej: Prefiero degrafilado en los lados..."
                ></textarea>
              </div>
            </div>

            <!-- Botones de Acción -->
            <div class="d-flex flex-column flex-md-row justify-content-end gap-3 mt-4">
              <button
                type="button"
                class="btn btn-light text-dark fw-semibold rounded-pill px-4 py-2"
                @click="$router.back()"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="btn btn-dark rounded-pill px-5 py-2 fw-bold"
                :disabled="
                  !esFormularioValido || loadingServicios || loadingReserva
                "
              >
                <span
                  v-if="loadingReserva"
                  class="spinner-border spinner-border-sm me-1"
                  role="status"
                ></span>
                {{
                  loadingReserva
                    ? "Guardando..."
                    : `Confirmar Reserva (${citas.length} ${citas.length === 1 ? "servicio" : "servicios"})`
                }}
              </button>
            </div>
          </form>
            </div>
          </div>
        </div>
      </div>
    </main>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import HeaderNav from "../components/HeaderNav.vue";
import MensajeModal from "../components/MensajeModal.vue";
import { useAuthStore } from "../stores/auth";
import { listarServicios } from "../services/servicios.service";
import { listarBarberos } from "../services/barberos.service";
import { crearCita, listarHorasDisponibles } from "../services/citas.service";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const listaServicios = ref([]);
const loadingServicios = ref(false);
const loadingReserva = ref(false);
const errorMessage = ref("");
const citaAgendada = ref(false);
const barberos = ref([]);
const horasDisponibles = ref([]);
const loadingDisponibilidad = ref(false);

// Fecha mínima (hoy)
const fechaMinima = computed(() => {
  const today = new Date();
  return today.toISOString().split("T")[0];
});

// Arreglo reactivo para múltiples citas
const citas = ref([
  {
    servicioId: "",
    barberoId: "",
    fecha: fechaMinima.value,
    hora: "",
    precio: 0,
  },
]);

// Datos globales del cliente
const cliente = ref({
  nombreCliente: "",
  telefonoCliente: "",
  notas: "",
});

// Función para agregar un nuevo bloque de cita
const agregarNuevaCita = () => {
  citas.value.push({
    servicioId: "",
    barberoId: "",
    fecha: fechaMinima.value,
    hora: "",
    precio: 0,
  });
};

// Función para eliminar un bloque de cita
const eliminarCita = (index) => {
  citas.value.splice(index, 1);
};

// Actualizar el precio de la cita cuando cambia el servicio
const actualizarCitaServicio = (index) => {
  const servId = citas.value[index].servicioId;
  const servicioEncontrado = listaServicios.value.find(
    (s) => String(s.idServicio) === String(servId),
  );
  citas.value[index].hora = "";
  if (servicioEncontrado) {
    citas.value[index].precio = Number(servicioEncontrado.Precio) || 0;
  }
};

// Cálculo del precio total
const calcularTotal = computed(() => {
  return citas.value.reduce((total, cita) => total + (cita.precio || 0), 0);
});

const obtenerDuracionServicio = (cita) => {
  const servicio = listaServicios.value.find(
    (item) => String(item.idServicio) === String(cita.servicioId),
  );
  return Number(servicio?.Duracion) || 0;
};

// Validar que todas las citas tengan hora y servicio
const esFormularioValido = computed(() => {
  const primeraCita = citas.value[0];
  return (
    citas.value.every(
      (cita, index) =>
        cita.servicioId &&
        cita.hora &&
        !esHoraOcupadaEnOtraCita(index, cita.hora),
    ) &&
    Boolean(primeraCita?.barberoId && primeraCita?.fecha && primeraCita?.hora)
  );
});

const actualizarHorarioReserva = () => {
  citas.value.forEach((cita) => {
    cita.hora = "";
  });
};

const esHoraOcupadaEnOtraCita = (indiceActual, hora) => {
  const citaActual = citas.value[indiceActual];
  const fechaReserva = citas.value[0]?.fecha;
  const inicioActual = new Date(`${fechaReserva}T${hora}:00`).getTime();
  const finActual = inicioActual + obtenerDuracionServicio(citaActual) * 60000;

  return citas.value.some((cita, indice) => {
    if (indice === indiceActual || !cita.hora || !cita.servicioId) return false;

    const inicioOtro = new Date(`${fechaReserva}T${cita.hora}:00`).getTime();
    const finOtro = inicioOtro + obtenerDuracionServicio(cita) * 60000;
    return inicioActual < finOtro && finActual > inicioOtro;
  });
};

let disponibilidadRequestId = 0;

watch(
  () => [
    citas.value[0]?.barberoId,
    citas.value[0]?.fecha,
    ...citas.value.map((cita) => cita.servicioId),
  ],
  async ([barberoId, fecha]) => {
    const requestId = ++disponibilidadRequestId;
    horasDisponibles.value = citas.value.map(() => []);
    errorMessage.value = "";

    if (!barberoId || !fecha || !citas.value.some((cita) => cita.servicioId)) {
      loadingDisponibilidad.value = false;
      return;
    }

    loadingDisponibilidad.value = true;
    try {
      const resultados = await Promise.all(
        citas.value.map((cita) => {
          const duracionServicio = obtenerDuracionServicio(cita);
          return cita.servicioId && duracionServicio
            ? listarHorasDisponibles(
                Number(barberoId),
                String(fecha),
                duracionServicio,
              )
            : Promise.resolve([]);
        }),
      );
      if (requestId === disponibilidadRequestId) {
        horasDisponibles.value = resultados;
      }
    } catch (error) {
      if (requestId === disponibilidadRequestId) {
        errorMessage.value =
          error instanceof Error
            ? error.message
            : "No se pudieron consultar los horarios disponibles.";
      }
    } finally {
      if (requestId === disponibilidadRequestId) {
        loadingDisponibilidad.value = false;
      }
    }
  },
);

onMounted(async () => {
  loadingServicios.value = true;
  try {
    [listaServicios.value, barberos.value] = await Promise.all([
      listarServicios(),
      listarBarberos(),
    ]);

    cliente.value.nombreCliente = authStore.user?.Nombre ?? "";
    cliente.value.telefonoCliente = authStore.user?.telefono ?? "";

    const queryServicio = route.query.servicio;
    const queryBarbero = route.query.barbero;

    if (typeof queryServicio === "string") {
      const encontrado = listaServicios.value.find(
        (servicio) => String(servicio.idServicio) === queryServicio,
      );
      if (encontrado) {
        citas.value[0].servicioId = encontrado.idServicio;
        citas.value[0].precio = Number(encontrado.Precio) || 0;
      }
    }

    if (typeof queryBarbero === "string") {
      citas.value[0].barberoId = Number(queryBarbero);
    }
  } catch (error) {
    errorMessage.value =
      error instanceof Error
        ? error.message
        : "No se pudieron cargar los servicios y profesionales.";
  } finally {
    loadingServicios.value = false;
  }
});

const confirmarReserva = async () => {
  loadingReserva.value = true;
  errorMessage.value = "";

  const primeraCita = citas.value[0];
  const fechaHoraCombinada = `${primeraCita.fecha} ${primeraCita.hora}:00`;

  const payload = {
    Fecha_hora: fechaHoraCombinada,
    Usuario_idUsuarioBar: Number(primeraCita.barberoId),
    nombre_cliente: cliente.value.nombreCliente,
    telefono_cliente: cliente.value.telefonoCliente,
    es_continuo: false,
    servicios: citas.value.map((cita) => ({
      idServicio: Number(cita.servicioId),
      fecha_hora_servicio: `${primeraCita.fecha} ${cita.hora}:00`,
    })),
  };

  try {
    await crearCita(payload);
    citaAgendada.value = true;
  } catch (error) {
    errorMessage.value =
      error instanceof Error
        ? error.message
        : "Hubo un error al procesar tu reserva.";
  } finally {
    loadingReserva.value = false;
  }
};
</script>
