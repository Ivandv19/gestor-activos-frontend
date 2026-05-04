import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { DatosAuxiliares } from "../../models/datos-auxiliares.interface";
import { HistorialEntry } from "../../models/historial.interface";
import { Pagination } from "../../models/pagination.interface";

@Injectable({
	providedIn: "root",
})
export class HistorialService {
	private apiUrl = `${environment.apiUrl}/historial`;

	constructor(private http: HttpClient) {}

	getHistorial(
		activoId: number,
		page: number = 1,
		limit: number = 10,
		searchTerm: string = "",
		filtro?: string,
		valorFiltro?: string | number,
		orden?: string,
	): Observable<Pagination<HistorialEntry>> {
		let params = new HttpParams()
			.set("page", page.toString())
			.set("limit", limit.toString());

		if (searchTerm) {
			console.log("[HISTORIAL SERVICE] Aplicando búsqueda:", searchTerm);
			params = params.set("search", searchTerm);
		}

		if (filtro && valorFiltro) {
			console.log("[HISTORIAL SERVICE] Aplicando filtro:", {
				tipo: filtro,
				valor: valorFiltro,
			});
			params = params.set(filtro, valorFiltro.toString());
		}

		if (orden) {
			console.log("[HISTORIAL SERVICE] Aplicando orden:", orden);
			params = params.set("orden", orden);
		}

		console.log("[HISTORIAL SERVICE] Parámetros finales:", params.toString());
		return this.http.get<Pagination<HistorialEntry>>(
			`${this.apiUrl}/activos/${activoId}`,
			{ params },
		);
	}

	obtenerDatosAuxiliares(): Observable<DatosAuxiliares> {
		return this.http.get<DatosAuxiliares>(`${this.apiUrl}/filtros-auxiliares`);
	}
}
