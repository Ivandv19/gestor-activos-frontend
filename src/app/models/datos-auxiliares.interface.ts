export interface SelectItem {
	id: number;
	nombre: string;
	descripcion?: string;
}

export interface DatosAuxiliares {
	data: {
		tipos?: SelectItem[];
		proveedores?: SelectItem[];
		ubicaciones?: SelectItem[];
		proveedoresGarantia?: SelectItem[];
		duenos?: SelectItem[];
		estados?: SelectItem[];
		tiposActivos?: SelectItem[];
		usuarios?: SelectItem[];
		acciones?: SelectItem[];
		nombre?: string;
		foto_url?: string;
	};
}
