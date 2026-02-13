import {
	Component,
	ElementRef,
	OnDestroy,
	Renderer2,
	ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
	selector: "app-login",
	standalone: false,
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnDestroy {
	// Formulario reactivo
	loginForm: FormGroup;
	// Mensaje de error para credenciales
	errorMessage: string = "";
	// Control de visibilidad de contraseña
	isPasswordVisible: boolean = false;
	// Referencia para limpiar timeout
	timeoutRef: any = null;
	// Estado de carga del botón
	isLoading: boolean = false;

	// Referencia al input de contraseña
	@ViewChild("passwordInput") passwordInput!: ElementRef;

	constructor(
		private fb: FormBuilder, // Creador de formularios
		private authService: AuthService, // Servicio de autenticación
		private router: Router, // Navegación
		private renderer: Renderer2, // Manipulación segura del DOM
	) {
		// Inicialización del formulario con validaciones
		this.loginForm = this.fb.group({
			email: ["", [Validators.required, Validators.email]],
			password: ["", [Validators.required, Validators.minLength(6)]],
		});
	}

	// Alterna visibilidad de contraseña
	togglePasswordVisibility() {
		this.isPasswordVisible = !this.isPasswordVisible;
		this.renderer.setProperty(
			this.passwordInput.nativeElement,
			"type",
			this.isPasswordVisible ? "text" : "password",
		);

		// Oculta automáticamente después de 10 segundos
		if (this.isPasswordVisible) {
			if (this.timeoutRef) clearTimeout(this.timeoutRef);
			this.timeoutRef = setTimeout(() => {
				this.isPasswordVisible = false;
				this.renderer.setProperty(
					this.passwordInput.nativeElement,
					"type",
					"password",
				);
			}, 10000);
		}
	}

	// Envío de formulario
	onSubmit() {
		if (this.loginForm.valid) {
			this.isLoading = true;
			this.errorMessage = "";
			const { email, password } = this.loginForm.value;

			this.authService.login(email, password).subscribe({
				next: (response) => {
					console.log("Login response:", response);
					this.isLoading = false;
					// Guarda el token y datos del usuario
					this.authService.saveToken(response.token, response.userData);
					this.router.navigate(["/dashboard"]); // Redirige a dashboard
				},
				error: (error) => {
					this.isLoading = false;
					this.errorMessage = error.error?.error || "Error al iniciar sesión";
					setTimeout(() => (this.errorMessage = ""), 5000); // Limpia error después de 5s
				},
			});
		}
	}

	// Limpieza al destruir componente
	ngOnDestroy() {
		if (this.timeoutRef) clearTimeout(this.timeoutRef);
	}
}
