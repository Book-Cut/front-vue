import { apiRequest } from './api'

export interface RegistroPayload {
    nombre: string
    correo: string
    telefono: string
    password: string
}

export function registrarUsuario(payload: RegistroPayload) {
    return apiRequest<unknown>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
    })
}
