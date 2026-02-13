import type { Location } from "@angular/common";
import { Component, type OnInit } from "@angular/core";
import { type FormBuilder, type FormGroup, Validators } from "@angular/forms";
import type { ActivatedRoute, Router } from "@angular/router";
import type { AsignacionService } from "../services/asignacion.service";
import type { AuxiliaresService } from "../services/auxiliares.service";

@Component({
	selector: "app-asignar-activo",
	standalone: false,
	templateUrl: "./asignar-activo.component.html",
	styleUrl: "./asignar-activo.component.css",
})
export class AsignarActivoComponent implements OnInit {
	// Variables para almacenar datos auxiliares
	id: number | null = null;
	usuarios: any[] = [];
	ubicaciones: any[] = [];

	// FormGroup para el formulario
	asignacionForm!: FormGroup;

	// Variable para manejar mensajes de error
	errorMessage: string = "";

	constructor(
		private route: ActivatedRoute,
		private auxiliaresService: AuxiliaresService,
		private asignacionService: AsignacionService,
		private fb: FormBuilder,
		private router: Router,
		private location: Location,
	) {}

	ngOnInit(): void {
		// Inicializar el formulario
		this.asignacionForm = this.fb.group({
			nombreActivo: [{ value: "", disabled: true }, Validators.required], // Solo lectura
			usuarioAsignar: ["", Validators.required],
			ubicacion: ["", Validators.required],
			fechaAsignacion: ["", Validators.required],
			fechaDevolucion: [""],
			comentarios: [""],
		});

		// Obtener el ID del activo de los parámetros de la ruta
		this.route.params.subscribe((params) => {
			this.id = +params["id"]; // Convertir el ID a número
			console.log("ID recibido:", this.id);

			// Cargar los datos auxiliares si el ID está presente
			if (this.id) {
				this.cargarDatosAuxiliares(this.id);
			}
		});
	}

	// Método para cargar los datos auxiliares
	cargarDatosAuxiliares(id: number): void {
		this.auxiliaresService.getDatosAuxiliares(id).subscribe({
			next: (response) => {
				this.usuarios = response.usuarios; // Guardar los usuarios
				this.ubicaciones = response.ubicaciones; // Guardar las ubicaciones

				// Actualizar el valor del campo "nombreActivo" en el formulario
				const nombreActivo = response.nombreActivo || "Nombre no disponible";
				this.asignacionForm.get("nombreActivo")?.setValue(nombreActivo);

				console.log("Datos cargados:", response);
			},
			error: (error) => {
				// Ejem. Si el backend devuelve { error: "Error  al cargar datos auxiliares" }
				const errorMessage =
					error.error?.error || "Error  al cargar datos auxiliares";

				// Mostrar el mensaje
				this.errorMessage = errorMessage;
				console.error("Error del backend:", errorMessage);
				alert(errorMessage);
			},
		});
	}

	onSubmit(): void {
		if (this.asignacionForm.valid) {
			const formData = this.asignacionForm.value;

			// Mapear los nombres de los campos al formato esperado por el backend
			const datosParaBackend = {
				activo_id: this.id,
				usuario_id: formData.usuarioAsignar,
				ubicacion_id: formData.ubicacion,
				fecha_asignacion: formData.fechaAsignacion,
				fecha_devolucion: formData.fechaDevolucion || null,
				comentarios: formData.comentarios || "",
			};

			console.log("Datos enviados al backend:", datosParaBackend);

			// Enviar los datos al backend usando el servicio
			this.asignacionService.createAsignacion(datosParaBackend).subscribe({
				next: (response) => {
					console.log("Asignación creada exitosamente:", response);
					alert("Asignación creada correctamente.");
					// Redirigir al usuario a la ruta '/asignaciones'
					this.router.navigate(["/asignaciones"]);
				},
				error: (error) => {
					// Ejem. Si el backend devuelve { error: "Error al crear la asignación" }
					const errorMessage =
						error.error?.error || "Error al crear la asignación";

					// Mostrar el mensaje
					this.errorMessage = errorMessage;
					console.error("Error del backend:", errorMessage);
					alert(errorMessage);
				},
			});
		} else {
			console.error("El formulario no es válido.");
			alert("Por favor, completa todos los campos requeridos.");
		}
	}

	cancelarEdicion(showAlert: boolean = true): void {
		// 1. Limpiar el formulario
		this.asignacionForm.reset();

		// 2. Mostrar alerta de cancelación si es necesario
		if (showAlert) {
			alert("Acción cancelada. El formulario ha sido limpiado.");
		}

		// 3. Regresar a la ruta anterior
		this.location.back();
	}
}
