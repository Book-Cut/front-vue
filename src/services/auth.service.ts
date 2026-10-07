import { apiRequest } from './api'

export interface LoginResponse {
    user: Record<string, unknown>
    token: string
}

export function login(correo: string, contrasenha: string) {
    return apiRequest<LoginResponse>('/login', {
        method: 'POST',
        body: JSON.stringify({ correo, contrasenha }),
    })
}
