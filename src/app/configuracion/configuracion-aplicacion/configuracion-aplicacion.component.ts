import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfiguracionService } from "../services/configuracion.service";

@Component({
	selector: "app-configuracion-aplicacion",
	standalone: false,
	templateUrl: "./configuracion-aplicacion.component.html",
	styleUrl: "./configuracion-aplicacion.component.css",
})
export class ConfiguracionAplicacionComponent implements OnInit {
	configuracionForm!: FormGroup;
	perfilForm!: FormGroup;
	errorMessage: string = "";

	public previewUrl: string | null = null; // Vista previa de la nueva imagen
	imagenActual: string | null = null; // URL de la imagen actual del activo
	imagenLocalStorageKey: string | null = null; // Clave de la imagen en localStorage

	// Datos para NgSelect
	idiomasDisponibles = [
		{ codigo: "es", nombre: "Español" },
		{ codigo: "en", nombre: "Inglés" },
		{ codigo: "fr", nombre: "Francés" },
	];
	zonasHorariasDisponibles = [
		{ codigo: "UTC-5", nombre: "UTC-5" },
		{ codigo: "UTC+0", nombre: "UTC+0" },
		{ codigo: "UTC+3", nombre: "UTC+3" },
	];
	monedasDisponibles = [
		{ codigo: "USD", nombre: "Dólar estadounidense" },
		{ codigo: "EUR", nombre: "Euro" },
		{ codigo: "MXN", nombre: "Peso mexicano" },
	];

	formatosFechaDisponibles = [
		{ codigo: "DD/MM/YYYY", nombre: "DD/MM/YYYY" },
		{ codigo: "MM/DD/YYYY", nombre: "MM/DD/YYYY" },
		{ codigo: "YYYY-MM-DD", nombre: "YYYY-MM-DD" },
	];

	error: string | null = null; // Para manejar errores

	constructor(
		private fb: FormBuilder,
		private configuracionService: ConfiguracionService,
	) {}

	ngOnInit(): void {
		this.inicializarFormularios();
		this.obtenerConfiguracion();
		this.obtenerPerfilUsuario();
	}

	/**
	 * Inicializa los formularios reactivos.
	 */
	inicializarFormularios(): void {
		this.configuracionForm = this.fb.group({
			idioma: ["", Validators.required],
			zona_horaria: ["", Validators.required],
			formato_fecha: ["", Validators.required],
			formato_moneda: ["", Validators.required],
		});

		this.perfilForm = this.fb.group(
			{
				nombre: [""],
				email: ["", Validators.email],
				departamento: [""],
				contrasena_actual: ["", Validators.required],
				nueva_contrasena: ["", Validators.minLength(8)],
				confirmar_nueva_contrasena: ["", Validators.minLength(8)],
				foto_url: [""],
			},
			{
				validators: this.confirmarContrasenas(
					"nueva_contrasena",
					"confirmar_nueva_contrasena",
				),
			},
		);
	}

	obtenerConfiguracion(): void {
		this.configuracionService.getConfiguracionAplicacion().subscribe({
			next: (response) => {
				this.configuracionForm.patchValue(response);
				console.log("Configuración cargada:", response);
			},
			error: (error) => {
				// Ejem. Si el backend devuelve { error: "Error al obtener la configuración." }
				const errorMessage =
					error.error?.error || "Error al obtener la configuración.";

				// Mostrar el mensaje
				this.errorMessage = errorMessage;
				console.error("Error del backend:", errorMessage);
				alert(errorMessage);
			},
		});
	}

	obtenerPerfilUsuario(): void {
		this.configuracionService.getPerfilUsuario().subscribe({
			next: (response) => {
				// Guarda la imagen actual del activo
				this.imagenActual = response.foto_url || undefined;
				// Si hay imagen actual, prepara la vista previa
				if (this.imagenActual) {
					this.previewUrl = "http://localhost:3000" + this.imagenActual;
				}
				const perfilData = {
					nombre: response.nombre,
					email: response.email,
					departamento: response.departamento,
				};
				this.perfilForm.patchValue(perfilData);
				console.log("Perfil de usuario cargado:", perfilData);
			},
			error: (error) => {
				// Ejem. Si el backend devuelve { error: "Error al obtener la configuración." }
				const errorMessage =
					error.error?.error || "Error al obtener la configuración.";

				// Mostrar el mensaje
				this.errorMessage = errorMessage;
				console.error("Error del backend:", errorMessage);
				alert(errorMessage);
			},
		});
	}

