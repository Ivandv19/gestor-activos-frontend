export interface ConfiguracionResponse {
	readonly id: number;
	clave: string;
	valor: string | number | boolean;
	descripcion: string;
	tipo: "string" | "number" | "boolean";
	readonly fecha_actualizacion: string;
}

export interface PerfilResponse {
	data: {
		readonly id: number;
		readonly email: string;
		nombre: string;
		foto_url?: string;
		rol: string;
		departamento?: string;
		readonly fecha_creacion: string;
	};
}

export interface ConfiguracionAplicacionResponse {
	data: {
		idioma: string;
		zona_horaria: string;
		formato_fecha: string;
		formato_moneda: string;
	};
}
