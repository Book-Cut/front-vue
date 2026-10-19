import { apiRequest } from './api'

export interface PerfilUsuario {
    idUsuario: number
    Nombre: string
    correo: string
    telefono: string
    foto_perfil: string | null
    servicio_id: number | null
    horarios: HorarioPerfil[]
}

export interface HorarioPerfil {
    diasemana: string
    horainicio: string
    horafin: string
}

interface RespuestaPerfil {
    data: PerfilUsuario
}

export interface CambiosPerfil {
    Nombre: string
    correo: string
    telefono: string
    contrasenha?: string
    servicio_id?: number | null
    horarios?: HorarioPerfil[]
}

export async function obtenerPerfil(): Promise<PerfilUsuario> {
    const respuesta = await apiRequest<RespuestaPerfil>('/perfil')
    return respuesta.data
}

export async function actualizarPerfil(datos: CambiosPerfil): Promise<PerfilUsuario> {
    const respuesta = await apiRequest<RespuestaPerfil>('/perfil', {
        method: 'PATCH',
        body: JSON.stringify(datos),
    })
    return respuesta.data
}
