import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, Subject, throwError } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
	providedIn: "root",
})
export class AuthService {
	// URL base del backend
	private apiUrl = `${environment.apiUrl}/auth`;
	// Claves para almacenar el token y datos del usuario en localStorage
	private tokenKey = "authToken";
	private userKey = "user";
	// Sujeto para manejar el evento de logout
	private logoutSubject = new Subject<void>();

	constructor(
		private http: HttpClient,
		private router: Router,
	) {}

	/**
	 * Realiza la autenticación del usuario enviando las credenciales al backend.
	 * @param email - Correo electrónico del usuario.
	 * @param contrasena - Contraseña del usuario.
	 * @returns Observable con la respuesta del backend.
	 */
	login(email: string, contrasena: string): Observable<any> {
		const body = { email, contrasena };
		return this.http.post<any>(`${this.apiUrl}/login`, body);
	}

	/**
	 * Guarda el token JWT y los datos del usuario en localStorage.
	 * @param token - Token JWT a guardar.
	 * @param userData - Datos del usuario a guardar (opcional).
	 */
	saveToken(token: string, userData?: any): void {
		if (!token) {
			console.error("El token no puede ser nulo o vacío.");
			return;
		}

		localStorage.setItem(this.tokenKey, token); // Guarda el token
		if (userData) {
			localStorage.setItem(this.userKey, JSON.stringify(userData)); // Guarda datos del usuario
		}
	}

	onLogout() {
		return this.logoutSubject.asObservable();
	}

	/**
	 * Cierra sesión eliminando el token y los datos del usuario, y redirige al login.
	 */
	logout(): void {
		localStorage.removeItem(this.tokenKey); // Elimina el token
		localStorage.removeItem(this.userKey); // Elimina los datos del usuario
		this.logoutSubject.next(); // Notificar a los componentes
		this.router.navigate(["/login"]); // Redirige al login
	}

	/**
	 * Verifica si el usuario está autenticado.
	 * @returns `true` si el token existe y no ha expirado, `false` en caso contrario.
	 */
	isLoggedIn(): boolean {
		const token = this.getToken();
		if (!token) return false;

		try {
			const decodedToken = this.decodeToken(token);
			const currentTime = Date.now() / 1000; // Tiempo actual en segundos
			return decodedToken.exp > currentTime; // Retorna `true` si el token no ha expirado
		} catch (error) {
			console.error("Error al verificar el token:", error);
			return false;
		}
	}

	/**
	 * Obtiene el token JWT almacenado en localStorage.
	 * @returns El token JWT o `null` si no existe.
	 */
	getToken(): string | null {
		return localStorage.getItem(this.tokenKey);
	}

	/**
	 * Decodifica un token JWT para extraer su contenido.
	 * @param token - Token JWT a decodificar.
	 * @returns El contenido del token decodificado.
	 * @throws Error si el token es inválido o corrupto.
	 */
	private decodeToken(token: string): any {
		try {
			const payload = token.split(".")[1]; // Extrae la parte del payload
			return JSON.parse(atob(payload)); // Decodifica el payload
		} catch (error) {
			console.error("Error al decodificar el token:", error);
			throw new Error("Token inválido o corrupto.");
		}
	}

	/**
	 * Obtiene los datos del usuario almacenados en localStorage.
	 * @returns Los datos del usuario o `null` si no existen.
	 */
	getUserData(): any | null {
		const userData = localStorage.getItem(this.userKey);
		return userData ? JSON.parse(userData) : null;
	}

	/**
	 * Verifica si el token JWT es válido y no ha expirado.
	 * @returns `true` si el token es válido, `false` en caso contrario.
	 */
	isTokenValid(): boolean {
		const token = this.getToken();
		if (!token) return false;

		try {
			const decodedToken = this.decodeToken(token);
			const currentTime = Date.now() / 1000; // Tiempo actual en segundos
			return decodedToken.exp > currentTime; // Retorna `true` si el token no ha expirado
		} catch (error) {
			console.error("Error al validar el token:", error);
			return false;
		}
	}
}
