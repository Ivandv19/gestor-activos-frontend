import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { ConfiguracionAplicacionComponent } from "./configuracion-aplicacion/configuracion-aplicacion.component";
import { ConfiguracionRoutingModule } from "./configuracion-routing.module";

@NgModule({
	declarations: [ConfiguracionAplicacionComponent],
	imports: [
		CommonModule,
		ConfiguracionRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		NgSelectModule,
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ConfiguracionModule {}
