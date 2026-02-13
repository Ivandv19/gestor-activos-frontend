import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { ConfiguracionAplicacionComponent } from "./configuracion-aplicacion/configuracion-aplicacion.component";
import { ConfiguracionRoutingModule } from "./configuracion-routing.module";

@NgModule({
	declarations: [ConfiguracionAplicacionComponent],
	imports: [
		CommonModule,
		ConfiguracionRoutingModule,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		NgSelectModule,
	],
})
export class ConfiguracionModule {}
