import { ComponentFixture, TestBed } from "@angular/core/testing";

import { AsignarActivoComponent } from "./asignar-activo.component";

describe("AsignarActivoComponent", () => {
	let component: AsignarActivoComponent;
	let fixture: ComponentFixture<AsignarActivoComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [AsignarActivoComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(AsignarActivoComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
