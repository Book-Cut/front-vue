import { apiRequest } from "./api";
import { normalizarValoracion } from "./valoraciones.service";
import type { Valoracion, ValoracionApi } from "./valoraciones.service";

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
  ServiciosDetalle: ServicioDetalle[];
  Factura: FacturaDetalle | null;
  Beneficio: BeneficioAplicado | null;
  Valoracion: Valoracion | null;
}

export interface ServicioDetalle {
  nombre: string;
  duracion: number | null;
  precio: number | null;
}

export interface FacturaDetalle {
  numero: string;
  fecha: string;
  subtotal: number;
  total: number;
  metodoPago: string;
  estado: string;
}

// Beneficio aplicado a la factura. Por ahora el backend no lo asigna: queda
// listo para cuando se defina cómo se obtienen los beneficios.
export interface BeneficioAplicado {
  titulo: string;
  tipo: string | null;
}

// Servicio asociado a una cita. El backend guarda una copia (snapshot) de
// nombre, duración y precio al agendar, de modo que editar luego el servicio
// en el catálogo no altere las citas ya registradas.
interface ServicioCitaApi {
  idServicio: number;
  Nombre?: string; // valor "vivo" del catálogo (solo como respaldo)
  Duracion?: number | string | null;
  Precio?: number | string | null;
  nombre_servicio?: string | null;
  precio_servicio?: number | string | null;
  duracion_servicio?: number | string | null;
  pivot?: {
    nombre_servicio?: string | null;
    precio_servicio?: number | string | null;
    duracion_servicio?: number | string | null;
  } | null;
}

interface FacturaApi {
  numero_factura?: string;
  fecha_emision?: string;
  subtotal?: number | string;
  total_pagar?: number | string;
  metodo_pago?: string;
  estado_factura?: string;
  beneficio?: { titulo?: string; Tipo_beneficio?: string | null } | null;
}

// Prioriza siempre el dato congelado en la cita sobre el del catálogo.
function nombreServicioCita(s: ServicioCitaApi): string | undefined {
  return (
    s.pivot?.nombre_servicio ?? s.nombre_servicio ?? s.Nombre ?? undefined
  ) || undefined;
}

function aNumeroONulo(valor: number | string | null | undefined): number | null {
  return valor === undefined || valor === null ? null : Number(valor);
}

function duracionServicioCita(s: ServicioCitaApi): number | null {
  return aNumeroONulo(s.pivot?.duracion_servicio ?? s.duracion_servicio ?? s.Duracion);
}

function precioServicioCita(s: ServicioCitaApi): number | null {
  return aNumeroONulo(s.pivot?.precio_servicio ?? s.precio_servicio ?? s.Precio);
}

function normalizarFactura(factura: FacturaApi | null | undefined): FacturaDetalle | null {
  if (!factura) return null;

  return {
    numero: factura.numero_factura ?? "",
    fecha: (factura.fecha_emision ?? "").split(/[T ]/)[0] ?? "",
    subtotal: Number(factura.subtotal ?? 0),
    total: Number(factura.total_pagar ?? 0),
    metodoPago: factura.metodo_pago ?? "",
    estado: factura.estado_factura ?? "",
  };
}

function normalizarBeneficio(factura: FacturaApi | null | undefined): BeneficioAplicado | null {
  if (!factura?.beneficio?.titulo) return null;

  return { titulo: factura.beneficio.titulo, tipo: factura.beneficio.Tipo_beneficio ?? null };
}

interface CitaApi {
  idCita: number;
  Fecha_hora: string;
  estado: string;
  estado_pago: string;
  modalidad_pago: string;
  nombre_cliente?: string | null;
  telefono_cliente?: string | null;
  valora?: ValoracionApi | null;
  cliente?: { Nombre?: string; telefono?: string } | null;
  barbero?: { idUsuario: number; Nombre?: string } | null;
  servicios?: ServicioCitaApi[];
  factura?: FacturaApi | null;
}

// Interfaz que coincide exacto con lo que valida tu CitasController en Laravel
export interface CrearCitaPayload {
  Fecha_hora: string;
  Usuario_idUsuarioBar: number;
  Usuario_idUsuarioCli?: number | null;
  nombre_cliente: string;
  telefono_cliente: string;
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
    ?? (cita.servicios ?? []).reduce((suma, servicio) => suma + (precioServicioCita(servicio) ?? 0), 0);

  return {
    idCita: cita.idCita,
    Fecha: fecha,
    Hora: hora.slice(0, 5),
    barberoId: cita.barbero?.idUsuario ?? 0,
    serviciosIds: (cita.servicios ?? []).map((servicio) => servicio.idServicio),
    duracion: (cita.servicios ?? []).reduce(
      (total, servicio) => total + (duracionServicioCita(servicio) ?? 0),
      0,
    ),
    Cliente: cita.nombre_cliente ?? cita.cliente?.Nombre ?? "",
    Telefono: cita.telefono_cliente ?? cita.cliente?.telefono ?? "",
    Servicios: (cita.servicios ?? [])
      .map(nombreServicioCita)
      .filter(Boolean)
      .join(", "),
    Barbero: cita.barbero?.Nombre ?? "",
    Estado: cita.estado ?? "",
    EstadoPago: cita.estado_pago ?? "Pendiente",
    ModalidadPago: cita.modalidad_pago ?? "Presencial",
    Total: total === undefined || total === null ? null : Number(total),
    ServiciosDetalle: (cita.servicios ?? []).map((servicio) => ({
      nombre: nombreServicioCita(servicio) ?? "",
      duracion: duracionServicioCita(servicio),
      precio: precioServicioCita(servicio),
    })),
    Factura: normalizarFactura(cita.factura),
    Beneficio: normalizarBeneficio(cita.factura),
    Valoracion: cita.valora ? normalizarValoracion(cita.valora) : null,
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
