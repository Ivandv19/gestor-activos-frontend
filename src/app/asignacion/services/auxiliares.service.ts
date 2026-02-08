import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
@Injectable({
	providedIn: "root",
})
export class AuxiliaresService {
	private apiUrl = `${environment.apiUrl}/asignaciones`;

	constructor(private http: HttpClient) {}
	// Método para obtener todos los datos auxiliares
	getDatosAuxiliares(id: number): Observable<any> {
		return this.http.get(`${this.apiUrl}/datos-auxiliares/${id}`);
	}
}
