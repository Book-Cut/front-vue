import { computed, ref } from 'vue'

export const API = (import.meta.env.VITE_API_URL ?? 'https://bookcut.api.adsocidm.com/api').replace(/\/api\/?$/, '')

// La sesión vive en localStorage para sobrevivir al recargar la página
const token = ref(localStorage.getItem('token') ?? '')
export const nombre = ref(localStorage.getItem('nombre') ?? '')
export const sesionActiva = computed(() => !!token.value)

export function guardarSesion(t: string, n = '') {
  token.value = t
  nombre.value = n
  localStorage.setItem('token', t)
  localStorage.setItem('nombre', n)
}

export function cerrarSesion() {
  token.value = ''
  nombre.value = ''
  localStorage.removeItem('token')
  localStorage.removeItem('nombre')
}

export function loginSocial(proveedor: 'google', destino: string, registro?: string) {
  sessionStorage.setItem('social_destino', destino)
  const url = new URL(`${API}/api/auth/${proveedor}/redirect`)
  url.searchParams.set('client', 'web')
  if (registro) url.searchParams.set('registration', registro)
  window.location.assign(url.toString())
}

export async function registrarConGoogle(destino: string, telefono?: string) {
  const response = await fetch(`${API}/api/auth/mobile/social/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      telefono: telefono?.trim() || null,
      terminos_aceptados: true,
    }),
  })
  const data = await response.json().catch(() => ({}))

  if (!response.ok || typeof data.registration !== 'string') {
    throw new Error(data.message ?? 'No se pudo iniciar el registro con Google.')
  }

  loginSocial('google', destino, data.registration)
}