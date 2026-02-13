import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ListaAsignacionesComponent } from "./lista-asignaciones.component";

describe("ListaAsignacionesComponent", () => {
	let component: ListaAsignacionesComponent;
	let fixture: ComponentFixture<ListaAsignacionesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ListaAsignacionesComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(ListaAsignacionesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
