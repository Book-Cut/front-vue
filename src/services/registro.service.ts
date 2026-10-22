import { apiRequest } from "./api";

export interface RegistroPayload {
  Nombre: string;
  correo: string;
  telefono: string;
  contrasenha: string;
  terminos_aceptados: boolean;
}

export function enviarCodigoRegistro(payload: RegistroPayload) {
  return apiRequest<unknown>(
    "/register/send-code",
    { method: "POST", body: JSON.stringify(payload)},
    { authenticated: false },
  );
}

export function verificarCodigoRegistro(correo: string, codigo: string) {
  return apiRequest<{
    token: string;
    user: { idUsuario: number; Nombre: string; correo: string};
  }>(
    "/register/verify",
    { method: "POST", body: JSON.stringify({correo, codigo}) },
    { authenticated: false },
  );
}
