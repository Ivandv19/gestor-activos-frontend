import type { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import type { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
@Injectable({
	providedIn: "root",
})
export class ConfiguracionService {
	private apiUrl = `${environment.apiUrl}/configuracion`;

	constructor(private http: HttpClient) {}

	getConfiguracionAplicacion(): Observable<any> {
		return this.http.get<any>(`${this.apiUrl}/aplicacion`);
	}

	updateConfiguracionAplicacion(datos: any): Observable<any> {
		return this.http.put<any>(`${this.apiUrl}/aplicacion`, datos);
	}

	updatePerfilUsuario(datos: any): Observable<any> {
		// Enviar los datos como JSON al backend
		return this.http.put<any>(`${this.apiUrl}/perfil`, datos);
	}

	getPerfilUsuario(): Observable<any> {
		return this.http.get<any>(`${this.apiUrl}/perfil`);
	}
	//  método para subir imágenes
	subirImagen(formData: FormData): Observable<any> {
		return this.http.post(`${this.apiUrl}/upload`, formData);
	}
}
