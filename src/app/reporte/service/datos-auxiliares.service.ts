import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
@Injectable({
	providedIn: "root",
})
export class DatosAuxiliaresService {
	private apiUrl = `${environment.apiUrl}/reportes/datos-auxiliares`;

	constructor(private http: HttpClient) {}

	// Método para obtener los datos auxiliares
	getDatosAuxiliares(): Observable<any> {
		console.log(
			"[SERVICE] Llamando al backend para obtener datos auxiliares...",
		);
		return this.http.get(this.apiUrl);
	}
}