	onFileSelected(event: any): void {
		const file: File = event.target.files[0];
		if (file && file.type.startsWith("image/")) {
			// Vista previa local
			const reader = new FileReader();
			reader.onload = () => {
				this.previewUrl = reader.result as string;

				// Guardar en localStorage (clave única para evitar conflictos)
				const imageKey = `activo_img_${Date.now()}`;
				localStorage.setItem(imageKey, this.previewUrl);
				this.imagenLocalStorageKey = imageKey; // Guardar la clave para usarla después
			};
			reader.readAsDataURL(file);
		} else {
			alert("Por favor selecciona una imagen válida (JPEG, PNG, GIF).");
		}
	}

	/**
	 * Validador personalizado para verificar que las contraseñas coincidan.
	 */
	confirmarContrasenas(contrasena: string, confirmarContrasena: string) {
		return (formGroup: FormGroup) => {
			const contrasenaControl = formGroup.get(contrasena);
			const confirmarControl = formGroup.get(confirmarContrasena);

			if (contrasenaControl?.value !== confirmarControl?.value) {
				confirmarControl?.setErrors({ noCoinciden: true });
			} else {
				confirmarControl?.setErrors(null);
			}
		};
	}

	/**
	 * Maneja la selección de un archivo para la foto de perfil.
	 */
	onFileChange(event: any): void {
		const file = event.target.files[0];
		if (file) {
			this.perfilForm.patchValue({ foto: file });
		}
	}

	guardarConfiguracion(): void {
		// 1. Primero verificar si el formulario es válido
		if (!this.perfilForm.valid) {
			alert("Por favor completa correctamente todos los campos requeridos");
			this.perfilForm.markAllAsTouched(); // Marcar campos como tocados para mostrar errores
			return; // Detener la ejecución si el formulario no es válido
		}
		const configuracionData = {
			idioma: this.configuracionForm.value.idioma || undefined,
			zona_horaria: this.configuracionForm.value.zona_horaria || undefined,
			formato_fecha: this.configuracionForm.value.formato_fecha || undefined,
			formato_moneda: this.configuracionForm.value.formato_moneda || undefined,
		};
		// Filtrar para eliminar campos undefined (no enviarlos)
		const payload = Object.fromEntries(
			Object.entries(configuracionData).filter(([_, v]) => v !== undefined),
		);

		this.configuracionService.updateConfiguracionAplicacion(payload).subscribe({
			next: (response) => {
				console.log("[SUCCESS] Configuración guardada:", response);

				// 1. Mostrar feedback al usuario
				alert("Configuración guardada correctamente");

				// 2. Resetear y recargar datos
				this.configuracionForm.reset();

				// 3. Obtener configuración actualizada
				this.obtenerConfiguracion();
			},
			error: (error) => {
				// Ejem. Si el backend devuelve { error: "Error al obtener la configuración." }
				const errorMessage =
					error.error?.error || "Error al obtener la configuración.";

				// Mostrar el mensaje
				this.errorMessage = errorMessage;
				console.error("Error del backend:", errorMessage);
				alert(errorMessage);
			},
		});
	}

