import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ActivoService } from "../service/activo.service";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { switchMap } from "rxjs/operators";
import { DatosService } from "../service/datos.service";
import { ActivatedRoute } from "@angular/router";

@Component({
	selector: "app-lista-activos",
	standalone: false,
	templateUrl: "./lista-activos.component.html",
	styleUrl: "./lista-activos.component.css",
})
export class ListaActivosComponent implements OnInit {
	// Variables para los filtros
	filtroSeleccionado: string = "";
	opcionSeleccionada: string = "";
	ordenSeleccionado: string = "asc";
	// Variables generales
	activos: any[] = []; // Lista de activos mostrados en la tabla
	pagination: any = {}; // Metadatos de paginación (total, páginas, etc.)
	limitePorPagina: number = 10; // Número de activos por página
	paginaActual: number = 1; // Página actual
	searchTerm: string = ""; // Término de búsqueda
	private searchSubject = new Subject<string>(); // Sujeto para manejar el debounce
	datosAuxiliares: any; // Almacenará tipos, ubicaciones, usuarios, etc.
	errorMessage: string = ""; // Mensaje de error para mostrar al usuario

	constructor(
		private activoService: ActivoService,
		private router: Router,
		private datosService: DatosService,
		private route: ActivatedRoute,
	) {}

	ngOnInit(): void {
		// Leer los query params de la URL
		this.route.queryParams.subscribe((params) => {
			console.log("Query params recibidos:", params);

			// Mapear los query params a las propiedades del componente
			if (params["licencia_proxima"]) {
				this.filtroSeleccionado = "licencia_proxima";
				this.opcionSeleccionada = "true";
			} else if (params["garantia_proxima"]) {
				this.filtroSeleccionado = "garantia_proxima";
				this.opcionSeleccionada = "true";
			} else if (params["estado"]) {
				this.filtroSeleccionado = "estado";
				this.opcionSeleccionada = params["estado"];
			} else if (params["fecha_devolucion_proxima"]) {
				this.filtroSeleccionado = "fecha_devolucion_proxima";
				this.opcionSeleccionada = "true";
			}

			// Aplicar orden si está presente
			if (params["orden"]) {
				this.ordenSeleccionado = params["orden"];
			}

			// Cargar los datos con los filtros aplicados
			this.cargarActivos();
		});

		this.cargarDatosAuxiliares();

		// Configuración del debounce para la barra de búsqueda
		this.searchSubject
			.pipe(
				debounceTime(500), // Espera 500ms después del último cambio en la barra de búsqueda
				switchMap((term) => {
					console.log("Término enviado al backend:", term);
					this.searchTerm = term;
					this.paginaActual = 1;
					return this.activoService.getActivos(
						this.paginaActual,
						this.limitePorPagina,
						this.searchTerm,
					);
				}),
			)
			.subscribe({
				next: (response) => {
					console.log("Respuesta del backend recibida:", response);
					this.activos = response.data; // Actualiza la lista de activos
					this.pagination = response.pagination; // Actualiza la paginación
				},
				error: (error) => {
					// Ejem. Si el backend devuelve { error: "Error al cargar los activos" }
					const errorMessage =
						error.error?.error || "Error al cargar los activos";
					// Mostrar el mensaje
					this.errorMessage = errorMessage;
					console.error("Error del backend:", errorMessage);
					alert(errorMessage);
				},
			});
	}

	/**
	 * Carga los activos desde el backend.
	 */
	cargarActivos(): void {
		console.group("Cargando activos");
		console.log("Parámetros actuales:", {
			página: this.paginaActual,
			límite: this.limitePorPagina,
			filtro: this.filtroSeleccionado,
			opción: this.opcionSeleccionada,
			orden: this.ordenSeleccionado,
		});

		this.activoService
			.getActivos(
				this.paginaActual,
				this.limitePorPagina,
				this.searchTerm,
				this.filtroSeleccionado,
				this.opcionSeleccionada,
				this.ordenSeleccionado,
			)
			.subscribe({
				next: (response) => {
					console.log("Respuesta del backend:", response);
					this.activos = response.data;
					this.pagination = response.pagination;
					console.groupEnd();
				},
				error: (error) => {
					// Ejem. Si el backend devuelve { error: "Error al cargar los activos" }
					const errorMessage =
						error.error?.error || "Error al cargar los activos";
					// Mostrar el mensaje
					this.errorMessage = errorMessage;
					console.error("Error del backend:", errorMessage);
					alert(errorMessage);
				},
			});
	}

