import { apiRequest } from "./api";

export interface Valoracion {
  idValora: number;
  puntuacion: number;
  comentario: string | null;
  fecha: string;
}

// Valoración tal como la devuelve el backend dentro de una cita (tabla valora).
export interface ValoracionApi {
  Idvalora: number;
  EvaluacionBar: number | string;
  Comentario?: string | null;
  Fecha_evaluacion_cita?: string | null;
}

export function normalizarValoracion(valora: ValoracionApi): Valoracion {
  return {
    idValora: valora.Idvalora,
    puntuacion: Number(valora.EvaluacionBar),
    comentario: valora.Comentario ?? null,
    fecha: (valora.Fecha_evaluacion_cita ?? "").split(/[T ]/)[0] ?? "",
  };
}

export interface CalificarCitaPayload {
  puntuacion: number;
  comentario?: string;
}

interface CalificarCitaResponse {
  message: string;
  data: {
    idValora: number;
    puntuacion: number;
    comentario: string | null;
    fecha_valoracion: string;
  };
}

export async function calificarCita(
  idCita: number,
  payload: CalificarCitaPayload,
): Promise<Valoracion> {
  const response = await apiRequest<CalificarCitaResponse>(
    `/citas/${idCita}/valoracion`,
    { method: "POST", body: JSON.stringify(payload) },
  );

  return {
    idValora: response.data.idValora,
    puntuacion: response.data.puntuacion,
    comentario: response.data.comentario,
    fecha: (response.data.fecha_valoracion ?? "").split(/[T ]/)[0] ?? "",
  };
}

// Valoración recibida, tal como la ve el barbero (o el administrador).
export interface ValoracionRecibida {
  idValora: number;
  idCita: number;
  puntuacion: number;
  comentario: string | null;
  Fecha: string;
  Cliente: string;
  Barbero: string;
  Servicios: string;
}

export interface ResumenValoraciones {
  total: number;
  promedio: number | null;
}

interface ValoracionesResponse {
  data: {
    idValora: number;
    idCita: number;
    puntuacion: number;
    comentario: string | null;
    fecha_valoracion: string | null;
    Fecha_hora: string;
    Cliente: string | null;
    Barbero: string | null;
    Servicios: string;
  }[];
  resumen: { total: number; promedio: number | null };
}

export async function listarValoracionesRecibidas(): Promise<{
  valoraciones: ValoracionRecibida[];
  resumen: ResumenValoraciones;
}> {
  const response = await apiRequest<ValoracionesResponse>("/valoraciones");

  return {
    valoraciones: response.data.map((item) => ({
      idValora: item.idValora,
      idCita: item.idCita,
      puntuacion: item.puntuacion,
      comentario: item.comentario,
      Fecha: (item.Fecha_hora ?? "").split(/[T ]/)[0] ?? "",
      Cliente: item.Cliente ?? "",
      Barbero: item.Barbero ?? "",
      Servicios: item.Servicios ?? "",
    })),
    resumen: response.resumen,
  };
}