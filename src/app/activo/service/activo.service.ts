import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ActivoService {
  private apiUrl = 'http://localhost:3000/gestion-activos';

  constructor(private http: HttpClient) {}

  // Obtener activos con búsqueda y paginación
  getActivos(
    page: number = 1,
    limit: number = 10,
    searchTerm: string = '',
    filtro?: string,
    valorFiltro?: string,
    orden?: string
  ): Observable<any> {
    // Construir parámetros con logs detallados
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (searchTerm) {
      console.log('[SERVICE] Aplicando búsqueda:', searchTerm);
      params = params.set('search', searchTerm);
    }

    if (filtro && valorFiltro) {
      console.log('[SERVICE] Aplicando filtro:', {
        tipo: filtro,
        valor: valorFiltro,
      });
      params = params.set(filtro, valorFiltro);
    }

    if (orden) {
      console.log('[SERVICE] Aplicando orden:', orden);
      params = params.set('orden', orden);
    }

    console.log('[SERVICE] Parámetros finales:', params.toString());
    return this.http.get(`${this.apiUrl}/activos`, { params });
  }

  // Obtener un activo por ID
  getActivoById(id: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/activos/${id}`);
  }

  // Crear un nuevo activo
  createActivo(activo: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/activos`, activo);
  }

  // Actualizar un activo existente
  updateActivo(id: number, activo: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/activos/${id}`, activo);
  }

  // Eliminar un activo
  deleteActivo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/activos/${id}`);
  }

  darDeBajaActivo(
    id: number
  ): Observable<{ success: boolean; message: string }> {
    return this.http.patch<{ success: boolean; message: string }>(
      `${this.apiUrl}/baja/${id}`,
      {}
    );
  }

  //  método para subir imágenes
  subirImagen(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }
}
