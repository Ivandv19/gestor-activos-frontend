import { Component, type OnInit } from "@angular/core";
import type { ActivatedRoute, Router } from "@angular/router";
import type { ActivoService } from "../service/activo.service";

@Component({
	selector: "app-detalle-activo",
	standalone: false,
	templateUrl: "./detalle-activo.component.html",
	styleUrl: "./detalle-activo.component.css",
})
export class DetalleActivoComponent implements OnInit {
	activo: any = {}; // Inicializa como objeto vacío
	garantia: any = {}; // Inicializa como objeto vacío
	errorMessage: string = ""; // Mensaje de error inicializado como cadena vacía

	activoId!: number; // ID del activo

	constructor(
		private route: ActivatedRoute,
		private activoService: ActivoService,
		private router: Router,
	) {}

	ngOnInit(): void {
		// Obtener el ID del activo desde la ruta
		this.activoId = +this.route.snapshot.paramMap.get("id")!;

		// Cargar el activo al inicializar el componente
		this.cargarActivo();
	}

	// Método para cargar el activo por ID desde la URL
	cargarActivo(): void {
		this.activoService.getActivoById(this.activoId).subscribe({
			next: (response) => {
				this.activo = response; // Asignar los datos del activo al modelo
				console.log("Activo cargado correctamente:", this.activo); // Log para verificar los datos
			},
			error: (error) => {
				// Ejem. Si el backend devuelve { error: "Error al obtener el activo" }
				const errorMessage = error.error?.error || "Error al obtener el activo";

				// Mostrar el mensaje
				this.errorMessage = errorMessage;
				console.error("Error del backend:", errorMessage);
				alert(errorMessage);
			},
		});
	}

	darDeBaja(): void {
		console.log(
			"Intentando dar de baja el activo:",
			this.activo,
			"con id:",
			this.activo.id,
		); // Log para depuración

		if (!this.activo || !this.activo.id) {
			console.error("No se puede dar de baja: Activo no cargado.");
			return;
		}

		const confirmacion = confirm(
			`¿Estás seguro de dar de baja el activo "${this.activo.nombre}"?`,
		);

		if (confirmacion) {
			this.activoService.darDeBajaActivo(this.activo.id).subscribe({
				next: (response) => {
					// Respuesta exitosa
					alert(response.message);
					this.router.navigate(["/gestion-activos"]); // Redirigir a la lista de activos
				},
				error: (error) => {
					// Ejem. Si el backend devuelve { message: "Error al dar de baja" }
					const errorMessage = error.error?.message || "Error al dar de baja";
					// Mostrar el mensaje
					this.errorMessage = errorMessage;
					console.error("Error del backend:", errorMessage);
					alert(errorMessage);
				},
			});
		}
	}

	editarActivo(): void {
		// Navegar al componente de edición con el ID del activo
		this.router.navigate(["/gestion-activos/editar", this.activo.id]);
	}

	verHistorial(): void {
		// Lógica para ver el historial del activo
		this.router.navigate(["/gestion-activos/historial", this.activo.id]);
	}
}
