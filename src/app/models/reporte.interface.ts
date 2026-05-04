export interface ReporteFiltros {
	tipo_activo_id?: number | null;
	usuario_id?: number | null;
	ubicacion_id?: number | null;
	proveedor_id?: number | null;
	fecha_inicio?: string | null;
	fecha_fin?: string | null;
}

export interface GenerarReporteRequest {
	tipo_id: number;
	filtros: ReporteFiltros;
}

export interface ReporteResponse {
	success?: boolean;
	message?: string;
	tipo_reporte?: string;
	descripcion?: string;
	filtros?: {
		tipo_activo: string;
		usuario: string;
		ubicacion: string;
		proveedor: string;
		fecha_inicio: string | null;
		fecha_fin: string | null;
	};
	resultados?: {
		resumen: Record<string, number>;
		detalles: Record<string, string | number>[];
	};
	error?: string;
}

export interface TiposReporteResponse {
	success?: boolean;
	tiposReporte?: TipoReporte[];
	error?: string;
}

export interface TipoReporte {
	id: number;
	nombre: string;
	descripcion: string;
	activo: boolean;
}

export interface DatosAuxiliaresResponse {
	tiposActivo?: { id: number; nombre: string }[];
	usuarios?: { id: number; nombre: string }[];
	ubicaciones?: { id: number; nombre: string }[];
	proveedores?: { id: number; nombre: string }[];
}
