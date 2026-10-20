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

export async function beneficiosVigentes() {
  const response = await apiRequest<ApiListResponse<Beneficio[]>>(
    "/beneficios-vigentes",
    {},
    { authenticated: false },
  );
  return response.data;
}

export async function listarBeneficios() {
  const response =
    await apiRequest<ApiListResponse<Beneficio[]>>("/beneficios");
  return response.data;
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
