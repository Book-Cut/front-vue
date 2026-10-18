import { apiRequest } from "./api";

export interface Cita {
  idCita: number;
  Fecha: string;
  Hora: string;
  barberoId: number;
  serviciosIds: number[];
  duracion: number;
  Cliente: string;
  Telefono: string;
  Servicios: string;
  Barbero: string;
  Estado: string;
  EstadoPago: string;
  ModalidadPago: string;
  Total: number | null;
}

interface CitaApi {
  idCita: number;
  Fecha_hora: string;
  estado: string;
  estado_pago: string;
  modalidad_pago: string;
  cliente?: { Nombre?: string; telefono?: string } | null;
  barbero?: { idUsuario: number; Nombre?: string } | null;
  servicios?: { idServicio: number; Nombre?: string; Duracion?: number; Precio?: number | string }[];
  factura?: { total_pagar?: number | string } | null;
}

// Interfaz que coincide exacto con lo que valida tu CitasController en Laravel
export interface CrearCitaPayload {
  Fecha_hora: string;
  Usuario_idUsuarioBar: number;
  Usuario_idUsuarioCli?: number | null;
  es_continuo: boolean;
  modalidad_pago: "En línea" | "Presencial";
  metodo_pago?: "Efectivo" | "Nequi" | "Tarjeta" | "Transferencia";
  servicios: {
    idServicio: number;
    fecha_hora_servicio: string | null;
  }[];
}

interface DisponibilidadResponse {
  data: string[];
}

function normalizarCita(cita: CitaApi): Cita {
  const [fecha = "", hora = ""] = (cita.Fecha_hora ?? "").split(/[T ]/);
  const total = cita.factura?.total_pagar
    ?? (cita.servicios ?? []).reduce((suma, servicio) => suma + Number(servicio.Precio ?? 0), 0);

  return {
    idCita: cita.idCita,
    Fecha: fecha,
    Hora: hora.slice(0, 5),
    barberoId: cita.barbero?.idUsuario ?? 0,
    serviciosIds: (cita.servicios ?? []).map((servicio) => servicio.idServicio),
    duracion: (cita.servicios ?? []).reduce(
      (total, servicio) => total + Number(servicio.Duracion ?? 0),
      0,
    ),
    Cliente: cita.cliente?.Nombre ?? "",
    Telefono: cita.cliente?.telefono ?? "",
    Servicios: (cita.servicios ?? [])
      .map((s) => s.Nombre)
      .filter(Boolean)
      .join(", "),
    Barbero: cita.barbero?.Nombre ?? "",
    Estado: cita.estado ?? "",
    EstadoPago: cita.estado_pago ?? "Pendiente",
    ModalidadPago: cita.modalidad_pago ?? "Presencial",
    Total: total === undefined || total === null ? null : Number(total),
  };
}

export async function listarCitas(): Promise<Cita[]> {
  const response = await apiRequest<CitaApi[]>("/citas");
  return response.map(normalizarCita);
}

export function cancelarCita(id: number) {
  return apiRequest<unknown>(`/citas/${id}`, { method: "DELETE" });
}

export function finalizarCita(id: number) {
  return apiRequest<unknown>(`/citas/${id}/finalizar`, { method: "PATCH" });
}

export function pagarCita(id: number, metodoPago: string) {
  return apiRequest<unknown>(`/citas/${id}/pago`, {
    method: "POST",
    body: JSON.stringify({ metodo_pago: metodoPago }),
  });
}

export function reagendarCita(id: number, fecha: string, hora: string) {
  return apiRequest<unknown>(`/citas/${id}/reagendar`, {
    method: "PATCH",
    body: JSON.stringify({ fecha, hora }),
  });
}

export async function listarHorasDisponibles(
  barberoId: number,
  fecha: string,
  duracion: number,
  citaId?: number,
): Promise<string[]> {
  const params = new URLSearchParams({
    barbero_id: String(barberoId),
    fecha,
    duracion: String(duracion),
  });
  if (citaId !== undefined) {
    params.set("cita_id", String(citaId));
  }
  const response = await apiRequest<DisponibilidadResponse>(
    `/disponibilidad?${params}`,
  );
  return response.data;
}

// NUEVA FUNCIÓN PARA GUARDAR CITA EN EL BACKEND
export async function crearCita(data: CrearCitaPayload): Promise<CitaApi> {
  // Ajusta según cómo maneje respuestas tu helper apiRequest (si devuelve directamente el JSON o envuelto)
  return await apiRequest<CitaApi>("/citas", {
    method: "POST",
    body: JSON.stringify(data), // O usa axios/fetch dependiendo de cómo esté implementado 'apiRequest' en tu api.ts
  });
}
