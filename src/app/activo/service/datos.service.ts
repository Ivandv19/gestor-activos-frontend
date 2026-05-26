import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { DatosAuxiliares } from "../../models/datos-auxiliares.interface";

@Injectable({
	providedIn: "root",
})
export class DatosService {
	private apiUrl = `${environment.apiUrl}/gestion-activos`;

	constructor(private http: HttpClient) {}

	obtenerDatosAuxiliares(): Observable<DatosAuxiliares> {
		return this.http.get<DatosAuxiliares>(`${this.apiUrl}/datos-auxiliares`);
	}

	validarEtiquetaSerial(
		etiquetaSerial: string,
	): Observable<{ data: { disponible: boolean }; message?: string }> {
		return this.http.post<{ data: { disponible: boolean }; message?: string }>(
			`${this.apiUrl}/validar-etiqueta-serial`,
			{
				etiqueta_serial: etiquetaSerial,
			},
		);
	}
}
