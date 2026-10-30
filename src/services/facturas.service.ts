import { apiRequest } from "./api";

export interface Factura {
  idfactura: number;
  numero_factura: string;
  fecha_emision: string;
  subtotal: number;
  total_pagar: number;
  metodo_pago: string;
  estado_factura: "Pagada" | "Anulada";
  cita?: {
    Fecha_hora?: string;
    cliente?: { Nombre?: string } | null;
    barbero?: { Nombre?: string } | null;
    servicios?: {
      Nombre?: string;
      Precio?: number | string;
      Duracion?: number | string;
      pivot?: {
        fecha_hora_servicio?: string | null;
        nombre_servicio?: string | null;
        precio_servicio?: number | string | null;
        duracion_servicio?: number | string | null;
      };
    }[];
  } | null;
  Citas?: {
    Fecha_hora?: string;
    cliente?: { Nombre?: string } | null;
    barbero?: { Nombre?: string } | null;
    servicios?: {
      Nombre?: string;
      Precio?: number | string;
      Duracion?: number | string;
      pivot?: {
        fecha_hora_servicio?: string | null;
        nombre_servicio?: string | null;
        precio_servicio?: number | string | null;
        duracion_servicio?: number | string | null;
      };
    }[];
  }[];
}

export interface FiltrosEstadisticas {
  mes?: string;
  desde?: string;
  hasta?: string;
}

export interface Estadisticas {
  gananciaTotal: number;
  Citas: {
    Finalizado: number;
    Cancelado: number;
    Pendiente: number;
    Confirmado: number;
  };
}

export function listarFacturas(): Promise<Factura[]> {
  return apiRequest<Factura[]>("/facturas");
}

export function consultarEstadisticas(
  filtros: FiltrosEstadisticas,
): Promise<Estadisticas> {
  const params = new URLSearchParams();
  if (filtros.mes) {
    params.set("mes", filtros.mes);
  } else {
    if (filtros.desde) params.set("desde", filtros.desde);
    if (filtros.hasta) params.set("hasta", filtros.hasta);
  }

  return apiRequest<Estadisticas>(`/admin/estadisticas?${params}`);
}
