import { apiRequest } from './api'

export interface Cita {
    idCita: number
    Fecha: string
    Hora: string
    Cliente: string
    Telefono: string
    Servicios: string
    Barbero: string
    Estado: string
    Total: number | null
}

interface CitaApi {
    idCita: number
    Fecha_hora: string
    estado: string
    cliente?: { Nombre?: string; telefono?: string } | null
    barbero?: { Nombre?: string } | null
    servicios?: { Nombre?: string }[]
    factura?: { total_pagar?: number | string } | null
}

function normalizarCita(cita: CitaApi): Cita {
    const [fecha = '', hora = ''] = (cita.Fecha_hora ?? '').split(/[T ]/)
    const total = cita.factura?.total_pagar

    return {
        idCita: cita.idCita,
        Fecha: fecha,
        Hora: hora.slice(0, 5),
        Cliente: cita.cliente?.Nombre ?? '',
        Telefono: cita.cliente?.telefono ?? '',
        Servicios: (cita.servicios ?? []).map((s) => s.Nombre).filter(Boolean).join(', '),
        Barbero: cita.barbero?.Nombre ?? '',
        Estado: cita.estado ?? '',
        Total: total === undefined || total === null ? null : Number(total),
    }
}

export async function listarCitas(): Promise<Cita[]> {
    const response = await apiRequest<CitaApi[]>('/citas')
    return response.map(normalizarCita)
}