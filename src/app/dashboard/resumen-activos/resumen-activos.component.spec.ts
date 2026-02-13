import { type ComponentFixture, TestBed } from "@angular/core/testing";

import { ResumenActivosComponent } from "./resumen-activos.component";

describe("ResumenActivosComponent", () => {
	let component: ResumenActivosComponent;
	let fixture: ComponentFixture<ResumenActivosComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ResumenActivosComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(ResumenActivosComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
