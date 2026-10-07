const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:3000').replace(/\/+$/, '')

interface ApiRequestConfig {
    authenticated?: boolean
}

export async function apiRequest<T>(
    path: string,
    options: RequestInit = {},
    config: ApiRequestConfig = {},
): Promise<T> {
    const headers = new Headers(options.headers)
    const token = localStorage.getItem('token')

    if (!headers.has('Accept')) {
        headers.set('Accept', 'application/json')
    }
    if (options.body && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json')
    }
    if (config.authenticated !== false && token) {
        headers.set('Authorization', ['Bearer', token].join(' '))
    }

    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers,
    })
    const data = await response.json() as T & { message?: string }

    if (!response.ok) {
        throw new Error(data.message ?? `Error de API (${response.status})`)
    }

    return data
}
