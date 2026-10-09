import { computed, ref } from 'vue'

export const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

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

export function loginSocial(proveedor: 'google' | 'facebook', destino: string) {
  sessionStorage.setItem('destino', destino) // para volver aquí tras el login
  window.location.href = `${API}/api/auth/${proveedor}/redirect`
}