<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { RegistroForm } from '../types/registro'
import { registrarUsuario } from '../services/registro.service'

const router = useRouter()

const campos = [
  { key: 'nombre', label: 'Nombre Completo', type: 'text', icon: 'bi-person-fill' },
  { key: 'correo', label: 'Correo Electronico', type: 'email', icon: 'bi-envelope-fill' },
  { key: 'telefono', label: 'Teléfono', type: 'tel', icon: 'bi-telephone-fill' },
  { key: 'password', label: 'Contraseña', type: 'password', icon: 'bi-lock-fill' },
  { key: 'confirmar', label: 'Confirmar Contraseña', type: 'password', icon: 'bi-lock-fill' },
] as const

const form = reactive<RegistroForm>({ nombre: '', correo: '', telefono: '', password: '', confirmar: '' })
const errores = reactive<Partial<Record<keyof RegistroForm, string>>>({})
const cargando = ref(false)
const mensaje = ref('')
const exito = ref(false)
const verTerminos = ref(false)

function validar() {
  ;(Object.keys(errores) as (keyof RegistroForm)[]).forEach((k) => delete errores[k])
  if (!form.nombre.trim()) errores.nombre = 'Ingresa tu nombre'
  if (!/^\S+@\S+\.\S+$/.test(form.correo)) errores.correo = 'Correo inválido'
  if (!/^\d{7,15}$/.test(form.telefono)) errores.telefono = 'Teléfono inválido (solo números)'
  if (form.password.length < 8) errores.password = 'Mínimo 8 caracteres'
  if (form.confirmar !== form.password) errores.confirmar = 'Las contraseñas no coinciden'
  return Object.keys(errores).length === 0
}

async function registrar() {
  mensaje.value = ''
  if (!validar()) return
  cargando.value = true
  try {
    await registrarUsuario({
      nombre: form.nombre.trim(),
      correo: form.correo.trim(),
      telefono: form.telefono,
      password: form.password,
    })
    exito.value = true
    mensaje.value = 'Registro exitoso'
  } catch (e) {
    exito.value = false
    mensaje.value = e instanceof Error ? e.message : 'Error de conexión'
  } finally {
    cargando.value = false
  }
}
</script>

<template>
  <div class="row g-0 min-vh-100">
    <div class="col-12 col-lg-5 bg-body-secondary d-flex flex-column justify-content-center p-4">
      <img src="/logo.png" alt="Book&Cut" class="img-fluid w-50 mx-auto mb-2" />
      <h2 class="text-center fw-semibold mb-4">Registrarse</h2>

      <form novalidate @submit.prevent="registrar">
        <div v-for="c in campos" :key="c.key" class="mb-3">
          <div class="position-relative">
            <input
              v-model="form[c.key]"
              :type="c.type"
              :placeholder="c.label"
              class="form-control border-dark pe-5"
              :class="{ 'is-invalid': errores[c.key] }"
            />
            <i :class="['bi', c.icon, 'position-absolute top-50 end-0 translate-middle-y me-3 text-secondary']"></i>
          </div>
          <div v-if="errores[c.key]" class="text-danger small">{{ errores[c.key] }}</div>
        </div>

        <button type="button" class="btn btn-outline-dark mt-2" @click="verTerminos = true">
          Ver Términos y Condiciones
        </button>
        <p class="small mt-2">al registrarte, aceptas los terminos y condiciones</p>

        <button type="submit" class="btn btn-outline-dark w-100 fw-bold" :disabled="cargando">
          {{ cargando ? 'Registrando...' : 'Registrarse' }}
        </button>

        <div v-if="mensaje" class="small mt-2" :class="exito ? 'text-success' : 'text-danger'">
          {{ mensaje }}
        </div>

        <button type="button" class="btn btn-outline-dark btn-sm mt-3" @click="router.back()">atras</button>
      </form>
    </div>

    <div class="col-lg-7 d-none d-lg-block position-relative">
      <img src="/barberia.png" alt="" class="position-absolute top-0 start-0 w-100 h-100 object-fit-cover" />
    </div>
  </div>

  <div v-if="verTerminos" class="modal d-block bg-dark bg-opacity-75" tabindex="-1" @click.self="verTerminos = false">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Términos y Condiciones</h5>
          <button type="button" class="btn-close" aria-label="Cerrar" @click="verTerminos = false"></button>
        </div>
        <div class="modal-body small">
          ACEPTA ESTOS TERMINOS Y CONDICIONES O TU ALMA SERA VENDIDA A BELCEBU
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-dark btn-sm" @click="verTerminos = false">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>
