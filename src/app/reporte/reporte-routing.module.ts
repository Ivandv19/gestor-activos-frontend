import { NgModule } from "@angular/core";
import { RouterModule, type Routes } from "@angular/router";
import { ReporteComponent } from "./reporte/reporte.component";

const routes: Routes = [
	{
		path: "", // Ruta vacía para el componente principal
		component: ReporteComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)], // Usamos forChild porque no es el módulo raíz
	exports: [RouterModule],
})
export class ReporteRoutingModule {}
