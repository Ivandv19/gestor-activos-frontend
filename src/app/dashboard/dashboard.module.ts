import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AlertasComponent } from "./alertas/alertas.component";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { PanelControlComponent } from "./panel-control/panel-control.component";
import { ResumenActivosComponent } from "./resumen-activos/resumen-activos.component";

@NgModule({
	declarations: [
		PanelControlComponent,
		ResumenActivosComponent,
		AlertasComponent,
	],
	imports: [CommonModule, RouterModule, DashboardRoutingModule],
})
export class DashboardModule {}
