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
    "/registro/send-code",
    { method: "POST", body: JSON.stringify(payload)},
    { authenticated: false },
  );
}

export function verificarCodigoRegistro(correo: string, codigo: string) {
  return apiRequest<{
    token: string;
    user: { idUsuario: number; Nombre: string; correo: string};
  }>(
    "/registro/verify",
    { method: "POST", body: JSON.stringify({correo, codigo}) },
    { authenticated: false },
  );
}
