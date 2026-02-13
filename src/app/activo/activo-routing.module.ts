import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AgregarActivoComponent } from "./agregar-activo/agregar-activo.component"; // Componente para agregar un nuevo activo
import { DetalleActivoComponent } from "./detalle-activo/detalle-activo.component"; // Componente para mostrar detalles de un activo
import { EditarActivoComponent } from "./editar-activo/editar-activo.component"; // Componente para editar un activo existente
import { HistorialActivoComponent } from "./historial-activo/historial-activo.component"; // Componente para mostrar historial de un activo
import { ListaActivosComponent } from "./lista-activos/lista-activos.component"; // Componente para listar activos

const routes: Routes = [
	{ path: "", component: ListaActivosComponent }, // Página principal: lista de activos
	{ path: "detalle/:id", component: DetalleActivoComponent }, // Detalles de un activo específico
	{ path: "historial/:id", component: HistorialActivoComponent }, // Historial de un activo
	{ path: "agregar", component: AgregarActivoComponent }, // Formulario para agregar un activo
	{ path: "editar/:id", component: EditarActivoComponent }, // Formulario para editar un activo
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ActivoRoutingModule {}
