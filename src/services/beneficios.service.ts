import { apiRequest } from "./api";

export interface Beneficio {
  ID_publicacion: number;
  titulo: string;
  Tipo_beneficio: string;
  Fecha_inicio: string;
  Fecha_fin: string;
  Usuario_idUsuario: number;
  imagen: string | null;
  imagen_url: string | null;
}

interface ApiListResponse<T> {
  data: T;
}

export async function beneficiosVigentes(): Promise<Beneficio[]> {
  const response = await apiRequest<ApiListResponse<Beneficio[]> | Beneficio[]>(
    "/beneficios-vigentes",
    {},
    { authenticated: false },
  );
  if (Array.isArray(response)) {
    return response;
  }
  if (response && Array.isArray((response as ApiListResponse<Beneficio[]>).data)) {
    return (response as ApiListResponse<Beneficio[]>).data;
  }
  return [];
}

export async function listarBeneficios(): Promise<Beneficio[]> {
  const response =
    await apiRequest<ApiListResponse<Beneficio[]> | Beneficio[]>("/beneficios");
  if (Array.isArray(response)) {
    return response;
  }
  if (response && Array.isArray((response as ApiListResponse<Beneficio[]>).data)) {
    return (response as ApiListResponse<Beneficio[]>).data;
  }
  return [];
}

export function crearBeneficio(formData: FormData) {
  return apiRequest<unknown>("/beneficios", {
    method: "POST",
    body: formData,
  });
}

export function actualizarBeneficio(id: number, formData: FormData) {
  formData.append("_method", "PUT");

  return apiRequest<unknown>(`/beneficios/${id}`, {
    method: "POST",
    body: formData,
  });
}

export function eliminarBeneficio(id: number) {
  return apiRequest<unknown>(`/beneficios/${id}`, { method: "DELETE" });
}
