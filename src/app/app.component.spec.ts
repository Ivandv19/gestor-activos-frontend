import { TestBed, waitForAsync } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AppComponent } from "./app.component";
import { AuthService } from "./login/services/auth.service";

describe("AppComponent", () => {
	let authServiceMock: any;

	beforeEach(waitForAsync(() => {
		authServiceMock = {
			isLoggedIn: jest.fn().mockReturnValue(false)
		};

		TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			declarations: [AppComponent],
			providers: [
				{ provide: AuthService, useValue: authServiceMock }
			]
		}).compileComponents();
	}));

	it("should create the app", () => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.componentInstance;
		expect(app).toBeTruthy();
	});

	// Removed title check as the component doesn't have a title property

	it("should render title", () => {
		const fixture = TestBed.createComponent(AppComponent);
		fixture.detectChanges();
		const compiled = fixture.nativeElement as HTMLElement;
		expect(compiled.querySelector("h1")?.textContent).toContain(
			"Hello, gestor-activos-frontend"
		);
	});
});
