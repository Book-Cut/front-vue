<script setup lang="ts">
import { ref } from 'vue'
import { API, guardarSesion, loginSocial } from '../auth'


const props = defineProps<{ destino: string }>()
const emit = defineEmits<{ ok: [] }>()

const paso = ref<'correo' | 'codigo'>('correo')
const correo = ref('')
const codigo = ref('')
const cargando = ref(false)
const error = ref('')

async function post(ruta: string, body: object) {
  const res = await fetch(`${API}/api/auth/${ruta}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message ?? 'Ocurrió un error')
  return data
}

async function enviarCodigo() {
  error.value = ''
  cargando.value = true
  try {
    await post('codigo', { correo: correo.value.trim() })
    paso.value = 'codigo'
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Error de conexión'
  } finally {
    cargando.value = false
  }
}

async function verificar() {
  error.value = ''
  cargando.value = true
  try {
    const data = await post('verificar', { correo: correo.value.trim(), codigo: codigo.value })
    guardarSesion(data.token, data.user.Nombre)
    emit('ok')
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Error de conexión'
  } finally {
    cargando.value = false
  }
}

const social = (p: 'google' | 'facebook') => loginSocial(p, props.destino)

</script>

<template>
  <div v-if="error" class="alert alert-danger py-2 small">{{ error }}</div>

  <!-- Paso 1: correo + redes sociales -->
  <div v-if="paso === 'correo'">
    <form @submit.prevent="enviarCodigo">
      <div class="form-floating mb-3">
        <input id="correo" v-model="correo" type="email" class="form-control" placeholder="Correo" required />
        <label for="correo">Correo</label>
      </div>
      <button class="btn btn-primary w-100" :disabled="cargando || !correo">
        {{ cargando ? 'Enviando...' : 'Continuar' }}
      </button>
    </form>

    <div class="d-flex align-items-center my-3">
      <hr class="flex-grow-1" />
      <span class="mx-2 text-secondary small">o</span>
      <hr class="flex-grow-1" />
    </div>

    <button type="button" class="btn btn-outline-dark w-100 mb-2" @click="social('google')">
      <i class="bi bi-google text-danger me-2"></i>Continuar con Google
    </button>
    <button type="button" class="btn btn-outline-dark w-100" @click="social('facebook')">
      <i class="bi bi-facebook text-primary me-2"></i>Continuar con Facebook
    </button>
  </div>

  <!-- Paso 2: código recibido por correo -->
  <div v-else>
    <p class="text-center text-secondary">
      Enviamos un código de 6 dígitos a <strong>{{ correo }}</strong>
    </p>
    <form @submit.prevent="verificar">
      <input
        v-model="codigo"
        type="text"
        inputmode="numeric"
        maxlength="6"
        autocomplete="one-time-code"
        class="form-control form-control-lg text-center mb-3"
        placeholder="000000"
      />
      <button class="btn btn-primary w-100 mb-2" :disabled="cargando || codigo.length !== 6">
        {{ cargando ? 'Verificando...' : 'Continuar' }}
      </button>
    </form>
    <button type="button" class="btn btn-outline-secondary w-100 mb-2" @click="paso = 'correo'; codigo = ''; error = ''">
      <i class="bi bi-chevron-left"></i> Atrás
    </button>
    <button type="button" class="btn btn-link w-100" :disabled="cargando" @click="enviarCodigo">Reenviar código</button>
  </div>
</template>
