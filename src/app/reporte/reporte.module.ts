import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReporteComponent } from './reporte/reporte.component';
import { ReporteRoutingModule } from './reporte-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ReporteComponent
  ],
  imports: [
    CommonModule,
    ReporteRoutingModule,
    HttpClientModule,
    NgSelectModule,
    ReactiveFormsModule
  ],

})
export class ReporteModule { }
