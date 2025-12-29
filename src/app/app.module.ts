import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginModule } from './login/login.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { NavigationModule } from './navigation/navigation.module';
import { AuthInterceptor } from './login/services/auth-interceptor.service';
import { AsignacionModule } from './asignacion/asignacion.module';
import { ReporteModule } from './reporte/reporte.module';
import { ConfiguracionModule } from './configuracion/configuracion.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    LoginModule,
    DashboardModule,
    HeaderComponent,
    FooterComponent,
    NavigationModule,
    AsignacionModule,
    ReporteModule,
    ConfiguracionModule,
    MatSnackBarModule

  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
