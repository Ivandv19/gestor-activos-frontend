import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { SubirImagenResponse } from "../../models/common.interface";
import {
	ConfiguracionAplicacionResponse,
	PerfilResponse,
} from "../../models/configuracion.interface";
@Injectable({
	providedIn: "root",
})
export class ConfiguracionService {
	private apiUrl = `${environment.apiUrl}/configuracion`;

	constructor(private http: HttpClient) {}

	getConfiguracionAplicacion(): Observable<ConfiguracionAplicacionResponse> {
		return this.http.get<ConfiguracionAplicacionResponse>(
			`${this.apiUrl}/aplicacion`,
		);
	}

	updateConfiguracionAplicacion(
		datos: Partial<ConfiguracionAplicacionResponse>,
	): Observable<{ message: string }> {
		return this.http.put<{ message: string }>(
			`${this.apiUrl}/aplicacion`,
			datos,
		);
	}

	updatePerfilUsuario(formData: FormData): Observable<PerfilResponse> {
		return this.http.put<PerfilResponse>(`${this.apiUrl}/perfil`, formData);
	}

	getPerfilUsuario(): Observable<PerfilResponse> {
		return this.http.get<PerfilResponse>(`${this.apiUrl}/perfil`);
	}

	subirImagen(formData: FormData): Observable<SubirImagenResponse> {
		return this.http.post<SubirImagenResponse>(
			`${this.apiUrl}/upload`,
			formData,
		);
	}
}
