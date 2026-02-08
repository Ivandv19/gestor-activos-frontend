import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { PanelControlComponent } from "./panel-control/panel-control.component";
import { ResumenActivosComponent } from "./resumen-activos/resumen-activos.component";
import { AlertasComponent } from "./alertas/alertas.component";

@NgModule({
	declarations: [
		PanelControlComponent,
		ResumenActivosComponent,
		AlertasComponent,
	],
	imports: [CommonModule, RouterModule, DashboardRoutingModule],
})
export class DashboardModule {}
