import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { ReporteComponent } from "./reporte/reporte.component";
import { ReporteRoutingModule } from "./reporte-routing.module";

@NgModule({
	declarations: [ReporteComponent],
	imports: [
		CommonModule,
		ReporteRoutingModule,
		HttpClientModule,
		NgSelectModule,
		ReactiveFormsModule,
	],
})
export class ReporteModule {}
