import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { ActivoRoutingModule } from "./activo-routing.module";
import { ListaActivosComponent } from "./lista-activos/lista-activos.component";
import { DetalleActivoComponent } from "./detalle-activo/detalle-activo.component";
import { HistorialActivoComponent } from "./historial-activo/historial-activo.component";
import { AgregarActivoComponent } from "./agregar-activo/agregar-activo.component";
import { EditarActivoComponent } from "./editar-activo/editar-activo.component";
import { NgSelectModule } from "@ng-select/ng-select";

@NgModule({
	declarations: [
		ListaActivosComponent,
		DetalleActivoComponent,
		HistorialActivoComponent,
		AgregarActivoComponent,
		EditarActivoComponent,
	],
	imports: [
		CommonModule,
		ActivoRoutingModule,
		ReactiveFormsModule,
		NgSelectModule,
	],
})
export class ActivoModule {}
