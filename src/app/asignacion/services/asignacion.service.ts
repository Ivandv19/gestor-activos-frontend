import { type HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import type { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
	providedIn: "root",
})
export class AsignacionService {
	private apiUrl = `${environment.apiUrl}/asignaciones`;

	constructor(private http: HttpClient) {}

	getAsignaciones(
		page: number = 1,
		limit: number = 10,
		search: string = "",
		filtroSeleccionado?: string,
		opcionSeleccionada?: string,
		orden?: string,
	): Observable<any> {
		// Construir parámetros dinámicamente
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

	// Método para crear una nueva asignación
	createAsignacion(asignacionData: any): Observable<any> {
		return this.http.post(`${this.apiUrl}`, asignacionData);
	}

	// Método para obtener los datos de una asignación por su ID
	getAsignacionPorId(id: number): Observable<any> {
		const url = `${this.apiUrl}/${id}`;
		return this.http.get(url);
	}

	// Método para actualizar una asignación existente
	updateAsignacion(id: number, asignacionData: any): Observable<any> {
		const url = `${this.apiUrl}/${id}`;
		return this.http.put(url, asignacionData);
	}

	// Método para eliminar una asignación por ID
	deleteAsignacion(id: number): Observable<any> {
		return this.http.delete(`${this.apiUrl}/${id}`);
	}
}
