export interface HistorialEntry {
	id: number;
	activo_id: number;
	accion: "creado" | "editado" | "eliminado" | "asignado" | string;
	usuario_responsable: string;
	fecha: string;
	detalles: string | Record<string, unknown>; // JSON dinámico del backend (estructura variable según la acción)
}
