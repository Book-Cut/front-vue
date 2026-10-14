import { apiRequest } from './api'

export interface Barbero {
    idUsuario: number
    Nombre: string
}

interface ApiListResponse<T> {
    data: T
}

export async function listarBarberos(): Promise<Barbero[]> {
    const response = await apiRequest<ApiListResponse<Barbero[]>>('/barberos')
    return response.data
}
