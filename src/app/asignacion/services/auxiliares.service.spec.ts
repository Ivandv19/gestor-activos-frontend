import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";

import { AuxiliaresService } from "./auxiliares.service";

describe("AuxiliaresService", () => {
	let service: AuxiliaresService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
		});
		service = TestBed.inject(AuxiliaresService);
	});

	it("should be created", () => {
		expect(service).toBeTruthy();
	});
});
