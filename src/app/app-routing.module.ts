import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthGuard } from "./services/auth-guard.service";

const routes: Routes = [
	{
		path: "login", // Ruta para el login
		loadChildren: () =>
			import("./login/login.module").then((m) => m.LoginModule), // Carga perezosa
	},
	{
		path: "dashboard", // Ruta para el dashboard
		loadChildren: () =>
			import("./dashboard/dashboard.module").then((m) => m.DashboardModule),
		canActivate: [AuthGuard], // Protege esta ruta con el guardia
	},
	{
		path: "gestion-activos", //  ruta para el módulo de activos
		loadChildren: () =>
			import("./activo/activo.module").then((m) => m.ActivoModule), // Carga perezosa
		canActivate: [AuthGuard], // Protege esta ruta con el guardia
	},
	{
		path: "asignaciones", //  ruta para el módulo de activos
		loadChildren: () =>
			import("./asignacion/asignacion.module").then((m) => m.AsignacionModule), // Carga perezosa
		canActivate: [AuthGuard], // : Protege esta ruta con el guardia
	},
	{
		path: "reportes", //  ruta para el módulo de activos
		loadChildren: () =>
			import("./reporte/reporte.module").then((m) => m.ReporteModule), // Carga perezosa
		canActivate: [AuthGuard], // : Protege esta ruta con el guardia
	},
	{
		path: "configuracion", //  ruta para el módulo de activos
		loadChildren: () =>
			import("./configuracion/configuracion.module").then(
				(m) => m.ConfiguracionModule,
			), // Carga perezosa
		canActivate: [AuthGuard], // : Protege esta ruta con el guardia
	},

	{ path: "", redirectTo: "login", pathMatch: "full" }, // Redirección por defecto
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
