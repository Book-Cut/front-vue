import { apiRequest } from "./api";

export interface LoginResponse {
  user: Record<string, unknown> & { Nombre: string; Roles_IDRol: number };
  token: string;
}

export function canjearCodigoSocial(code: string) {
  return apiRequest<LoginResponse>(
    "/auth/mobile/exchange",
    {
      method: "POST",
      body: JSON.stringify({ code }),
    },
    { authenticated: false },
  );
}

export function completarRegistroGoogle(
  signupToken: string,
  telefono: string | null,
) {
  return apiRequest<{ result: string; code: string }>(
    "/auth/google/complete-registration",
    {
      method: "POST",
      body: JSON.stringify({
        signup_token: signupToken,
        telefono,
        terminos_aceptados: true,
      }),
    },
    { authenticated: false },
  );
}

export function login(correo: string, contrasenha: string) {
  return apiRequest<LoginResponse>(
    "/login",
    {
      method: "POST",
      body: JSON.stringify({ correo, contrasenha }),
    },
    { authenticated: false },
  );
}

export function solicitarRecuperacionContrasenha(correo: string) {
  return apiRequest<{ message: string }>(
    "/forgot-password",
    {
      method: "POST",
      body: JSON.stringify({ correo }),
    },
    { authenticated: false },
  );
}

export function cambiarContrasenha(
  correo: string,
  token: string,
  contrasenha: string,
  confirmarContrasenha: string,
) {
  return apiRequest<{ message: string }>("/reset-password", {
    method: "POST",
    body: JSON.stringify({
      correo,
      token,
      contrasenha,
      contrasenha_confirmation: confirmarContrasenha,
    }),
  }, { authenticated: false });
}