	/**
	 * Carga los datos auxiliares
	 */
	cargarDatosAuxiliares(): void {
		this.datosService.obtenerDatosAuxiliares().subscribe({
			next: (response) => {
				console.log("Datos auxiliares cargados:", response);
				this.datosAuxiliares = response;
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

	/**
	 * Divide el texto en partes resaltadas y no resaltadas.
	 * @param texto Texto a dividir.
	 * @returns Array de strings con las partes resaltadas y no resaltadas.
	 */
	dividirTexto(texto: string): string[] {
		if (!this.searchTerm || !texto) return [texto]; // Si no hay término de búsqueda o texto, devuelve el texto completo
		const regex = new RegExp(`(${this.searchTerm})`, "gi");
		return texto.split(regex).filter(Boolean); // Divide el texto usando el término de búsqueda
	}

	// Maneja el cambio en la barra de búsqueda
	onSearchInput(event: Event): void {
		const inputElement = event.target as HTMLInputElement; // Casting seguro
		this.searchTerm = inputElement.value; // Obtiene el valor
		this.onSearchChange(inputElement.value); // Llama a la función de búsqueda
	}

	/**
	 * Verifica si una palabra debe ser resaltada.
	 * @param palabra Palabra a verificar.
	 * @returns `true` si la palabra coincide con el término de búsqueda, `false` en caso contrario.
	 */
	esParteResaltada(palabra: string): boolean {
		if (!this.searchTerm) return false; // Si no hay término de búsqueda, no hay nada que resaltar
		const regex = new RegExp(`^${this.searchTerm}$`, "i");
		return regex.test(palabra); // Compara la palabra con el término de búsqueda
	}

	/**
	 * Navega a la página de detalles del activo.
	 * @param id ID del activo seleccionado.
	 */
	verDetalles(id: number): void {
		this.router.navigate(["/gestion-activos/detalle", id]); // Navega a la página de detalles
	}

	/**
	 * Actualiza el término de búsqueda y carga los datos correspondientes.
	 * @param term Término de búsqueda.
	 */

	// Maneja el cambio en la barra de búsqueda
	onSearchChange(term: string): void {
		this.searchTerm = term;
		this.paginaActual = 1;
		this.searchSubject.next(term);
	}

	/**
	 * Cambia el límite de activos por página.
	 * @param limite Nuevo límite por página.
	 */
	cambiarLimitePorPagina(limite: string): void {
		this.limitePorPagina = parseInt(limite, 10); // Convierte el límite a número
		this.paginaActual = 1; // Resetea a la primera página
		this.cargarActivos(); // Recarga los datos con el nuevo límite
	}

	/**
	 * Cambia la página actual.
	 * @param pagina Número de página a mostrar.
	 */
	cambiarPagina(pagina: number): void {
		if (pagina >= 1 && pagina <= this.pagination.totalPages) {
			this.paginaActual = pagina; // Actualiza la página actual
			this.cargarActivos(); // Recarga los datos para la nueva página
		}
	}

	/**
	 * Calcula el primer activo mostrado en la tabla.
	 */
	get primerActivoMostrado(): number {
		return (this.paginaActual - 1) * this.limitePorPagina + 1;
	}

	/**
	 * Calcula el último activo mostrado en la tabla.
	 */
	get ultimoActivoMostrado(): number {
		return Math.min(
			this.paginaActual * this.limitePorPagina,
			this.pagination.total,
		);
	}

	/**
	 * Genera un array de páginas visibles para la paginación.
	 */
	get paginasVisibles(): number[] {
		const totalPaginas = this.pagination.totalPages;
		const rango = 5; // Máximo de páginas visibles
		let inicio = Math.max(1, this.paginaActual - Math.floor(rango / 2));
		let fin = Math.min(totalPaginas, inicio + rango - 1);

		if (fin - inicio + 1 < rango) {
			inicio = Math.max(1, fin - rango + 1);
		}

		return Array.from({ length: fin - inicio + 1 }, (_, i) => inicio + i); // Genera un array de páginas visibles
	}

	/**
	 * Maneja el cambio en el selector de límite por página.
	 * @param event Evento de cambio en el selector.
	 */
	onLimitChange(event: Event): void {
		const selectElement = event.target as HTMLSelectElement; // Obtiene el valor seleccionado
		this.cambiarLimitePorPagina(selectElement.value); // Actualiza el límite por página
	}

	/**
	 * Carga las opciones dinámicas según el filtro seleccionado
	 * @param event Evento del select de filtro
	 */
	cargarOpcionesFiltro(event: Event): void {
		this.filtroSeleccionado = (event.target as HTMLSelectElement).value; // Guarda el tipo de filtro
		console.log(
			"[FILTRO] Tipo de filtro seleccionado:",
			this.filtroSeleccionado,
		);

		const opcionesSelect = document.getElementById(
			"opciones",
		) as HTMLSelectElement;

		// Limpiar opciones existentes
		while (opcionesSelect.options.length > 1) {
			opcionesSelect.remove(1);
		}

		let opciones: any[] = [];

		switch (
			this.filtroSeleccionado // Usamos la variable guardada
		) {
			case "estado":
				opciones = this.datosAuxiliares?.estados || [];
				break;
			case "tipo":
				opciones = this.datosAuxiliares?.tipos || [];
				break;
			case "ubicacion":
				opciones = this.datosAuxiliares?.ubicaciones || [];
				break;
			case "usuario_asignado":
				opciones = this.datosAuxiliares?.duenos || [];
				break;
			default:
				return;
		}

		console.log("[FILTRO] Opciones cargadas:", opciones);
		opciones.forEach((opcion) => {
			const optionElement = document.createElement("option");
			optionElement.value = opcion.id;
			optionElement.textContent = opcion.nombre || opcion.descripcion;
			opcionesSelect.appendChild(optionElement);
		});
	}

	/**
	 * Limpia los filtros aplicados y recarga los activos
	 */

	limpiarFiltros(): void {
		this.searchTerm = "";
		this.filtroSeleccionado = "";
		this.opcionSeleccionada = "";
		this.ordenSeleccionado = "asc";
		this.paginaActual = 1;

		// Resetear controles del formulario
		const searchInput = document.querySelector(
			'input[type="text"]',
		) as HTMLInputElement;
		if (searchInput) searchInput.value = "";

		const filtroSelect = document.getElementById("filtro") as HTMLSelectElement;
		if (filtroSelect) filtroSelect.value = "";

		const opcionesSelect = document.getElementById(
			"opciones",
		) as HTMLSelectElement;
		if (opcionesSelect) opcionesSelect.value = "";

		this.cargarActivos();
	}

	/**
	 * Aplica el filtro seleccionado y recarga los activos
	 * @param event Evento del select de filtro
	 */
	aplicarFiltro(event: Event): void {
		this.opcionSeleccionada = (event.target as HTMLSelectElement).value;
		console.log("[FILTRO] Aplicando filtro:", {
			tipo: this.filtroSeleccionado,
			valor: this.opcionSeleccionada,
		});
		this.paginaActual = 1;
		this.cargarActivos();
	}

	/**
	 * Aplica el orden seleccionado y recarga los activos
	 * @param event Evento del select de orden
	 */
	aplicarOrden(event: Event): void {
		this.ordenSeleccionado = (event.target as HTMLSelectElement).value;
		this.cargarActivos();
	}
}
