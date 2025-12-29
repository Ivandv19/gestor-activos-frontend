import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class DatosService {
  private apiUrl = 'http://localhost:3000/gestion-activos';

  constructor(private http: HttpClient) {}

  // Método para obtener datos auxiliares
  obtenerDatosAuxiliares(): Observable<any> {
    return this.http.get(`${this.apiUrl}/datos-auxiliares`);
  }

  // Método para obtener datos de activos
  validarEtiquetaSerial(etiquetaSerial: string) {
    return this.http.post(`${this.apiUrl}/validar-etiqueta-serial`, { etiqueta_serial: etiquetaSerial });
  }
}
