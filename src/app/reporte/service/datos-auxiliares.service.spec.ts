import { TestBed } from "@angular/core/testing";

import { DatosAuxiliaresService } from "./datos-auxiliares.service";

describe("DatosAuxiliaresService", () => {
	let service: DatosAuxiliaresService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(DatosAuxiliaresService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});
});
