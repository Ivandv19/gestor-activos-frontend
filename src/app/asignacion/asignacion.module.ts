import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { ActivosAsignadosComponent } from "./activos-asignados/activos-asignados.component";
import { ActivosDisponiblesComponent } from "./activos-disponibles/activos-disponibles.component";
import { AsignacionRoutingModule } from "./asignacion-routing.module";
import { AsignarActivoComponent } from "./asignar-activo/asignar-activo.component";
import { EditarAsignacionComponent } from "./editar-asignacion/editar-asignacion.component";
import { ListaAsignacionesComponent } from "./lista-asignaciones/lista-asignaciones.component";

@NgModule({
	declarations: [
		ListaAsignacionesComponent,
		ActivosDisponiblesComponent,
		ActivosAsignadosComponent,
		AsignarActivoComponent,
		EditarAsignacionComponent,
	],
	imports: [
		CommonModule,
		AsignacionRoutingModule,
		HttpClientModule,
		NgSelectModule,
		ReactiveFormsModule,
	],
})
export class AsignacionModule {}
