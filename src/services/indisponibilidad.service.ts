import { apiRequest } from "./api";

export interface IndisponibilidadDto {
    Usuario_idUsuarioBar?: number;
    fecha: string;
    hora_inicio?: string;
    hora_fin?: string;
    motivo?: string;
}

export const registrarIndisponibilidad = (d: IndisponibilidadDto) => apiRequest<{ message: string; citas_afectadas: number }>("/indisponibilidad", {
    method: "POST",
    body: JSON.stringify(d) },
    { authenticated: true },
);