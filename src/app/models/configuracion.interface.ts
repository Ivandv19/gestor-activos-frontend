export interface ConfiguracionResponse {
	id: number;
	clave: string;
	valor: string | number | boolean;
	descripcion: string;
	tipo: "string" | "number" | "boolean";
	fecha_actualizacion: string;
}

export interface PerfilResponse {
	id: number;
	email: string;
	nombre: string;
	foto_url?: string;
	rol: string;
	departamento?: string;
	fecha_creacion: string;
}

export interface ConfiguracionAplicacionResponse {
	idioma: string;
	zona_horaria: string;
	formato_fecha: string;
	formato_moneda: string;
}
