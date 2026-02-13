import { type ComponentFixture, TestBed } from "@angular/core/testing";

import { ActivosDisponiblesComponent } from "./activos-disponibles.component";

describe("ActivosDisponiblesComponent", () => {
	let component: ActivosDisponiblesComponent;
	let fixture: ComponentFixture<ActivosDisponiblesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ActivosDisponiblesComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(ActivosDisponiblesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
