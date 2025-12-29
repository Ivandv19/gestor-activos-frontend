import {
  ReporteService,
} from '../service/reporte.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatosAuxiliaresService } from '../service/datos-auxiliares.service';
import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Chart } from 'chart.js/auto';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-reporte',
  standalone: false,
  templateUrl: './reporte.component.html',
  styleUrl: './reporte.component.css',
})
export class ReporteComponent implements OnInit, AfterViewInit {
  reportForm!: FormGroup;

  // Variables para almacenar los datos auxiliares
  tiposActivo: any[] = [];
  usuarios: any[] = [];
  ubicaciones: any[] = [];
  proveedores: any[] = [];
  reporte = {
    tipo_reporte: '', // Tipo de reporte (inicialmente vacío)
    descripcion: '', // Descripción del reporte (inicialmente vacía)
    filtros: {
      tipo_activo: '', // Filtro por tipo de activo (inicialmente vacío)
      usuario: '', // Filtro por usuario (inicialmente vacío)
      ubicacion: '', // Filtro por ubicación (inicialmente vacío)
      proveedor: '', // Filtro por proveedor (inicialmente vacío)
      fecha_inicio: null, // Fecha de inicio (inicialmente nula)
      fecha_fin: null, // Fecha de fin (inicialmente nula)
    },
    resultados: {
      detalles: [], // Detalles del reporte (inicialmente un array vacío)
      resumen: {}, // Resumen del reporte (inicialmente un objeto vacío)
    },
  };
  errorMessage: string | null = null; // Mensaje de error (inicialmente nulo)

  // Referencias a los elementos <canvas> usando @ViewChild
  @ViewChild('graficaPastel') graficaPastel!: ElementRef;
  @ViewChild('graficaBarras') graficaBarras!: ElementRef;

  tiposReporte: any[] = []; // Almacena los tipos de reporte


  constructor(
    private reporteService: ReporteService,
    private datosAuxiliaresService: DatosAuxiliaresService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.fetchTiposReporte();
    this.fetchDatosAuxiliares();
  }
  ngAfterViewInit(): void {}

  // Inicializar el formulario
  initForm(): void {
    this.reportForm = this.fb.group({
      tipoReporte: ['', Validators.required], // Selector de tipo de reporte
      descripcion: [{ value: '', disabled: false }], // Permite cambios dinámicos
      tipoActivo: [''], // Selector de tipo de activo
      fechaInicio: [''],
      fechaFin: [''],
      usuario: [''], // Selector de usuario
      ubicacion: [''], // Selector de ubicación
      proveedor: [''], // Selector de proveedor
    });
    // Escucha cambios en 'tipoReporte' para actualizar 'descripcion'
    this.reportForm.get('tipoReporte')?.valueChanges.subscribe((tipoId) => {
      this.actualizarDescripcion(tipoId);
    });
  }


  // Método para cargar los tipos de reporte
  fetchTiposReporte(): void {

    this.reporteService.getTiposReporte().subscribe({
      next: (response) => {
        console.log('Respuesta cruda del servicio:', response); //
        this.tiposReporte = response.tiposReporte; // Asignar los tipos de reporte a la variable
        console.log('Tipos de reporte asignados:', this.tiposReporte);
      },
      error: (error) => {
        // Ejem. Si el backend devuelve { error: "Error al cargar los tipos de reporte." }
        const errorMessage =
          error.error?.error || 'Error al cargar los tipos de reporte.';
        // Mostrar el mensaje
        this.errorMessage = errorMessage;
        console.error('Error del backend:', errorMessage);
        alert(errorMessage);
      },
    });
  }


  // Método para cargar los datos auxiliares
  fetchDatosAuxiliares(): void {
    this.datosAuxiliaresService.getDatosAuxiliares().subscribe({
      next: (response) => {
        console.log('[DEBUG] Datos auxiliares recibidos:', response);

        // Asignar los datos a las variables correspondientes
        this.tiposActivo = response.tiposActivo;
        this.usuarios = response.usuarios;
        this.ubicaciones = response.ubicaciones;
        this.proveedores = response.proveedores;

        console.log('[INFO] Datos auxiliares asignados correctamente.');
      },
      error: (error) => {
        // Ejem. Si el backend devuelve { message: "Error al cargar los tipos de reporte." }
        const errorMessage =
          error.error?.message || 'Error al cargar los tipos de reporte.';
        // Mostrar el mensaje
        this.errorMessage = errorMessage;
        console.error('Error del backend:', errorMessage);
        alert(errorMessage);
      },
    });
  }


  actualizarDescripcion(tipoId: number): void {
    if (!tipoId) {
      this.reportForm.get('descripcion')?.setValue(''); // Limpia si no hay selección
      return;
    }

    const tipoSeleccionado = this.tiposReporte.find(
      (tipo) => tipo.id === tipoId
    );
    const descripcion = tipoSeleccionado?.descripcion || '';

    this.reportForm.get('descripcion')?.setValue(descripcion); // Asigna la descripción
  }

