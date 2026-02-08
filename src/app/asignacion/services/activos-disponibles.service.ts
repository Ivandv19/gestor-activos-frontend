import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
	providedIn: "root",
})
export class ActivosDisponiblesService {
	private apiUrl = `${environment.apiUrl}/asignaciones/activos-disponibles`;

	constructor(private http: HttpClient) {}

	getActivosDisponibles(
		page: number = 1,
		limit: number = 10,
		search: string = "",
		filtroSeleccionado?: string,
		opcionSeleccionada?: string,
		orden?: string,
	): Observable<any> {
		let params = new HttpParams()
			.set("page", page.toString())
			.set("limit", limit.toString());

		if (search) {
			params = params.set("search", search); // Agregar término de búsqueda
		}

		if (filtroSeleccionado && opcionSeleccionada) {
			// Enviar el filtro como clave y su valor como valor
			params = params.set(filtroSeleccionado, opcionSeleccionada);
		}

		if (orden) {
			params = params.set("orden", orden); // Agregar ordenamiento
		}

		console.log("[SERVICE] Parámetros enviados al backend:", params.toString());
		return this.http.get(this.apiUrl, { params });
	}
}
