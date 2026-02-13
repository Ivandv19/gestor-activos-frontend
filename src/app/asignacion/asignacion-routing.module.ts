import { NgModule } from "@angular/core";
import { RouterModule, type Routes } from "@angular/router";
import { ActivosAsignadosComponent } from "./activos-asignados/activos-asignados.component";
import { ActivosDisponiblesComponent } from "./activos-disponibles/activos-disponibles.component";
import { AsignarActivoComponent } from "./asignar-activo/asignar-activo.component";
import { EditarAsignacionComponent } from "./editar-asignacion/editar-asignacion.component";
// Componentes del módulo
import { ListaAsignacionesComponent } from "./lista-asignaciones/lista-asignaciones.component";

// Definición de las rutas
const routes: Routes = [
	{ path: "", component: ListaAsignacionesComponent }, // Ruta principal (/asignaciones)
	{ path: "asignar/:id", component: AsignarActivoComponent }, // Ruta independiente (/asignaciones/asignar)
	{ path: "editar/:id", component: EditarAsignacionComponent }, // Ruta independiente (/asignaciones/editar/:id)
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class AsignacionRoutingModule {}
