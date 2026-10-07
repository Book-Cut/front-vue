import { apiRequest } from './api'

export interface Servicio {
    idServicio: number
    Nombre: string
    Duracion: number
    Precio: number
}

interface ApiListResponse<T> {
    data: T
}

export type ServicioPayload = Pick<Servicio, 'Nombre' | 'Duracion' | 'Precio'>

export async function listarServicios() {
    const response = await apiRequest<ApiListResponse<Servicio[]>>('/servicios')
    return response.data
}

export function crearServicio(payload: ServicioPayload) {
    return apiRequest<unknown>('/servicios', {
        method: 'POST',
        body: JSON.stringify(payload),
    })
}

export function actualizarServicio(id: number, payload: ServicioPayload) {
    return apiRequest<unknown>(`/servicios/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
    })
}

export function eliminarServicio(id: number) {
    return apiRequest<unknown>(`/servicios/${id}`, { method: 'DELETE' })
}
