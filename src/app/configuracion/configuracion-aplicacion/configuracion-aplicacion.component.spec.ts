import { type ComponentFixture, TestBed } from "@angular/core/testing";

import { ConfiguracionAplicacionComponent } from "./configuracion-aplicacion.component";

describe("ConfiguracionAplicacionComponent", () => {
	let component: ConfiguracionAplicacionComponent;
	let fixture: ComponentFixture<ConfiguracionAplicacionComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ConfiguracionAplicacionComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(ConfiguracionAplicacionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
