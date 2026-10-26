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
  const response = await apiRequest<ApiListResponse<Barbero[]>>("/barberos");
  return response.data;
}
