import { apiRequest } from './api'

export interface LoginResponse {
    user: Record<string, unknown>
    token: string
}

export async function login(correo: string, contrasenha: string) {
    const payloads = [
        { correo, contrasenha, password: contrasenha },
        { correo, password: contrasenha },
    ]
    const routes = ['/login', '/api/login']
    let lastError: unknown = null

    for (const route of routes) {
        for (const payload of payloads) {
            try {
                return await apiRequest<LoginResponse>(route, {
                    method: 'POST',
                    body: JSON.stringify(payload),
                })
            } catch (error) {
                lastError = error
                const message = error instanceof Error ? error.message : String(error)
                if (message.includes('404') || message.includes('No se encontró') || message.includes('could not be found')) {
                    continue
                }
                throw error
            }
        }
    }

    throw new Error(lastError instanceof Error ? lastError.message : 'No se pudo iniciar sesión')
}
