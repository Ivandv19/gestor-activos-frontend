import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { AsignacionModule } from "./asignacion/asignacion.module";
import { ConfiguracionModule } from "./configuracion/configuracion.module";
import { DashboardModule } from "./dashboard/dashboard.module";
import { LoginModule } from "./login/login.module";
import { AuthInterceptor } from "./login/services/auth-interceptor.service";
import { NavigationModule } from "./navigation/navigation.module";
import { ReporteModule } from "./reporte/reporte.module";
import { FooterComponent } from "./shared/footer/footer.component";
import { HeaderComponent } from "./shared/header/header.component";

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		LoginModule,
		DashboardModule,
		HeaderComponent,
		FooterComponent,
		NavigationModule,
		AsignacionModule,
		ReporteModule,
		ConfiguracionModule,
		MatSnackBarModule,
	],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: AuthInterceptor,
			multi: true,
		},
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
