import { Injectable } from "@angular/core";
import {
	ActivatedRouteSnapshot,
	CanActivate,
	Router,
	RouterStateSnapshot,
} from "@angular/router";
import Swal from "sweetalert2";
import { AuthService } from "../login/services/auth.service";

@Injectable({
	providedIn: "root",
})
export class RoleGuard implements CanActivate {
	constructor(
		private authService: AuthService,
		private router: Router,
	) {}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot,
	): boolean {
		// Obtenemos los roles esperados desde la configuración de la ruta
		const expectedRole = route.data["expectedRole"];

		if (
			!this.authService.isLoggedIn() ||
			!this.authService.hasRole(expectedRole)
		) {
			console.warn(
				`[RoleGuard]: Acceso denegado a ${state.url}. Se requiere rol: ${expectedRole}`,
			);

			// Mostrar una alerta premium de acceso denegado
			Swal.fire({
				icon: "error",
				title: "Acceso Denegado",
				text: "No tienes permisos para acceder a esta sección.",
				confirmButtonColor: "#1e293b",
				confirmButtonText: "Entendido",
			});

			this.router.navigate(["/dashboard"]);
			return false;
		}

		return true;
	}
}
