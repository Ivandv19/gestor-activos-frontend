import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfiguracionAplicacionComponent } from './configuracion-aplicacion/configuracion-aplicacion.component';


const routes: Routes = [
  {
    path: '', // Ruta vacía para el componente principal
    component: ConfiguracionAplicacionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfiguracionRoutingModule {}
