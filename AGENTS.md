# Gestor de Activos - Frontend Rules

Eres un experto en Angular 19. Cuando trabajes en este proyecto, sigue estas reglas.

## Core Principles

1. **NgModule-based**: Componentes con `standalone: false` (default del proyecto)
2. **TypeScript Strict**: `strict: true` en tsconfig, pero APIs tipadas como `any`
3. **CSS plano**: No SCSS/Sass, usa `*.component.css` con naming BEM-like
4. **Lazy Loading**: Todos los módulos de features se cargan lazy via routing
5. **Linter/Formatter**: Biome con tabs y double quotes (`npm run lint`, `npm run format`)
6. **Tests**: Jest con jest-preset-angular

## Code Validation

- `npm start` - Iniciar dev server (`ng serve`)
- `npm test` - Ejecutar tests Jest
- `npm run test:watch` - Jest en modo watch
- `npm run build` - Build producción
- `npm run lint` - Biome lint
- `npm run format` - Biome format

## Project Structure

```
src/
├── app/
│   ├── activo/           # Módulo de gestión de activos (CRUD + historial)
│   ├── asignacion/       # Módulo de asignaciones
│   ├── configuracion/    # Módulo de configuración
│   ├── dashboard/        # Módulo de dashboard y alertas
│   ├── login/            # Módulo de autenticación
│   ├── navigation/       # Navegación (navbar + caja-nav)
│   ├── reporte/          # Módulo de reportes
│   ├── services/         # Guards (AuthGuard, RoleGuard)
│   ├── shared/           # Componentes compartidos (header, footer)
│   └── utils/            # Utilidades (images.ts)
├── environments/         # environment.ts + environment.prod.ts
├── index.html
├── main.ts
└── styles.css            # Estilos globales
```

## Routing

| Ruta                          | Módulo        | Guards                    |
|-------------------------------|---------------|---------------------------|
| `/login`                      | LoginModule   | -                         |
| `/dashboard`                  | DashboardModule | AuthGuard               |
| `/gestion-activos`            | ActivoModule  | AuthGuard                 |
| `/gestion-activos/detalle/:id`| ActivoModule  | AuthGuard                 |
| `/gestion-activos/historial/:id`| ActivoModule | AuthGuard               |
| `/gestion-activos/agregar`    | ActivoModule  | AuthGuard + RoleGuard(Admin) |
| `/gestion-activos/editar/:id` | ActivoModule  | AuthGuard + RoleGuard(Admin) |
| `/asignaciones`               | AsignacionModule | AuthGuard              |
| `/asignaciones/asignar/:id`   | AsignacionModule | AuthGuard + RoleGuard(Admin) |
| `/asignaciones/editar/:id`    | AsignacionModule | AuthGuard + RoleGuard(Admin) |
| `/reportes`                   | ReporteModule | AuthGuard + RoleGuard(Admin) |
| `/configuracion`              | ConfiguracionModule | AuthGuard + RoleGuard(Admin) |

## Coding Conventions

### Component Pattern
```typescript
@Component({
  selector: "app-mi-componente",
  standalone: false,  // siempre false
  templateUrl: "./mi-componente.component.html",
  styleUrl: "./mi-componente.component.css",
})
export class MiComponente implements OnInit {
  constructor(private miServicio: MiServicio) {}
  ngOnInit(): void { /* fetch data */ }
}
```

### Service Pattern
```typescript
@Injectable({ providedIn: "root" })
export class MiServicio {
  private apiUrl = `${environment.apiUrl}/endpoint`;
  constructor(private http: HttpClient) {}
  getData(): Observable<any> { /* usar interface si existe, ej: Observable<LoginResponse> */ }
}
```

### Error Handling Pattern
```typescript
this.miServicio.getData().subscribe({
  next: (res) => { /* manejo exitoso */ },
  error: (err) => {
    Swal.fire({ icon: "error", text: err.error?.error || "Error desconocido" });
  },
});
```

### HTTP Interceptor
`AuthInterceptor` añade `Authorization: Bearer <token>` a todas las requests.

## UI Libraries

| Librería              | Uso                                |
|-----------------------|------------------------------------|
| SweetAlert2           | Modales, diálogos, confirmaciones  |
| @ng-select/ng-select  | Selectores desplegables            |
| Chart.js              | Gráficos del dashboard             |
| iconify-icon          | Iconos (web component)             |
| jsPDF + jspdf-autotable + html2canvas | Exportar reportes a PDF con tablas |
| mime-types            | Detección de MIME types            |
| @aws-sdk/client-s3    | Subida de imágenes a S3            |
| @angular/material     | Solo MatSnackBarModule             |

