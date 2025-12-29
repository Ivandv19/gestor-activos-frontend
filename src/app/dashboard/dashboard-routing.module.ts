import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PanelControlComponent } from './panel-control/panel-control.component';

const routes: Routes = [
  { path: '', component: PanelControlComponent }, // Ruta principal del dashboard
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
