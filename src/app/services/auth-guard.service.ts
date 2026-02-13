import { Injectable } from "@angular/core";
import type { CanActivate, Router } from "@angular/router";
import type { AuthService } from "../login/services/auth.service";

@Injectable({
	providedIn: "root",
})
export class AuthGuard implements CanActivate {
	constructor(
		private authService: AuthService,
		private router: Router,
	) {}

	canActivate(): boolean {
		if (this.authService.isLoggedIn()) {
			return true; // Permite el acceso a la ruta
		} else {
			this.router.navigate(["/login"]); // Redirige al login si no está autenticado
			return false;
		}
	}
}
