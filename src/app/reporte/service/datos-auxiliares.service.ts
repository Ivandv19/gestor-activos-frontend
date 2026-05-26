import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { DatosAuxiliaresResponse } from "../../models/reporte.interface";

@Injectable({
	providedIn: "root",
})
export class DatosAuxiliaresService {
	private apiUrl = `${environment.apiUrl}/reportes/datos-auxiliares`;

	constructor(private http: HttpClient) {}

	getDatosAuxiliares(): Observable<DatosAuxiliaresResponse> {
		return this.http.get<DatosAuxiliaresResponse>(this.apiUrl);
	}
}
