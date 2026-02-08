import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
@Injectable({
	providedIn: "root",
})
export class DashboardService {
	private apiUrl = `${environment.apiUrl}/dashboard`;

	constructor(private http: HttpClient) {}

	/**
	 * Obtiene el resumen general de activos.
	 * @returns Observable con los datos del resumen.
	 */
	getResumen(): Observable<any> {
		return this.http.get(`${this.apiUrl}/resumen`);
	}

	/**
	 * Obtiene las alertas del sistema.
	 * @returns Observable con un arreglo de alertas.
	 */
	getAlertas(): Observable<any> {
		return this.http.get(`${this.apiUrl}/alertas`);
	}
}
