export interface DashboardResumen {
	data: {
		total_activos: number;
		activos_asignados: number;
		activos_disponibles: number;
		activos_en_mantenimiento: number;
		activos_dados_de_baja: number;
		tendencia_mensual?: {
			labels: string[];
			data: number[];
		};
		ano_tendencia?: number;
	};
}

export interface DashboardAlertasResponse {
	data: {
		licencias_proximas_a_vencer: number;
		garantias_proximas_a_expirar: number;
		activos_en_mantenimiento: number;
		activos_proximos_a_devolver: number;
	};
}

export interface AlertaResponse {
	readonly id: number;
	titulo: string;
	mensaje: string;
	tipo: "info" | "warning" | "error" | "success";
	readonly fecha: string;
	leida: boolean;
}