  generarReporte(tipo_id: number, filtros: any): void {

    this.reporteService.generarReporte(tipo_id, filtros).subscribe({
      next: (response: any) => {
        console.log('[INFO] Datos del reporte generados:', response);
        this.reporte = response;
        console.log('xddd', this.reporte);
        // Inicializar las gráficas
        this.initGraficaPastel();
        this.initGraficaBarras();
      },
      error: (error) => {
        // Ejem. Si el backend devuelve { error: "Error al generar el reporte." }
        const errorMessage =
          error.error?.error || 'Error al generar el reporte.';
        // Mostrar el mensaje
        this.errorMessage = errorMessage;
        console.error('Error del backend:', errorMessage);
        alert(errorMessage);
      },
    });
  }
  onLimpiar(): void {
    this.reportForm.reset(); // Limpiar el formulario
  }



  // Método para manejar el envío del formulario
  onSubmit(): void {
    console.log('[DEBUG] Estado del formulario:', this.reportForm.status);
    console.log('[DEBUG] Valores del formulario:', this.reportForm.value);

    if (this.reportForm.valid) {
      // Obtener los valores del formulario
      const formValues = this.reportForm.value;
      // Extraer los filtros dinámicamente
      const filtros = {
        tipo_activo_id: formValues.tipoActivo || null,
        usuario_id: formValues.usuario || null, // ID del usuario
        ubicacion_id: formValues.ubicacion || null, // ID de la ubicación
        proveedor_id: formValues.proveedor || null, // ID del proveedor
        fecha_inicio: formValues.fechaInicio || null, // Fecha de inicio
        fecha_fin: formValues.fechaFin || null, // Fecha de fin
      };

      console.log('[DEBUG] Filtros generados:', filtros);

      // Llamar al servicio para generar el reporte
      this.generarReporte(formValues.tipoReporte, filtros);
    } else {
      console.error('[ERROR] El formulario no es válido.');
      console.log('[DEBUG] Errores del formulario:', this.reportForm.errors);
      console.log(
        '[DEBUG] Errores de los controles:',
        this.reportForm.controls
      );
    }
  }
  // Método para obtener las columnas del reporte

  getColumnas(): string[] {
    if (this.reporte.resultados.detalles.length > 0) {
      return Object.keys(this.reporte.resultados.detalles[0]);
    }
    return [];
  }
  // Método para obtener los datos del reporte
  getResumenEntries(): [string, number][] {
    return Object.entries(this.reporte.resultados.resumen);
  }


  private chartPastel: any;
  private chartBarras: any;


  initGraficaPastel(): void {
    const canvas = this.graficaPastel.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Destruir la instancia anterior si existe
    if (this.chartPastel) {
      this.chartPastel.destroy();
    }

    const resumen = this.getResumenEntries();
    if (resumen.length === 0) {
      console.warn('[WARN] No hay datos para generar la gráfica de pastel.');
      return;
    }

    const labels = resumen.map((item) => item[0]);
    const data = resumen.map((item) => item[1]);

    this.chartPastel = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'Distribución por Categoría' },
        },
      },
    });
  }

  initGraficaBarras(): void {
    const canvas = this.graficaBarras.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Destruir la instancia anterior si existe
    if (this.chartBarras) {
      this.chartBarras.destroy();
    }

    const resumen = this.getResumenEntries();
    const labels = resumen.map((item) => item[0]);
    const data = resumen.map((item) => item[1]);

    this.chartBarras = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Cantidad',
            data: data,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'Cantidad por Categoría' },
        },
      },
    });
  }

  // Método para exportar a PDF
  async exportToPDF(): Promise<void> {
    if (!this.reporte.resultados.detalles.length) {
      console.error('No hay datos para exportar');
      return;
    }

    const doc = new jsPDF('p', 'mm', 'a4');
    const date = new Date().toLocaleDateString();

    try {
      // 1. Captura TODO el contenido del div
      const element = document.getElementById('pdf-export-content');

      if (!element) {
        throw new Error('No se encontró el elemento a exportar');
      }

      // 2. Renderizado con html2canvas (opciones clave)
      const canvas = await html2canvas(element, {
        scale: 1, // Calidad HD
        logging: false,
        useCORS: true,
        allowTaint: true,
        scrollY: -window.scrollY // Evita cortes
      });

      // 3. Añade la imagen al PDF
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = doc.internal.pageSize.getWidth() - 20; // Margen
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      doc.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);

      // 4. Guardar
      doc.save(`reporte_completo_${date}.pdf`);
    } catch (error) {
      console.error('Error al generar PDF:', error);
    }
  }

}
