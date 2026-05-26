import {
	HttpClientTestingModule,
	HttpTestingController,
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import {
	DashboardAlertasResponse,
	DashboardResumen,
} from "../../models/dashboard.interface";
import { DashboardService } from "./dashboard.service";

describe("DashboardService", () => {
	let service: DashboardService;
	let httpMock: HttpTestingController;
	const apiUrl = "http://localhost:3030/api";

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [DashboardService],
		});
		service = TestBed.inject(DashboardService);
		httpMock = TestBed.inject(HttpTestingController);
	});

	afterEach(() => {
		httpMock.verify();
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});

	describe("getResumen", () => {
		it("should return DashboardResumen", (done) => {
			const mockResponse: DashboardResumen = {
				data: {
					total_activos: 10,
					activos_disponibles: 4,
					activos_asignados: 3,
					activos_en_mantenimiento: 2,
					activos_dados_de_baja: 1,
					tendencia_mensual: {
						labels: ["Ene", "Feb", "Mar"],
						data: [1, 2, 3],
					},
					ano_tendencia: 2025,
				},
			};

			service.getResumen().subscribe((response) => {
				expect(response).toEqual(mockResponse);
				expect(response.data.total_activos).toBe(10);
				expect(response.data.activos_disponibles).toBe(4);
				done();
			});

			const req = httpMock.expectOne(`${apiUrl}/dashboard/resumen`);
			expect(req.request.method).toBe("GET");
			req.flush(mockResponse);
		});

		it("should return zeros when no activos", (done) => {
			const mockResponse: DashboardResumen = {
				data: {
					total_activos: 0,
					activos_disponibles: 0,
					activos_asignados: 0,
					activos_en_mantenimiento: 0,
					activos_dados_de_baja: 0,
					tendencia_mensual: { labels: [], data: [] },
					ano_tendencia: 2025,
				},
			};

			service.getResumen().subscribe((response) => {
				expect(response.data.total_activos).toBe(0);
				expect(response.data.tendencia_mensual?.labels).toEqual([]);
				done();
			});

			const req = httpMock.expectOne(`${apiUrl}/dashboard/resumen`);
			expect(req.request.method).toBe("GET");
			req.flush(mockResponse);
		});
	});

	describe("getAlertas", () => {
		it("should return DashboardAlertasResponse", (done) => {
			const mockResponse: DashboardAlertasResponse = {
				data: {
					licencias_proximas_a_vencer: 3,
					garantias_proximas_a_expirar: 5,
					activos_en_mantenimiento: 2,
					activos_proximos_a_devolver: 4,
				},
			};

			service.getAlertas().subscribe((response) => {
				expect(response).toEqual(mockResponse);
				expect(response.data.licencias_proximas_a_vencer).toBe(3);
				expect(response.data.garantias_proximas_a_expirar).toBe(5);
				done();
			});

			const req = httpMock.expectOne(`${apiUrl}/dashboard/alertas`);
			expect(req.request.method).toBe("GET");
			req.flush(mockResponse);
		});

		it("should return zeros when all counts are null", (done) => {
			const mockResponse: DashboardAlertasResponse = {
				data: {
					licencias_proximas_a_vencer: 0,
					garantias_proximas_a_expirar: 0,
					activos_en_mantenimiento: 0,
					activos_proximos_a_devolver: 0,
				},
			};

			service.getAlertas().subscribe((response) => {
				expect(response.data.licencias_proximas_a_vencer).toBe(0);
				done();
			});

			const req = httpMock.expectOne(`${apiUrl}/dashboard/alertas`);
			expect(req.request.method).toBe("GET");
			req.flush(mockResponse);
		});
	});
});
