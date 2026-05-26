import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import {
	DatosAuxiliaresResponse,
	GenerarReporteRequest,
	ReporteFiltros,
	ReporteResponse,
	TiposReporteResponse,
} from "../../models/reporte.interface";

@Injectable({
	providedIn: "root",
})
export class ReporteService {
	private apiUrl = `${environment.apiUrl}/reportes`;
	constructor(private http: HttpClient) {}

	getTiposReporte(): Observable<TiposReporteResponse> {
		return this.http.get<TiposReporteResponse>(`${this.apiUrl}/tipos`);
	}

	generarReporte(
		tipo_id: number,
		filtros: ReporteFiltros,
	): Observable<ReporteResponse> {
		const body: GenerarReporteRequest = {
			tipo_id,
			filtros,
		};
		return this.http.post<ReporteResponse>(`${this.apiUrl}/generar`, body);
	}

	getDatosAuxiliares(): Observable<DatosAuxiliaresResponse> {
		return this.http.get<DatosAuxiliaresResponse>(
			`${this.apiUrl}/datos-auxiliares`,
		);
	}
}
