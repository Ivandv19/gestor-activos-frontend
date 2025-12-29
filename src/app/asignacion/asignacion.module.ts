import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListaAsignacionesComponent } from './lista-asignaciones/lista-asignaciones.component';
import { ActivosDisponiblesComponent } from './activos-disponibles/activos-disponibles.component';
import { ActivosAsignadosComponent } from './activos-asignados/activos-asignados.component';
import { AsignarActivoComponent } from './asignar-activo/asignar-activo.component';
import { EditarAsignacionComponent } from './editar-asignacion/editar-asignacion.component';
import { AsignacionRoutingModule } from './asignacion-routing.module';
import { HttpClientModule } from '@angular/common/http'; 
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ListaAsignacionesComponent,
    ActivosDisponiblesComponent,
    ActivosAsignadosComponent,
    AsignarActivoComponent,
    EditarAsignacionComponent
  ],
  imports: [
    CommonModule,
    AsignacionRoutingModule,
    HttpClientModule,
    NgSelectModule,
    ReactiveFormsModule
  ]
})
export class AsignacionModule { }
