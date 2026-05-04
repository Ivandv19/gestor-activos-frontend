import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { AuthGuard } from "./services/auth-guard.service";
import { RoleGuard } from "./services/role-guard.service";

const routes: Routes = [
	{
		path: "login",
		title: "Iniciar Sesión | Gestor de Activos",
		loadChildren: () =>
			import("./login/login.module").then((m) => m.LoginModule),
	},
	{
		path: "dashboard",
		title: "Panel de Control | Gestor de Activos",
		loadChildren: () =>
			import("./dashboard/dashboard.module").then((m) => m.DashboardModule),
		canActivate: [AuthGuard],
	},
	{
		path: "gestion-activos",
		title: "Inventario de Activos | Gestor de Activos",
		loadChildren: () =>
			import("./activo/activo.module").then((m) => m.ActivoModule),
		canActivate: [AuthGuard],
	},
	{
		path: "asignaciones",
		title: "Asignaciones | Gestor de Activos",
		loadChildren: () =>
			import("./asignacion/asignacion.module").then((m) => m.AsignacionModule),
		canActivate: [AuthGuard],
	},
	{
		path: "reportes",
		title: "Reportes Gerenciales | Gestor de Activos",
		loadChildren: () =>
			import("./reporte/reporte.module").then((m) => m.ReporteModule),
		canActivate: [AuthGuard, RoleGuard],
		data: { expectedRole: "Administrador" },
	},
	{
		path: "configuracion",
		title: "Configuración | Gestor de Activos",
		loadChildren: () =>
			import("./configuracion/configuracion.module").then(
				(m) => m.ConfiguracionModule,
			),
		canActivate: [AuthGuard, RoleGuard],
		data: { expectedRole: "Administrador" },
	},

	{ path: "", redirectTo: "login", pathMatch: "full" },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
