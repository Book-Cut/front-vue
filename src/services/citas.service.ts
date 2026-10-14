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

// Interfaz que coincide exacto con lo que valida tu CitasController en Laravel
export interface CrearCitaPayload {
    Fecha_hora: string
    Usuario_idUsuarioBar: number
    Usuario_idUsuarioCli?: number | null
    es_continuo: boolean
    metodo_pago: string
    servicios: {
        idServicio: number
        fecha_hora_servicio: string | null
    }[]
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

// NUEVA FUNCIÓN PARA GUARDAR CITA EN EL BACKEND
export async function crearCita(data: CrearCitaPayload): Promise<CitaApi> {
    // Ajusta según cómo maneje respuestas tu helper apiRequest (si devuelve directamente el JSON o envuelto)
    return await apiRequest<CitaApi>('/citas', {
        method: 'POST',
        body: JSON.stringify(data) // O usa axios/fetch dependiendo de cómo esté implementado 'apiRequest' en tu api.ts
    })
}