import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";

import { ConfiguracionService } from "./configuracion.service";

describe("ConfiguracionService", () => {
	let service: ConfiguracionService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
		});
		service = TestBed.inject(ConfiguracionService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});
});
