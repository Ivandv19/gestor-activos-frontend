import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Injectable({
	providedIn: "root",
})
export class HistorialService {
	private apiUrl = `${environment.apiUrl}/historial`; // URL base del backend

	constructor(private http: HttpClient) {}

	getHistorial(
		activoId: number,
		page: number = 1,
		limit: number = 10,
		searchTerm: string = "",
		filtro?: string,
		valorFiltro?: string | number,
		orden?: string,
	): Observable<any> {
		// Construir parámetros base con logs
		let params = new HttpParams()
			.set("page", page.toString())
			.set("limit", limit.toString());

		// Agregar searchTerm si existe
		if (searchTerm) {
			console.log("[HISTORIAL SERVICE] Aplicando búsqueda:", searchTerm);
			params = params.set("search", searchTerm);
		}

		// Agregar filtro dinámico si existe
		if (filtro && valorFiltro) {
			console.log("[HISTORIAL SERVICE] Aplicando filtro:", {
				tipo: filtro,
				valor: valorFiltro,
			});
			params = params.set(filtro, valorFiltro.toString());
		}

		// Agregar orden si existe
		if (orden) {
			console.log("[HISTORIAL SERVICE] Aplicando orden:", orden);
			params = params.set("orden", orden);
		}

		console.log("[HISTORIAL SERVICE] Parámetros finales:", params.toString());
		return this.http.get(`${this.apiUrl}/activos/${activoId}`, { params });
	}

	// Método para obtener datos auxiliares
	obtenerDatosAuxiliares(): Observable<any> {
		return this.http.get(`${this.apiUrl}/filtros-auxiliares`);
	}
}
