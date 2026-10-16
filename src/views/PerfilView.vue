<template>
  <div class="bg-body-secondary min-vh-100">
    <HeaderNav />

    <main class="container py-5">
      <div class="text-center mb-4">
        <h1 class="h2 mb-2">Mi perfil</h1>
      </div>

      <div v-if="mensajeError" class="alert alert-danger" role="alert">
        {{ mensajeError }}
      </div>
      <div v-if="mensajeExito" class="alert alert-success" role="status">
        {{ mensajeExito }}
      </div>

      <p v-if="cargando" class="text-center text-secondary">Cargando perfil...</p>

      <section v-else-if="perfil" class="card border-dark shadow-sm">
        <div class="card-body p-4">
          <form @submit.prevent="guardarCambios">
            <div class="row g-4 align-items-start">
              <div class="col-12 col-lg-3 text-center">
                <div
                  class="border border-dark rounded-3 bg-light mx-auto mb-3 d-flex align-items-center justify-content-center overflow-hidden"
                  style="width: 100%; max-width: 240px; aspect-ratio: 1"
                >
                  <img
                    v-if="perfil?.foto_perfil"
                    v-show="mostrarFoto"
                    :src="perfil.foto_perfil"
                    alt="Foto de perfil"
                    class="w-100 h-100 object-fit-cover"
                    @error="mostrarFoto = false"
                  />
                  <i v-if="!mostrarFoto || !perfil?.foto_perfil" class="bi bi-person-fill display-1 text-secondary" aria-hidden="true"></i>
                </div>
              </div>

              <div class="col-12 col-lg-9">
                <div class="mb-3">
                  <label class="form-label" for="perfil-nombre">Nombre completo</label>
                  <input
                    id="perfil-nombre"
                    v-model.trim="formulario.Nombre"
                    class="form-control"
                    autocomplete="name"
                    maxlength="255"
                    required
                  />
                </div>

                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label" for="perfil-correo">Correo electrónico</label>
                    <input
                      id="perfil-correo"
                      v-model.trim="formulario.correo"
                      class="form-control"
                      type="email"
                      autocomplete="email"
                      maxlength="255"
                      required
                    />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label" for="perfil-telefono">Número celular</label>
                    <input
                      id="perfil-telefono"
                      v-model.trim="formulario.telefono"
                      class="form-control"
                      type="tel"
                      autocomplete="tel"
                      maxlength="45"
                      required
                    />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label" for="perfil-contrasenha">Nueva contraseña</label>
                    <input
                      id="perfil-contrasenha"
                      v-model="formulario.contrasenha"
                      class="form-control"
                      type="password"
                      autocomplete="new-password"
                      placeholder="Dejar en blanco para conservarla"
                    />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label" for="perfil-confirmar-contrasenha">Confirmar contraseña</label>
                    <input
                      id="perfil-confirmar-contrasenha"
                      v-model="formulario.confirmarContrasenha"
                      class="form-control"
                      type="password"
                      autocomplete="new-password"
                      :required="Boolean(formulario.contrasenha)"
                    />
                  </div>
                </div>

                <div class="d-flex justify-content-end mt-4">
                  <button class="btn btn-primary" type="submit" :disabled="guardando">
                    {{ guardando ? 'Guardando...' : 'Guardar cambios' }}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import HeaderNav from '../components/HeaderNav.vue'
import { useAuthStore } from '../stores/auth'
import { actualizarPerfil, obtenerPerfil } from '../services/perfil.service'
import type { CambiosPerfil, PerfilUsuario } from '../services/perfil.service'

const authStore = useAuthStore()
const perfil = ref<PerfilUsuario | null>(null)
const cargando = ref(true)
const guardando = ref(false)
const mensajeError = ref('')
const mensajeExito = ref('')
const mostrarFoto = ref(true)
const formulario = ref({
  Nombre: '',
  correo: '',
  telefono: '',
  contrasenha: '',
  confirmarContrasenha: '',
})

onMounted(cargarPerfil)

async function cargarPerfil() {
  mensajeError.value = ''
  try {
    perfil.value = await obtenerPerfil()
    formulario.value.Nombre = perfil.value.Nombre
    formulario.value.correo = perfil.value.correo
    formulario.value.telefono = perfil.value.telefono
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
  if (formulario.value.contrasenha) {
    datos.contrasenha = formulario.value.contrasenha
  }

  guardando.value = true
  try {
    perfil.value = await actualizarPerfil(datos)
    authStore.login({ ...authStore.user, ...perfil.value }, authStore.token)
    formulario.value.contrasenha = ''
    formulario.value.confirmarContrasenha = ''
    mensajeExito.value = 'Tus datos se actualizaron correctamente.'
  } catch (error) {
    mensajeError.value = error instanceof Error ? error.message : 'No se pudieron guardar los cambios.'
  } finally {
    guardando.value = false
  }
}
</script>
