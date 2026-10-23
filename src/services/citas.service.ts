import { apiRequest } from "./api";
import { normalizarValoracion } from "./valoraciones.service";
import type { Valoracion, ValoracionApi } from "./valoraciones.service";

export interface Cita {
  idCita: number;
  Fecha: string;
  FechaFin: string;
  Hora: string;
  HoraFin: string;
  CantidadServicios: number;
  HorarioServicios: string;
  barberoId: number;
  ClienteId: number | null;
  MetodoPago: string;
  serviciosIds: number[];
  duracion: number;
  Cliente: string;
  Telefono: string;
  Servicios: string;
  Barbero: string;
  Estado: string;
  EstadoPago: string;
  ModalidadPago: string;
  confirmacionPendiente: boolean;
  Total: number | null;
  ServiciosDetalle: ServicioDetalle[];
  Factura: FacturaDetalle | null;
  Beneficio: BeneficioAplicado | null;
  Valoracion: Valoracion | null;
}

export interface ServicioDetalle {
  nombre: string;
  fecha: string;
  hora: string;
  duracion: number | null;
  precio: number | null;
}

export interface NotificacionCita {
  idNotificacion: number;
  evento: "confirmacion" | "cancelacion_sin_confirmar";
  mensaje: string;
  fecha_envio: string;
  fecha_hora_cita: string;
  estado_envio: string;
  leido_at: string | null;
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
    fecha_hora_servicio?: string | null;
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
  citas?: {
    servicios?: ServicioCitaApi[];
  }[];
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

function serviciosProgramados(cita: CitaApi): (ServicioCitaApi & {
  inicioProgramado: Date;
  horaProgramada: string;
  fechaProgramada: string;
})[] {
  const [fechaCita = "", horaCita = ""] = (cita.Fecha_hora ?? "").split(/[T ]/);
  let siguiente = new Date(`${fechaCita}T${horaCita || "00:00"}:00`);
  const programados = (cita.servicios ?? []).map((servicio) => {
    const fechaHora = servicio.pivot?.fecha_hora_servicio;
    const inicio = fechaHora
      ? new Date(fechaHora.replace(" ", "T"))
      : siguiente;
    const duracion = duracionServicioCita(servicio) ?? 0;
    siguiente = new Date(inicio.getTime() + duracion * 60_000);

    return {
      ...servicio,
      inicioProgramado: inicio,
      horaProgramada: `${String(inicio.getHours()).padStart(2, "0")}:${String(inicio.getMinutes()).padStart(2, "0")}`,
      fechaProgramada: `${inicio.getFullYear()}-${String(inicio.getMonth() + 1).padStart(2, "0")}-${String(inicio.getDate()).padStart(2, "0")}`,
    };
  });

  return programados.sort((a, b) => a.inicioProgramado.getTime() - b.inicioProgramado.getTime());
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
  metodo_pago?: string | null;
  confirmacion_solicitada_at?: string | null;
  Usuario_idUsuarioCli?: number | null;
  nombre_cliente?: string | null;
  telefono_cliente?: string | null;
  valora?: ValoracionApi | null;
  cliente?: { idUsuario?: number; Nombre?: string; telefono?: string } | null;
  barbero?: { idUsuario: number; Nombre?: string } | null;
  servicios?: ServicioCitaApi[];
  factura?: FacturaApi | null;
  facturas?: FacturaApi[];
}

// Interfaz que coincide exacto con lo que valida tu CitasController en Laravel
export interface CrearCitaPayload {
  Fecha_hora: string;
  Usuario_idUsuarioBar: number;
  Usuario_idUsuarioCli?: number | null;
  nombre_cliente: string;
  telefono_cliente: string;
  es_continuo: boolean;
  servicios: {
    idServicio: number;
    fecha_hora_servicio: string | null;
  }[];
}

interface CrearCitaResponse {
  citas: CitaApi[];
}

interface DisponibilidadResponse {
  data: string[];
}

interface RespuestaNotificaciones {
  data: NotificacionCita[];
}

function normalizarCita(cita: CitaApi): Cita {
  const [fechaOriginal = "", horaOriginal = ""] = (cita.Fecha_hora ?? "").split(/[T ]/);
  const programados = serviciosProgramados(cita);
  const primerServicio = programados[0];
  const ultimoServicio = programados[programados.length - 1];
  const fecha = primerServicio?.fechaProgramada ?? fechaOriginal;
  const hora = primerServicio?.horaProgramada ?? horaOriginal.slice(0, 5);
  const finServicio = ultimoServicio
    ? new Date(ultimoServicio.inicioProgramado.getTime() + (duracionServicioCita(ultimoServicio) ?? 0) * 60_000)
    : new Date(`${fecha}T${hora || "00:00"}:00`);
  const factura = cita.factura ?? cita.facturas?.[0];
  const total = programados.reduce(
    (suma, servicio) => suma + (precioServicioCita(servicio) ?? 0),
    0,
  );
  const duracion = Math.max(0, Math.round((finServicio.getTime() - new Date(`${fecha}T${hora || "00:00"}:00`).getTime()) / 60_000));

  return {
    idCita: cita.idCita,
    Fecha: fecha,
    FechaFin: `${finServicio.getFullYear()}-${String(finServicio.getMonth() + 1).padStart(2, "0")}-${String(finServicio.getDate()).padStart(2, "0")}`,
    Hora: hora.slice(0, 5),
    HoraFin: `${String(finServicio.getHours()).padStart(2, "0")}:${String(finServicio.getMinutes()).padStart(2, "0")}`,
    CantidadServicios: programados.length,
    HorarioServicios: `${hora.slice(0, 5)}–${String(finServicio.getHours()).padStart(2, "0")}:${String(finServicio.getMinutes()).padStart(2, "0")}`,
    barberoId: cita.barbero?.idUsuario ?? 0,
    ClienteId: cita.Usuario_idUsuarioCli ?? cita.cliente?.idUsuario ?? null,
    MetodoPago: cita.metodo_pago ?? "",
    serviciosIds: programados.map((servicio) => servicio.idServicio),
    duracion,
    Cliente: cita.nombre_cliente ?? cita.cliente?.Nombre ?? "",
    Telefono: cita.telefono_cliente ?? cita.cliente?.telefono ?? "",
    Servicios: programados.map((servicio) => `${nombreServicioCita(servicio) ?? "Servicio"} · ${servicio.horaProgramada}`).join(", "),
    Barbero: cita.barbero?.Nombre ?? "",
    Estado: cita.estado ?? "",
    EstadoPago: cita.estado_pago ?? "Pendiente",
    ModalidadPago: "Presencial",
    confirmacionPendiente: cita.estado === "Pendiente" && Boolean(cita.confirmacion_solicitada_at),
    Total: total === undefined || total === null ? null : Number(total),
    ServiciosDetalle: programados.map((servicio) => ({
      nombre: nombreServicioCita(servicio) ?? "",
      fecha: servicio.fechaProgramada,
      hora: servicio.horaProgramada,
      duracion: duracionServicioCita(servicio),
      precio: precioServicioCita(servicio),
    })),
    Factura: normalizarFactura(factura),
    Beneficio: normalizarBeneficio(factura),
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

export function confirmarAsistencia(id: number) {
  return apiRequest<unknown>(`/citas/${id}/confirmar-asistencia`, {
    method: "PATCH",
  });
}

export async function confirmarCitaDesdeCorreo(claveConfirmacion: string): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(
    "/citas/confirmar-email",
    {
      method: "POST",
      body: JSON.stringify({ token: claveConfirmacion }),
    },
    { authenticated: false },
  );
}

export async function listarNotificacionesCita(): Promise<NotificacionCita[]> {
  const respuesta = await apiRequest<RespuestaNotificaciones>("/notificaciones");
  return respuesta.data;
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
export async function crearCita(data: CrearCitaPayload): Promise<CrearCitaResponse> {
  return apiRequest<CrearCitaResponse>("/citas", {
    method: "POST",
    body: JSON.stringify(data), // O usa axios/fetch dependiendo de cómo esté implementado 'apiRequest' en tu api.ts
  });
}
