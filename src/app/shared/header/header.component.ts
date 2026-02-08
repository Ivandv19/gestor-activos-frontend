import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { AuthService } from "../../login/services/auth.service";
import { Observable, Subject, takeUntil, throwError } from "rxjs";

import { environment } from "../../../environments/environment";

@Component({
	selector: "app-header",
	templateUrl: "./header.component.html",
	styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnDestroy {
	apiUrl = environment.apiUrl;

	// Propiedades para manejar el estado de la aplicación
	private destroy$ = new Subject<void>();
	fotoUrl: string = "";

	constructor(
		private router: Router,
		private authService: AuthService,
	) {
		// Escuchar eventos de logout
		this.authService
			.onLogout()
			.pipe(takeUntil(this.destroy$))
			.subscribe(() => {
				// No hace falta limpiar cache porque lo eliminaremos
			});
	}

	isLoginRoute(): boolean {
		return this.router.url === "/login";
	}

	// Nueva función para verificar autenticación
	isLoggedIn(): boolean {
		return this.authService.isLoggedIn();
	}

	// Funcion para obtener la foto de usuario
	getUserPhoto(): string {
		const userData = this.authService.getUserData();

		if (userData && userData.foto_url) {
			// Si la URL es completa (R2), usarla directo. Si no, usar apiUrl.
			return userData.foto_url.startsWith("http")
				? userData.foto_url
				: `${this.apiUrl}${userData.foto_url}`;
		}

		// Imagen por defecto si no hay foto_url
		return "https://gestor-assets.mgdc.site/img-perfil.jpg";
	}

	ngOnDestroy(): void {
		// Completar la limpieza de recursos al destruir el componente
		this.destroy$.next();
		this.destroy$.complete();
	}

	// Función para obtener el título según la ruta
	getTitle(): string {
		const currentRoute = this.router.url; // Obtiene la ruta actual directamente

		switch (currentRoute) {
			case "/login":
				return "Gestor de Activos";
			case "/dashboard":
				return "Dashboard";
			case "/gestion-activos":
				return "Gestión de Activos";
			case "/asignaciones":
				return "Asignaciones";
			case "/reportes":
				return "Reportes";
			case "/configuracion":
				return "Configuración";
			default:
				return "Gestor de Activos"; // Título predeterminado
		}
	}
}
