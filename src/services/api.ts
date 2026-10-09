const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:3000').replace(/\/+$/, '')

interface ApiRequestConfig {
    authenticated?: boolean
}

function parseApiResponse<T>(response: Response): Promise<T & { message?: string } | { message: string }> {
    const contentType = response.headers.get('content-type') ?? ''
    if (contentType.includes('application/json')) {
        return response.json() as Promise<T & { message?: string }>
    }

    return response.text().then((text) => ({
        message: text || `Error de API (${response.status})`,
    })) as Promise<T & { message?: string }>
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
    const data = await parseApiResponse<T>(response)

    if (!response.ok) {
        throw new Error((data as { message?: string }).message ?? `Error de API (${response.status})`)
    }

    return data as T
}
