import { apiRequest } from "./api";

export interface RegistroPayload {
  Nombre: string;
  correo: string;
  telefono: string;
  contrasenha: string;
}

export interface AuthResponse {
  token: string;
  user: { idUsuario: number; Nombre: string; correo: string };
}

export function registrarUsuario(payload: RegistroPayload) {
  return apiRequest<AuthResponse>(
    "/api/register",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    { authenticated: false },
  );
}
