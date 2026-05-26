import {
	Component,
	ElementRef,
	OnDestroy,
	OnInit,
	Renderer2,
	ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { AuthService } from "../../services/auth.service";

@Component({
	selector: "app-login",
	standalone: false,
	templateUrl: "./login.component.html",
	styleUrl: "./login.component.css",
})
export class LoginComponent implements OnInit, OnDestroy {
	loginForm: FormGroup;
	errorMessage: string = "";
	isPasswordVisible: boolean = false;
	timeoutRef: ReturnType<typeof setTimeout> | null = null;
	isLoading: boolean = false;
	private destroy$ = new Subject<void>();

	@ViewChild("passwordInput") passwordInput!: ElementRef;

	constructor(
		private fb: FormBuilder,
		private authService: AuthService, // Servicio de autenticación
		private router: Router,
		private renderer: Renderer2, // Manipulación segura del DOM
	) {
		// Inicialización del formulario con validaciones
		this.loginForm = this.fb.group({
			email: ["", [Validators.required, Validators.email]],
			password: ["", [Validators.required, Validators.minLength(6)]],
		});
	}

	ngOnInit() {}

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

			this.authService
				.login(email, password)
				.pipe(takeUntil(this.destroy$))
				.subscribe({
					next: (response) => {
						console.log("Login response:", response);
						this.isLoading = false;
						// Guarda el token y datos del usuario
						this.authService.saveToken(response.data.token, response.data.userData);
						this.router.navigate(["/dashboard"]); // Redirige a dashboard
					},
					error: (error) => {
						this.isLoading = false;
						this.errorMessage = error.error?.error || "Error al iniciar sesión";
						setTimeout(() => {
							this.errorMessage = "";
						}, 5000); // Limpia error después de 5s
					},
				});
		}
	}

	// Limpieza al destruir componente
	ngOnDestroy() {
		if (this.timeoutRef) clearTimeout(this.timeoutRef);
		this.destroy$.next();
		this.destroy$.complete();
	}
}
