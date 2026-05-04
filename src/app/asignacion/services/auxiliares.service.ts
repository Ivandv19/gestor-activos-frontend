import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { DatosAuxiliares } from "../../models/datos-auxiliares.interface";
@Injectable({
	providedIn: "root",
})
export class AuxiliaresService {
	private apiUrl = `${environment.apiUrl}/asignaciones`;

	constructor(private http: HttpClient) {}

	getDatosAuxiliares(id: number): Observable<DatosAuxiliares> {
		return this.http.get<DatosAuxiliares>(
			`${this.apiUrl}/datos-auxiliares/${id}`,
		);
	}
}
