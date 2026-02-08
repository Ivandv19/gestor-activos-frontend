import { Component } from "@angular/core";
import { AuthService } from "../../login/services/auth.service";

@Component({
	selector: "app-navbar",
	standalone: false,
	templateUrl: "./navbar.component.html",
	styleUrl: "./navbar.component.css",
})
export class NavbarComponent {
	constructor(private authService: AuthService) {}

	/**
	 * Cierra la sesión del usuario.
	 */
	cerrarSesion(): void {
		this.authService.logout(); // Llama al método logout del servicio
	}
}
