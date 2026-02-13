import {
	Component,
	type ElementRef,
	type OnInit,
	ViewChild,
} from "@angular/core";
import {
	ArcElement,
	BarController,
	BarElement,
	CategoryScale,
	Chart,
	Legend,
	LinearScale,
	PieController,
	Tooltip,
} from "chart.js";
import type { DashboardService } from "../services/dashboard.service";

// Registrar componentes necesarios de Chart.js
Chart.register(
	PieController,
	BarController,
	CategoryScale,
	LinearScale,
	ArcElement,
	Tooltip,
	Legend,
	BarElement,
);

@Component({
	selector: "app-resumen-activos",
	standalone: false,
	templateUrl: "./resumen-activos.component.html",
	styleUrl: "./resumen-activos.component.css",
})
export class ResumenActivosComponent implements OnInit {
	totalActivos: number = 0; // Total de activos registrados
	activosAsignados: number = 0; // Activos asignados
	activosDisponibles: number = 0; // Activos disponibles
	tendenciaMensualData: { labels: string[]; data: number[] } = {
		labels: [],
		data: [],
	}; // Datos de la tendencia mensual
	anoTendencia: number = new Date().getFullYear(); // Año que abarca la tendencia
	errorMessage = ""; // Mensaje de error en caso de fallo

	@ViewChild("activosVsDisponibles") activosVsDisponibles!: ElementRef; // Referencia al gráfico de activos vs disponibles
	@ViewChild("tendenciaMensual") tendenciaMensual!: ElementRef; // Referencia al gráfico de tendencia mensual

	constructor(private dashboardService: DashboardService) {}

	ngOnInit(): void {
		this.cargarDatosBackend(); // Cargar datos desde el backend al inicializar
	}

	/**
	 * Obtiene los datos del backend y actualiza las propiedades del componente.
	 */
	private cargarDatosBackend(): void {
		this.dashboardService.getResumen().subscribe({
			next: (response) => {
				console.log("Datos recibidos del backend:", response); // Log para verificar los datos

				// Asignar estadísticas generales
				this.totalActivos = Number(response.total_activos) || 0;
				this.activosAsignados = Number(response.activos_asignados) || 0;
				this.activosDisponibles = Number(response.activos_disponibles) || 0;

				// Asignar datos de tendencia mensual
				if (response.tendencia_mensual) {
					this.tendenciaMensualData = {
						labels: response.tendencia_mensual.labels || [],
						data: response.tendencia_mensual.data || [],
					};
					console.log(
						"Datos de tendencia mensual cargados:",
						this.tendenciaMensualData,
					);
				}

				// Asignar el año de la tendencia
				this.anoTendencia = response.ano_tendencia || new Date().getFullYear();
				console.log(`Año de la tendencia: ${this.anoTendencia}`); // Log para verificar el año

				// Inicializar gráficas
				this.initGraficoActivosVsDisponibles();
				this.initGraficoTendenciaMensual();
			},
			error: (error) => {
				// Ejem. Si el backend devuelve { mensaje: "Error al actualizar la asignación" }
				const errorMessage =
					error.error?.mensaje || "Error al actualizar la asignación";

				// Mostrar el mensaje
				this.errorMessage = errorMessage;
				console.error("Error del backend:", errorMessage);
				alert(errorMessage);
			},
		});
	}

	/**
	 * Inicializa el gráfico de pastel para comparar activos asignados vs disponibles.
	 */
	private initGraficoActivosVsDisponibles(): void {
		const canvas = this.activosVsDisponibles.nativeElement;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Forzar dimensiones del canvas
		canvas.width = 515;
		canvas.height = 300;

		// Calcular porcentajes
		const porcentajeAsignados =
			((this.activosAsignados / this.totalActivos) * 100).toFixed(2) || "0.00";
		const porcentajeDisponibles =
			((this.activosDisponibles / this.totalActivos) * 100).toFixed(2) ||
			"0.00";

		// Crear gráfico de pastel
		new Chart(ctx, {
			type: "pie",
			data: {
				labels: [
					`Asignados (${porcentajeAsignados}%)`,
					`Disponibles (${porcentajeDisponibles}%)`,
				],
				datasets: [
					{
						label: "Cantidad",
						data: [this.activosAsignados, this.activosDisponibles],
						backgroundColor: ["#36A2EB", "#FF6384"],
						borderColor: ["#36A2EB", "#FF6384"],
						borderWidth: 1,
					},
				],
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: { display: true },
					tooltip: {
						callbacks: {
							label: (context: any) => {
								const label = context.label || "";
								const value = context.raw || 0;
								return `${label}: ${value}`;
							},
						},
					},
				},
			},
		});
	}

	/**
	 * Inicializa el gráfico de barras para mostrar la tendencia mensual de activos.
	 */
	private initGraficoTendenciaMensual(): void {
		const ctx = this.tendenciaMensual.nativeElement.getContext("2d");
		if (!ctx) return;

		// Crear gráfico de barras
		new Chart(ctx, {
			type: "bar",
			data: {
				labels: this.tendenciaMensualData.labels,
				datasets: [
					{
						label: "Activos registrados",
						data: this.tendenciaMensualData.data,
						backgroundColor: "rgba(54, 162, 235, 0.6)",
						borderColor: "#36A2EB",
						borderWidth: 1,
					},
				],
			},
			options: {
				responsive: true,
				plugins: {
					title: {
						display: true,
						text: `Tendencia Mensual de Activos (Últimos 12 meses)`,
						font: {
							size: 16,
						},
					},
					tooltip: {
						callbacks: {
							label: (context: any) => {
								const label = context.label || "";
								const value = context.raw || 0;
								return `${label}: ${value} activos`;
							},
						},
					},
					legend: {
						display: true,
					},
				},
				scales: {
					y: {
						beginAtZero: true,
					},
				},
			},
		});
	}
}