## Testing

- **Framework**: Jest + jest-preset-angular
- **Setup**: `setup-jest.ts` importa `jest-preset-angular/setup-jest`
- **Patrón básico**:
  ```typescript
  describe("MiComponente", () => {
    let component: MiComponente;
    let fixture: ComponentFixture<MiComponente>;
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [MiComponente],
      }).compileComponents();
      fixture = TestBed.createComponent(MiComponente);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    it("should create", () => expect(component).toBeTruthy());
  });
  ```

## Design System

- **Color primario**: `#141b4d` (dark navy)
- **Background**: `#fcfcfc` / `#f8f9fa`
- **Border radius**: 12px-20px
- **Fuentes**: Inter (body), Outfit (headings) via Google Fonts
- **Iconos**: iconify-icon (CDN + npm)
- **Sombras**: `box-shadow: 0 4px 6px rgba(0,0,0,0.02)`

## Known Conventions

- Auth state en localStorage (`authToken`, `user`)
- No hay NgRx ni Signals store, solo servicios con Subjects
- Componentes usan ReactiveForms (FormBuilder, FormGroup, Validators)
- `environment.apiUrl` para URL del backend
- **Todas las interfaces ya están creadas**. Quedan ~5 `any` en `reporte.interface.ts` (index signatures). Ver lista completa abajo.
- **Interfaces por archivo** en `src/app/models/`:
  - `activo.interface.ts`: `ActivoPayload`, `ActivoResponse`, `ActivoDetalleResponse`, `ActivoListItem`, `ActivoDisponibleResponse`, `GarantiaItem`, `GarantiaResponse`
  - `asignacion.interface.ts`: `AsignacionPayload`, `AsignacionResponse`
  - `auth.interface.ts`: `LoginResponse`, `UserData`, `TokenPayload`
  - `common.interface.ts`: `SubirImagenResponse`
  - `configuracion.interface.ts`: `ConfiguracionResponse`, `PerfilResponse`
  - `dashboard.interface.ts`: `DashboardResumen`, `AlertaResponse`
  - `historial.interface.ts`: `HistorialEntry`
  - `pagination.interface.ts`: `Pagination<T>`
  - `reporte.interface.ts`: `ReporteFiltros`, `GenerarReporteRequest`, `ReporteResponse`, `TiposReporteResponse`, `TipoReporte`, `DatosAuxiliaresResponse`
- **Señales (Signals)**: Usar en código nuevo (v19+). Ver tabla comparativa abajo.
- `console.log()` para debugging (no usar `console.error` a menos que sea error real)

## Tipado

- **Todas las interfaces base ya están creadas**. Quedan **5 `any`** en `reporte.interface.ts` (index signatures para datos dinámicos) y `historial.interface.ts` (`Record<string, any>` para detalles flexibles).
- Para tipado nuevo, crear interfaces en `src/app/models/` siguiendo los patrones existentes.
- Para `any` legacy, refactorizar solo si el componente se modifica (no hacer migración masiva).

## Signals vs RxJS

| Aspecto | RxJS (proyecto actual) | Signals (nuevo código) |
|---------|-------------------|---------|
| **Declaración** | `private subject = new Subject<T>()` | `miSignal = signal<T>(valorInicial)` |
| **Lectura en template** | `async \| pipe` | `miSignal()` (función) |
| **Actualización** | `subject.next(valor)` | `miSignal.set(valor)` o `.update(fn)` |
| **Derivación** | `pipe(map(...))` + `async pipe` | `computed(() => ...)` |
| **Suscripciones** | Manuales (`takeUntil`, `unsubscribe`) | Automáticas con `computed` / `effect` |
| **Side effects** | `subscribe({ next: ... })` | `effect(() => { ... })` (solo cuando es necesario) |
| **HTTP** | `http.get().subscribe()` | `http.get().pipe(toSignal())` o `resource()` |
| **Rendimiento** | `OnPush` + `async pipe` | Detección granular por defecto |
| **Recomendación** | ✅ Mantener en código legacy | ✅ Usar en código **nuevo** |

**Estrategia**: No migrar todo el proyecto. Usar Signals solo en componentes/servicios nuevos.
