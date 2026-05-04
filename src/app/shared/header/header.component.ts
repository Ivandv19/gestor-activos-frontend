import { Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { environment } from "../../../environments/environment";
import { AuthService } from "../../login/services/auth.service";
import { getCloudflareImage } from "../../utils/images";

@Component({
	selector: "app-header",
	standalone: true,
	templateUrl: "./header.component.html",
	styleUrl: "./header.component.css",
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
		const fotoUrl = userData?.foto_url || "";

		// Usamos el optimizador (50px para el avatar del header)
		return (
			getCloudflareImage(fotoUrl, { width: 50 }) ||
			"https://gestor-assets.mgdc.site/img-perfil.jpg"
		);
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
