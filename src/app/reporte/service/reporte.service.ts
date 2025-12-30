import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  private apiUrl = `${environment.apiUrl}/reportes`;
  constructor(private http: HttpClient) {}

  //Metodo para obtener los tipos de reporte
  getTiposReporte(): Observable<any> {
    console.log('[SERVICE] Llamando al backend para obtener tipos de reporte...');
    return this.http.get(`${this.apiUrl}/tipos`);
  }

  // Método para generar un reporte específico
  generarReporte(tipo_id: number, filtros: any): Observable<any> {
    console.log('[SERVICE] Llamando al backend para generar un reporte...');
    const body = {
      tipo_id,
      filtros
    };
    return this.http.post(`${this.apiUrl}/generar`, body);
  }
}
