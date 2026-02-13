import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { ActivoRoutingModule } from "./activo-routing.module";
import { AgregarActivoComponent } from "./agregar-activo/agregar-activo.component";
import { DetalleActivoComponent } from "./detalle-activo/detalle-activo.component";
import { EditarActivoComponent } from "./editar-activo/editar-activo.component";
import { HistorialActivoComponent } from "./historial-activo/historial-activo.component";
import { ListaActivosComponent } from "./lista-activos/lista-activos.component";

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
