import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AsignacionService } from "../services/asignacion.service";
import { AuxiliaresService } from "../services/auxiliares.service";

@Component({
	selector: "app-editar-asignacion",
	standalone: false,
	templateUrl: "./editar-asignacion.component.html",
	styleUrl: "./editar-asignacion.component.css",
})
export class EditarAsignacionComponent implements OnInit {
	// Propiedades para almacenar datos
	activoId!: number; // ID del activo
	nombreActivo: string = "";
	usuarios: any[] = [];
	ubicaciones: any[] = [];
	asignacionData: any = {};

	// FormGroup para el formulario
	asignacionForm!: FormGroup;

	// Variable para manejar mensajes de error
	errorMessage: string = "";

	idAsignacion: number = 0; // ID de la asignación

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private fb: FormBuilder,
		private auxiliaresService: AuxiliaresService,
		private asignacionService: AsignacionService,
		private location: Location,
	) {}

	ngOnInit(): void {
		// Obtener el ID del activo desde la ruta
		this.activoId = +this.route.snapshot.paramMap.get("id")!;

		this.inicializarFormulario();

		this.cargarDatosAsignacion();

		this.cargarDatosAdicionales();
	}

	inicializarFormulario(): void {
		this.asignacionForm = this.fb.group({
			nombreActivo: ["", Validators.required],
			usuarioAsignar: [""],
			ubicacion: [""],
			fechaAsignacion: [""],
			fechaDevolucion: [""],
			comentarios: [""],
		});
	}

	cargarDatosAsignacion(): void {
		this.asignacionService.getAsignacionPorId(this.activoId).subscribe({
			next: (response) => {
				this.asignacionData = response.asignacion;
				console.log("Datos de la asignación cargados:", this.asignacionData);
				(this.idAsignacion = this.asignacionData.id),
					this.asignacionForm.patchValue({
						nombreActivo: this.asignacionData.activo_nombre,
						usuarioAsignar: this.asignacionData.usuario_id,
						ubicacion: this.asignacionData.ubicacion_id,
						fechaAsignacion: undefined,
						fechaDevolucion: undefined,
						comentarios: this.asignacionData.comentarios,
					});
			},
			error: (error) => {
				// Ejem. Si el backend devuelve { mensaje: "Error al obtener los datos de la asignación" }
				const errorMessage =
					error.error?.mensaje || "Error al obtener los datos de la asignación";

				// Mostrar el mensaje
				this.errorMessage = errorMessage;
				console.error("Error del backend:", errorMessage);
				alert(errorMessage);
			},
		});
	}

	cargarDatosAdicionales(): void {
		this.auxiliaresService.getDatosAuxiliares(this.activoId).subscribe({
			next: (response) => {
				this.usuarios = response.usuarios; // Guardar los usuarios
				this.ubicaciones = response.ubicaciones; // Guardar las ubicaciones
				console.log("Datos auxiliares cargados:", response);
			},
			error: (error) => {
				// Ejem. Si el backend devuelve { error: "Error al cargar datos auxiliares" }
				const errorMessage =
					error.error?.error || "Error al cargar datos auxiliares";

				// Mostrar el mensaje
				this.errorMessage = errorMessage;
				console.error("Error del backend:", errorMessage);
				alert(errorMessage);
			},
		});
	}

	// Método para manejar el envío del formulario
	onSubmit(): void {
		if (this.asignacionForm.valid) {
			// Mapear los nombres de los campos del frontend al backend
			const datosBackend = {
				activo_id: this.asignacionData.activo_id || undefined,
				usuario_id: this.asignacionForm.value.usuarioAsignar || undefined,
				ubicacion_id: this.asignacionForm.value.ubicacion || undefined,
				fecha_asignacion:
					this.formatDateForBackend(
						this.asignacionForm.value.fechaAsignacion,
					) || undefined,
				fecha_devolucion:
					this.formatDateForBackend(
						this.asignacionForm.value.fechaDevolucion,
					) || undefined,
				comentarios: this.asignacionForm.value.comentarios || undefined,
			};

			// Filtrar para eliminar campos undefined (no enviarlos)
			const payload = Object.fromEntries(
				Object.entries(datosBackend).filter(([_, v]) => v !== undefined),
			);

			// Enviar los datos mapeados al backend
			this.asignacionService
				.updateAsignacion(this.activoId, payload)
				.subscribe({
					next: (response) => {
						console.log("Asignación actualizada exitosamente:", response);
						alert("Asignación actualizada correctamente.");
						this.router.navigate(["/asignaciones"]);
					},
					error: (error) => {
						// Ejem. Si el backend devuelve { error: "Error al actualizar la asignación" }
						const errorMessage =
							error.error?.error || "Error al actualizar la asignación";

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

	// Método para eliminar la asignación
	eliminarAsignacion(): void {
		// Confirmar con el usuario antes de proceder
		const confirmar = confirm("¿Estás seguro de eliminar esta asignación?");
		if (!confirmar) return; // Si el usuario cancela, no hacer nada

		// Llamar al servicio para eliminar la asignación
		this.asignacionService.deleteAsignacion(this.idAsignacion).subscribe({
			next: (response) => {
				console.log("Asignación eliminada exitosamente:", response);
				alert("Asignación eliminada correctamente.");
				this.asignacionForm.reset();
				this.router.navigate(["/asignaciones"]); // Redirigir a la lista de asignaciones
			},
			error: (error) => {
				// Manejar errores del backend
				const errorMessage =
					error.error?.error || "Error al eliminar la asignación";
				console.error("Error del backend:", errorMessage);
				alert(errorMessage);
			},
		});
	}

	// Función auxiliar para formatear la fecha
	formatDateForBackend(date: string): string {
		if (!date) return ""; // Devuelve una cadena vacía si date es null o undefined
		const formattedDate = new Date(date).toISOString().split("T")[0]; // Convierte a YYYY-MM-DD
		return formattedDate;
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
