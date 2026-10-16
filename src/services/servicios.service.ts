import { apiRequest } from "./api";

export interface Servicio {
  idServicio: number;
  Nombre: string;
  Duracion: number;
  Precio: number;
}

interface ApiListResponse<T> {
  data: T;
}

export type ServicioPayload = Pick<Servicio, "Nombre" | "Duracion" | "Precio">;

export async function listarServicios(
  options: { authenticated?: boolean } = {},
) {
  const response = await apiRequest<ApiListResponse<Servicio[]>>(
    "/api/servicios",
    {},
    options,
  );

  return response.data;
}

export function crearServicio(payload: ServicioPayload) {
  return apiRequest<unknown>("/api/servicios", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function actualizarServicio(id: number, payload: ServicioPayload) {
  return apiRequest<unknown>(`/api/servicios/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function eliminarServicio(id: number) {
  return apiRequest<unknown>(`/api/servicios/${id}`, { method: "DELETE" });
}
