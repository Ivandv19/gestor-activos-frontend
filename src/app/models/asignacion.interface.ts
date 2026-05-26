export interface AsignacionPayload {
	activo_id?: number;
	usuario_id?: number;
	ubicacion_id?: number;
	fecha_asignacion?: string;
	fecha_devolucion?: string | null;
	comentarios?: string;
}

export interface AsignacionData {
	id: number;
	activo: string;
	tipo_activo: string;
	estado_activo: string;
	usuario: string;
	ubicacion: string;
	foto_url: string | null;
	usuario_id: number;
	ubicacion_id: number;
	fecha_asignacion: string;
	fecha_devolucion: string | null;
	comentarios: string;
}

export interface AsignacionResponse {
	data: AsignacionData;
	message?: string;
}
