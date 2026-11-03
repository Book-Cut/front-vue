<template>
  <div class="bg-light min-vh-100">
    <HeaderNav />

    <main class="container py-5">
      <div class="text-center mb-4">
        <h1 class="h2 fw-bold text-dark mb-2">Mi perfil</h1>
      </div>

      <p v-if="cargando" class="text-center text-secondary">Cargando perfil...</p>

      <div v-else-if="perfil" class="row justify-content-center">
        <div class="col-12 col-md-10 col-lg-8">
          <div v-if="mensajeError" class="alert alert-danger" role="alert">
            {{ mensajeError }}
          </div>
          <div v-if="mensajeExito" class="alert alert-success" role="status">
            {{ mensajeExito }}
          </div>

          <section class="card bg-white border-0 shadow-sm rounded-4">
            <div class="card-body p-4 p-md-5">
              <form @submit.prevent="guardarCambios">
                <div class="text-center mb-4">
                  <div class="row justify-content-center mb-3">
                    <div class="col-4 col-sm-3 col-md-2">
                      <div class="ratio ratio-1x1 rounded-circle bg-light overflow-hidden">
                        <img
                          v-if="mostrarFoto && (vistaPreviaFoto || perfil?.foto_perfil)"
                          :src="vistaPreviaFoto || perfil.foto_perfil || ''"
                          alt="Foto de perfil"
                          class="w-100 h-100 object-fit-cover"
                          @error="mostrarFoto = false"
                        />
                        <span
                          v-if="!mostrarFoto || !(vistaPreviaFoto || perfil?.foto_perfil)"
                          class="d-flex align-items-center justify-content-center fs-3 fw-semibold text-dark"
                        >
                          {{ iniciales }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <h2 class="h4 fw-bold text-dark mb-1">{{ perfil.Nombre }}</h2>
                  <p class="text-muted small text-uppercase fw-semibold mb-0">{{ nombreRol }}</p>
                  <div class="mt-3">
                    <input
                      id="perfil-foto"
                      ref="entradaFoto"
                      class="form-control form-control-sm mx-auto"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      aria-label="Seleccionar foto de perfil"
                      style="max-width: 320px"
                      @change="seleccionarFoto"
                    />
                    <p class="form-text mb-2">JPG, PNG o WebP. Tamaño máximo: 5 MB.</p>
                    <div v-if="fotoSeleccionada" class="d-flex justify-content-center gap-2">
                      <button
                        class="btn btn-sm btn-dark rounded-pill px-3"
                        type="button"
                        :disabled="guardandoFoto"
                        @click="subirFoto"
                      >
                        {{ guardandoFoto ? 'Subiendo...' : 'Guardar foto' }}
                      </button>
                      <button
                        class="btn btn-sm btn-outline-secondary rounded-pill px-3"
                        type="button"
                        :disabled="guardandoFoto"
                        @click="cancelarSeleccionFoto"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                </div>

                <div class="row g-3">
                  <div class="col-12">
                    <label class="form-label text-muted small text-uppercase fw-bold mb-1" for="perfil-nombre">
                      Nombre completo
                    </label>
                    <input
                      id="perfil-nombre"
                      v-model.trim="formulario.Nombre"
                      class="form-control bg-light border-0 shadow-none"
                      autocomplete="name"
                      maxlength="255"
                      required
                    />
                  </div>

                  <div class="col-12 col-md-6">
                    <label class="form-label text-muted small text-uppercase fw-bold mb-1" for="perfil-correo">
                      Correo electrónico
                    </label>
                    <input
                      id="perfil-correo"
                      v-model.trim="formulario.correo"
                      class="form-control bg-light border-0 shadow-none"
                      type="email"
                      autocomplete="email"
                      maxlength="255"
                      required
                    />
                  </div>
                  <div class="col-12 col-md-6">
                    <label class="form-label text-muted small text-uppercase fw-bold mb-1" for="perfil-telefono">
                      Número celular
                    </label>
                    <input
                      id="perfil-telefono"
                      v-model.trim="formulario.telefono"
                      class="form-control bg-light border-0 shadow-none"
                      type="tel"
                      autocomplete="tel"
                      maxlength="45"
                      required
                    />
                  </div>
                  <div class="col-12 col-md-6">
                    <label class="form-label text-muted small text-uppercase fw-bold mb-1" for="perfil-contrasenha">
                      Nueva contraseña
                    </label>
                    <input
                      id="perfil-contrasenha"
                      v-model="formulario.contrasenha"
                      class="form-control bg-light border-0 shadow-none"
                      type="password"
                      autocomplete="new-password"
                      placeholder="Dejar en blanco para conservarla"
                    />
                  </div>
                  <div class="col-12 col-md-6">
                    <label class="form-label text-muted small text-uppercase fw-bold mb-1" for="perfil-confirmar-contrasenha">
                      Confirmar contraseña
                    </label>
                    <input
                      id="perfil-confirmar-contrasenha"
                      v-model="formulario.confirmarContrasenha"
                      class="form-control bg-light border-0 shadow-none"
                      type="password"
                      autocomplete="new-password"
                      :required="Boolean(formulario.contrasenha)"
                    />
                      </div>
            </div>

                <section v-if="esBarbero" class="mt-4 pt-4 border-top">
                  <h2 class="h5 mb-3">Datos del barbero</h2>
                  <div class="mb-4">
                    <label class="form-label d-block">Servicio de especialidad</label>
                    <div v-for="servicio in servicios" :key="servicio.idServicio" class="form-check">
                    <input
                    :id="`serv-${servicio.idServicio}`"
                    v-model="formulario.servicioIds"
                    class="form-check-input"
                    type="checkbox"
                    :value="servicio.idServicio"
                    />
                    <label class="form-check-label" :for="`serv-${servicio.idServicio}`">
                      {{ servicio.Nombre }}
                    </label>
                  </div>
                </div>

                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <h3 class="h6 mb-0">Horarios de atención</h3>
                    <button
                      class="btn btn-sm btn-outline-primary"
                      type="button"
                      :disabled="formulario.horarios.length >= diasSemana.length"
                      @click="agregarHorario"
                    >
                      Agregar día
                    </button>
                  </div>
                  <p v-if="formulario.horarios.length === 0" class="text-secondary">
                    No tienes horarios configurados.
                  </p>
                  <div
                    v-for="(horario, indice) in formulario.horarios"
                    :key="indice"
                    class="row g-2 align-items-end mb-2"
                  >
                    <div class="col-12 col-md-4">
                      <label class="form-label" :for="`dia-${indice}`">Día</label>
                      <select
                        :id="`dia-${indice}`"
                        v-model="horario.diasemana"
                        class="form-select"
                        required
                      >
                        <option
                          v-for="dia in diasDisponibles(horario.diasemana)"
                          :key="dia"
                          :value="dia"
                        >
                          {{ dia }}
                        </option>
                      </select>
                    </div>
                    <div class="col-6 col-md-3">
                      <label class="form-label" :for="`inicio-${indice}`">Hora de inicio</label>
                      <input
                        :id="`inicio-${indice}`"
                        v-model="horario.horainicio"
                        class="form-control"
                        type="time"
                        required
                      />
                    </div>
                    <div class="col-6 col-md-3">
                      <label class="form-label" :for="`fin-${indice}`">Hora de fin</label>
                      <input
                        :id="`fin-${indice}`"
                        v-model="horario.horafin"
                        class="form-control"
                        type="time"
                        required
                      />
                    </div>
                    <div class="col-12 col-md-2">
                      <button
                        class="btn btn-outline-danger w-100"
                        type="button"
                        @click="eliminarHorario(indice)"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                </section>

                <div class="d-flex justify-content-end mt-4">
                  <button class="btn btn-dark px-4 rounded-pill" type="submit" :disabled="guardando">
                    {{ guardando ? 'Guardando...' : 'Guardar cambios' }}
                  </button>
                </div>
              </form>
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import HeaderNav from '../components/HeaderNav.vue'
import { useAuthStore } from '../stores/auth'
import { actualizarFotoPerfil, actualizarPerfil, obtenerPerfil } from '../services/perfil.service'
import type { CambiosPerfil, HorarioPerfil, PerfilUsuario } from '../services/perfil.service'
import { listarServicios } from '../services/servicios.service'
import type { Servicio } from '../services/servicios.service'

const authStore = useAuthStore()
const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
const esBarbero = computed(() => Number(authStore.user?.Roles_IDRol) === 2)
const nombreRol = computed(() => {
  const nombre = authStore.user?.roles?.Nombre_rol ?? authStore.user?.Nombre_rol
  if (nombre) return nombre

  return Number(authStore.user?.Roles_IDRol) === 2
    ? 'Barbero'
    : Number(authStore.user?.Roles_IDRol) === 1
      ? 'Administrador'
      : 'Cliente'
})
const perfil = ref<PerfilUsuario | null>(null)
const servicios = ref<Servicio[]>([])
const cargando = ref(true)
const guardando = ref(false)
const mensajeError = ref('')
const mensajeExito = ref('')
const mostrarFoto = ref(true)
const entradaFoto = ref<HTMLInputElement | null>(null)
const fotoSeleccionada = ref<File | null>(null)
const vistaPreviaFoto = ref<string | null>(null)
const guardandoFoto = ref(false)
const iniciales = computed(() =>
  (perfil.value?.Nombre || 'U')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((palabra) => palabra.charAt(0).toUpperCase())
    .join(''),
)
const formulario = ref({
  Nombre: '',
  correo: '',
  telefono: '',
  contrasenha: '',
  confirmarContrasenha: '',
  servicioIds: [] as number[],          // ← antes: servicioId: ''
  horarios: [] as HorarioPerfil[],
})

onMounted(cargarPerfil)
onUnmounted(limpiarVistaPreviaFoto)

function seleccionarFoto(evento: Event) {
  const entrada = evento.target as HTMLInputElement
  const archivo = entrada.files?.[0]
  if (!archivo) return

  limpiarVistaPreviaFoto()
  fotoSeleccionada.value = archivo
  vistaPreviaFoto.value = URL.createObjectURL(archivo)
  mostrarFoto.value = true
  mensajeError.value = ''
  mensajeExito.value = ''
}

function limpiarVistaPreviaFoto() {
  if (vistaPreviaFoto.value) {
    URL.revokeObjectURL(vistaPreviaFoto.value)
    vistaPreviaFoto.value = null
  }
}

function cancelarSeleccionFoto() {
  fotoSeleccionada.value = null
  limpiarVistaPreviaFoto()
  mostrarFoto.value = true
  if (entradaFoto.value) entradaFoto.value.value = ''
}

async function subirFoto() {
  if (!fotoSeleccionada.value) return

  guardandoFoto.value = true
  mensajeError.value = ''
  mensajeExito.value = ''
  try {
    perfil.value = await actualizarFotoPerfil(fotoSeleccionada.value)
    authStore.login({ ...authStore.user, ...perfil.value }, authStore.token)
    fotoSeleccionada.value = null
    limpiarVistaPreviaFoto()
    mostrarFoto.value = true
    if (entradaFoto.value) entradaFoto.value.value = ''
    mensajeExito.value = 'Tu foto de perfil se actualizó correctamente.'
  } catch (error) {
    mensajeError.value = error instanceof Error ? error.message : 'No se pudo guardar la foto de perfil.'
  } finally {
    guardandoFoto.value = false
  }
}

async function cargarPerfil() {
  mensajeError.value = ''
  try {
    const [datosPerfil, serviciosDisponibles] = await Promise.all([
      obtenerPerfil(),
      listarServicios(),
    ])
    perfil.value = datosPerfil
    servicios.value = serviciosDisponibles
    formulario.value.Nombre = perfil.value.Nombre
    formulario.value.correo = perfil.value.correo
    formulario.value.telefono = perfil.value.telefono
    formulario.value.servicioIds = perfil.value.servicio_ids ?? []   // ← cambio
    formulario.value.horarios = perfil.value.horarios ?? []
    authStore.login({ ...authStore.user, ...perfil.value }, authStore.token)
  } catch (error) {
    mensajeError.value = error instanceof Error ? error.message : 'No se pudo cargar el perfil.'
  } finally {
    cargando.value = false
  }
}


async function guardarCambios() {
  mensajeError.value = ''
  mensajeExito.value = ''

  if (formulario.value.contrasenha && formulario.value.contrasenha.length < 6) {
    mensajeError.value = 'La contraseña debe tener al menos 6 caracteres.'
    return
  }

  if (
    formulario.value.contrasenha
    && formulario.value.confirmarContrasenha !== formulario.value.contrasenha
  ) {
    mensajeError.value = 'Las contraseñas no coinciden.'
    return
  }

  const datos: CambiosPerfil = {
    Nombre: formulario.value.Nombre,
    correo: formulario.value.correo,
    telefono: formulario.value.telefono,
  }
  if (esBarbero.value) {
    if (formulario.value.horarios.some((horario) => horario.horainicio >= horario.horafin)) {
      mensajeError.value = 'La hora de fin debe ser posterior a la hora de inicio en cada día.'
      return
    }
    datos.servicio_ids = formulario.value.servicioIds               // ← cambio
    datos.horarios = formulario.value.horarios
  }
  if (formulario.value.contrasenha) {
    datos.contrasenha = formulario.value.contrasenha
  }

  guardando.value = true
  try {
    perfil.value = await actualizarPerfil(datos)
    authStore.login({ ...authStore.user, ...perfil.value }, authStore.token)
    formulario.value.horarios = perfil.value.horarios ?? []
    formulario.value.servicioIds = perfil.value.servicio_ids ?? []  // ← cambio
    formulario.value.contrasenha = ''
    formulario.value.confirmarContrasenha = ''
    mensajeExito.value = 'Tus datos se actualizaron correctamente.'
  } catch (error) {
    mensajeError.value = error instanceof Error ? error.message : 'No se pudieron guardar los cambios.'
  } finally {
    guardando.value = false
  }
}

function diasDisponibles(diaSeleccionado: string) {
  const diasUsados = formulario.value.horarios.map((horario) => horario.diasemana)
  return diasSemana.filter((dia) => dia === diaSeleccionado || !diasUsados.includes(dia))
}

function agregarHorario() {
  const dia = diasSemana.find((diaSemana) => !formulario.value.horarios.some((horario) => horario.diasemana === diaSemana))
  if (!dia) return

  formulario.value.horarios.push({
    diasemana: dia,
    horainicio: '09:00',
    horafin: '17:00',
  })
}

function eliminarHorario(indice: number) {
  formulario.value.horarios.splice(indice, 1)
}



</script>