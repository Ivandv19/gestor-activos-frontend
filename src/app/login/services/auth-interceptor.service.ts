import { Injectable } from "@angular/core";
import {
	HttpInterceptor,
	HttpRequest,
	HttpHandler,
	HttpEvent,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	constructor(private authService: AuthService) {}

	intercept(
		req: HttpRequest<any>,
		next: HttpHandler,
	): Observable<HttpEvent<any>> {
		const token = this.authService.getToken(); // Obtiene el token JWT

		if (token) {
			// Clona la solicitud y agrega el encabezado Authorization
			req = req.clone({
				setHeaders: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});
		}

		return next.handle(req); // Continúa con la solicitud modificada
	}
}
