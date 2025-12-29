import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfiguracionAplicacionComponent } from './configuracion-aplicacion/configuracion-aplicacion.component';
import { ConfiguracionRoutingModule } from './configuracion-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [ConfiguracionAplicacionComponent],
  imports: [
    CommonModule,
    ConfiguracionRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule
  ],
})
export class ConfiguracionModule {}
