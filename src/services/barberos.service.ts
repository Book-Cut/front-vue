import { apiRequest } from "./api";

export interface Barbero {
  idUsuario: number;
  Nombre: string;
  especialidad?: string | null;
  foto_perfil: string | null;
}

interface ApiListResponse<T> {
  data: T;
}

export async function listarBarberos(): Promise<Barbero[]> {
  const response = await apiRequest<ApiListResponse<Barbero[]> | Barbero[]>("/barberos");
  if (Array.isArray(response)) {
    return response;
  }
  if (response && Array.isArray((response as ApiListResponse<Barbero[]>).data)) {
    return (response as ApiListResponse<Barbero[]>).data;
  }
  return [];
}
