import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";

import { DatosAuxiliaresService } from "./datos-auxiliares.service";

describe("DatosAuxiliaresService", () => {
	let service: DatosAuxiliaresService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
		});
		service = TestBed.inject(DatosAuxiliaresService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});
});
