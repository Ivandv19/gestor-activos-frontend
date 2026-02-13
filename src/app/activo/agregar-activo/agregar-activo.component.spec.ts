import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AgregarActivoComponent } from "./agregar-activo.component";

describe("AgregarActivoComponent", () => {
	let component: AgregarActivoComponent;
	let fixture: ComponentFixture<AgregarActivoComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [AgregarActivoComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(AgregarActivoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