	guardarPerfil(): void {
		// 1. Primero verificar si el formulario es válido
		if (!this.perfilForm.valid) {
			alert("Por favor completa correctamente todos los campos requeridos");
			this.perfilForm.markAllAsTouched(); // Marcar campos como tocados para mostrar errores
			return; // Detener la ejecución si el formulario no es válido
		}

		// 2. Si el formulario es válido, proceder con la lógica de la imagen
		if (this.imagenLocalStorageKey) {
			const imageDataUrl = localStorage.getItem(this.imagenLocalStorageKey);

			if (imageDataUrl) {
				// Convertir DataURL a Blob y subir la imagen
				const blob = this.dataURLtoBlob(imageDataUrl);
				const formData = new FormData();
				formData.append("file", blob, "perfil_image.jpg");

				// Primero subir la imagen
				this.configuracionService.subirImagen(formData).subscribe({
					next: (response) => {
						this.actualizarConfiguracionConDatos(response.url);
						console.log("Imagen subida con éxito:", response.url);
						if (this.imagenLocalStorageKey) {
							localStorage.removeItem(this.imagenLocalStorageKey); // Limpiar
						}
					},
					error: (error) => {
						alert("Error al subir la imagen. Intenta nuevamente.");
						console.error(error);
					},
				});
				return;
			}
		}

		// 3. Si no hay imagen, actualizar el perfil directamente
		this.actualizarConfiguracionConDatos(undefined);
	}

	/**
	 * Convierte DataURL a Blob (para enviar la imagen al backend).
	 */
	private dataURLtoBlob(dataURL: string): Blob {
		const arr = dataURL.split(",");
		const mime = arr[0].match(/:(.*?);/)![1];
		const bstr = atob(arr[1]);
		let n = bstr.length;
		const u8arr = new Uint8Array(n);

		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new Blob([u8arr], { type: mime });
	}

	private actualizarConfiguracionConDatos(imagenUrl: string | undefined): void {
		// Obtener los valores del formulario
		const perfilData = {
			nombre: this.perfilForm.value.nombre || undefined,
			email: this.perfilForm.value.email || undefined,
			departamento: this.perfilForm.value.departamento || undefined,
			contrasena_actual: this.perfilForm.value.contrasena_actual || undefined,
			nueva_contrasena: this.perfilForm.value.nueva_contrasena || undefined,
			confirmar_nueva_contrasena:
				this.perfilForm.value.confirmar_nueva_contrasena || undefined,
			foto_url: imagenUrl,
		};

		// Filtrar para eliminar campos undefined (no enviarlos)
		const payload = Object.fromEntries(
			Object.entries(perfilData).filter(([_, v]) => v !== undefined),
		);

		console.log("Datos del perfil a actualizar:", payload);

		// Llamar al servicio para actualizar el perfil
		this.configuracionService.updatePerfilUsuario(payload).subscribe({
			next: (response) => {
				// 1. Log de éxito
				console.log("[SUCCESS] Perfil actualizado:", response);

				// 2. Feedback al usuario
				alert("¡Perfil actualizado con éxito!");

				// 3. Resetear y recargar datos
				this.perfilForm.reset();

				// 4. Obtener datos actualizados
				this.obtenerPerfilUsuario();
			},
			error: (error) => {
				// Manejar el error
				const errorMessage =
					error.error?.error || "Error al actualizar el perfil.";
				console.error("[ERROR] Error del backend:", errorMessage);
				alert(errorMessage);
			},
		});
	}
	cancelarConfiguracion(): void {
		const confirmar = confirm(
			"¿Estás seguro de que deseas cancelar? Se perderán los cambios no guardados.",
		);

		if (confirmar) {
			// Limpiar el formulario y localStorage
			this.configuracionForm.reset();
			//  Obtener datos actualizados
			this.obtenerConfiguracion();

			if (this.imagenLocalStorageKey) {
				localStorage.removeItem(this.imagenLocalStorageKey);
				this.imagenLocalStorageKey = null;
				this.previewUrl = null;
			}
		}
	}

	cancelarPerfil(): void {
		const confirmar = confirm(
			"¿Estás seguro de que deseas cancelar? Se perderán los cambios no guardados.",
		);

		if (confirmar) {
			// Limpiar el formulario y localStorage
			this.perfilForm.reset();
			//  Obtener datos actualizados
			this.obtenerPerfilUsuario();

			if (this.imagenLocalStorageKey) {
				localStorage.removeItem(this.imagenLocalStorageKey);
				this.imagenLocalStorageKey = null;
				this.previewUrl = null;
			}
		}
	}
}
