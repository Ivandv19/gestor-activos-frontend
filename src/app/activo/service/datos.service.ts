import type { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import type { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
	providedIn: "root",
})
export class DatosService {
	private apiUrl = `${environment.apiUrl}/gestion-activos`;

	constructor(private http: HttpClient) {}

	// Método para obtener datos auxiliares
	obtenerDatosAuxiliares(): Observable<any> {
		return this.http.get(`${this.apiUrl}/datos-auxiliares`);
	}

	// Método para obtener datos de activos
	validarEtiquetaSerial(etiquetaSerial: string) {
		return this.http.post(`${this.apiUrl}/validar-etiqueta-serial`, {
			etiqueta_serial: etiquetaSerial,
		});
	}
}
