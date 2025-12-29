import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatosService } from '../service/datos.service';
import { ActivoService } from '../service/activo.service';
import { Router } from '@angular/router';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-agregar-activo',
  standalone: false,
  templateUrl: './agregar-activo.component.html',
  styleUrl: './agregar-activo.component.css',
})
export class AgregarActivoComponent implements OnInit {
  agregarActivoForm!: FormGroup; // Formulario para agregar un activo
  serialError: string = ''; // Mensaje de error para la etiqueta serial
  errorMessage: string = ''; // Mensaje de error para el backend
  public previewUrl: string | null = null; // URL de la imagen seleccionada para previsualización
  imagenAEnviar: string | null = null; // Imagen a enviar al backend
  imagenLocalStorageKey: string | null = null; // Clave de la imagen en localStorage
  imagenActual: string | null = null; // Imagen actual del activo (si existe)
  // Listas para los selectores
  tiposActivos = [];
  proveedores: any[] = [];
  ubicaciones: any[] = [];
  proveedorGarantia: any[] = [];
  duenos: any[] = [];
  estados = [];

  condicionesFisicas = [
    { id: 1, nombre: 'Nuevo' },
    { id: 2, nombre: 'Usado' },
    { id: 3, nombre: 'Dañado' },
  ];


  estadoGarantia = [
    { id: 1, nombre: 'Vigente' },
    { id: 2, nombre: 'Por vencer' },
    { id: 3, nombre: 'Vencida' },
  ];

  constructor(
    private fb: FormBuilder,
    private datosService: DatosService,
    private activoService: ActivoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Inicializa el formulario con campos vacíos
    this.inicializarFormulario();

    // Carga los datos auxiliares necesarios para los selectores
    this.cargarDatosAuxiliares();
  }

  /**
   * Inicializa el formulario reactivo con valores predeterminados.
   */
  private inicializarFormulario(): void {
    this.agregarActivoForm = this.fb.group({
      nombreActivo: ['', Validators.required], // Obligatorio
      dueno: ['', Validators.required], // Obligatorio
      tipoActivo: ['', Validators.required], // Obligatorio
      fechaAdquisicion: ['', Validators.required], // Obligatorio
      valorCompra: [null, [Validators.required, Validators.min(0)]], // Obligatorio y mínimo 0
      proveedor: ['', Validators.required], // Obligatorio
      modelo: [''],
      versionSoftware: [''],
      tipoLicencia: [''],
      condicionFisica: ['', this.condicionFisicaValidator()],
      etiquetaSerial: [''],
      descripcion: [''],
      estado: ['', Validators.required], // Obligatorio
      ubicacion: ['', Validators.required], // Obligatorio
      fechaVencimiento: [''],
      costoMensual: [null, Validators.min(0)], // Mínimo 0 (opcional)
      recursosAsignados: [''],
      imagen: [null],
      nombreGarantia: [''],
      proveedorGarantia: [''],
      fechaInicioGarantia: [''],
      fechaFinGarantia: [''],
      estadoGarantia: [''],
      descripcionGarantia: [''],
      costo: [null],
      condiciones: [''],
    });
  }

  /**
   * Carga los datos auxiliares necesarios para los selectores.
   */
  private cargarDatosAuxiliares(): void {
    this.datosService.obtenerDatosAuxiliares().subscribe({
      next: (response) => {
        // Asigna los datos recibidos a las propiedades correspondientes
        this.tiposActivos = response.tipos;
        this.proveedores = response.proveedores;
        this.ubicaciones = response.ubicaciones;
        this.proveedorGarantia = response.proveedoresGarantia;
        this.duenos = response.duenos;
        this.estados = response.estados;

        console.log('Datos auxiliares cargados:', response);
      },
      error: (error) => {
        // Ejem. Si el backend devuelve { mensaje: "Error al obtener datos auxiliares" }
        const errorMessage =
          error.error?.mensaje || 'Error al obtener datos auxiliares';

        // Mostrar el mensaje
        this.errorMessage = errorMessage;
        console.error('Error del backend:', errorMessage);
        alert(errorMessage);
      },
    });
  }
  // maneja el evento de selección de archivo
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      // Vista previa local
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
        // Guardar en localStorage (clave única para evitar conflictos)
        const imageKey = `activo_img_${Date.now()}`;
        localStorage.setItem(imageKey, this.previewUrl);
        this.imagenLocalStorageKey = imageKey; // Guardar la clave para usarla después
      };
      reader.readAsDataURL(file);
    } else {
      alert('Por favor selecciona una imagen válida (JPEG, PNG, GIF).');
    }
  }

  /**
   * Envía los datos del formulario al backend para crear un nuevo activo.
   */
  onSubmit(): void {
    // 1. Primero verificar si el formulario es válido
    if (!this.agregarActivoForm.valid) {
      alert('Por favor completa correctamente todos los campos requeridos');
      this.agregarActivoForm.markAllAsTouched(); // Marcar campos como tocados para mostrar errores
      return; // Detener la ejecución si el formulario no es válido
    }

    if (this.imagenLocalStorageKey) {
      const imageDataUrl = localStorage.getItem(this.imagenLocalStorageKey);
      if (imageDataUrl) {
        // Convertir DataURL a Blob y subir la imagen
        const blob = this.dataURLtoBlob(imageDataUrl);
        const formData = new FormData();
        formData.append('file', blob, 'activo_image.jpg');
        // Primero subir la imagen
        this.activoService.subirImagen(formData).subscribe({
          next: (res) => {
            //Si la imagen se sube bien, crear el activo con la URL
            this.crearActivoConDatos(res.url);
            console.log('Imagen subida con éxito:', res.url);
            if (this.imagenLocalStorageKey) {
              localStorage.removeItem(this.imagenLocalStorageKey); // Limpiar
            }
          },
          error: (err) => {
            alert('Error al subir la imagen. Intenta nuevamente.');
            console.error(err);
          },
        });
        return;
      }
    }

    // 3. Si no hay imagen, crear el activo directamente
    this.crearActivoConDatos(undefined);
  }

  /**
   * Método auxiliar: Crea el activo con los datos del formulario + URL de imagen.
   */
  private crearActivoConDatos(imageUrl: string | undefined): void {
    const formValue = this.agregarActivoForm.value;

    const nuevoActivo = {
      nombre: formValue.nombreActivo || undefined,
      tipo_id: formValue.tipoActivo || undefined,
      fecha_adquisicion: formValue.fechaAdquisicion || undefined,
      valor_compra: formValue.valorCompra || undefined,
      proveedor_id: formValue.proveedor || undefined,
      modelo: formValue.modelo || undefined,
      version_software: formValue.versionSoftware || undefined,
      condicion_fisica: formValue.condicionFisica || undefined,
      etiqueta_serial: formValue.etiquetaSerial || undefined,
      descripcion: formValue.descripcion || undefined,
      estado: formValue.estado || undefined,
      ubicacion_id: formValue.ubicacion || undefined,
      fecha_vencimiento_licencia: formValue.fechaVencimiento || undefined,
      costo_mensual: formValue.costoMensual || undefined,
      recursos_asignados: formValue.recursosAsignados || undefined,
      foto_url: imageUrl,
      nombre_garantia: formValue.nombreGarantia || undefined,
      proveedor_garantia_id: formValue.proveedorGarantia || undefined,
      fecha_inicio_garantia: formValue.fechaInicioGarantia || undefined,
      fecha_fin_garantia: formValue.fechaFinGarantia || undefined,
      descripcion_garantia: formValue.descripcionGarantia || undefined,
      estado_garantia: formValue.estadoGarantia || undefined,
      tipo_licencia: formValue.tipoLicencia || undefined,
      dueno_id: formValue.dueno || undefined,
      costo: formValue.costo || undefined,
      condiciones: formValue.condiciones || undefined,
    };

    console.log('Datos del nuevo activo:', nuevoActivo);

    this.activoService.createActivo(nuevoActivo).subscribe({
      next: (response) => {
        console.log('Activo creado con éxito:', response);
        alert('Activo creado exitosamente');
        this.router.navigate(['/gestion-activos']);
      },
      error: (error) => {
        const errorMessage = error.error?.error || 'Error al crear activo';
        console.error('Error del backend:', errorMessage);
        alert(errorMessage);
      },
    });
  }

  /**
   * Convierte DataURL a Blob (para enviar la imagen al backend).
   */
  private dataURLtoBlob(dataURL: string): Blob {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  // Quitar imagen completamente (enviará null al backend)
  removeImage(): void {
    // Eliminar imagen del localStorage si existe
    if (this.imagenLocalStorageKey) {
      localStorage.removeItem(this.imagenLocalStorageKey);
      this.imagenLocalStorageKey = null;
    }
    // Limpiar vista previa
    this.previewUrl = null;
  }

  /**
   * Valida la etiqueta serial ingresada en el formulario.
   * Si la etiqueta ya está registrada, muestra un mensaje de error.
   */
  validarEtiquetaSerial(): void {
    const etiquetaSerial = this.agregarActivoForm.get('etiquetaSerial')?.value;

    if (etiquetaSerial) {
      this.datosService.validarEtiquetaSerial(etiquetaSerial).subscribe({
        next: (response) => {
          // La etiqueta serial está disponible
          this.serialError = ''; // No hay error
          console.log('Respuesta del backend:', response);
        },
        error: (error) => {
          // Manejar errores devueltos por el backend
          const errorMessage = error.error?.error || 'Error desconocido';
          this.serialError = errorMessage; // Mostrar mensaje de error
          console.error('Error al validar etiqueta serial:', errorMessage);
        },
      });
    } else {
      this.serialError = ''; // Limpiar el mensaje de error si el campo está vacío
    }
  }

  // Validador personalizado para condicionFisica
  condicionFisicaValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valor = control.value;
      if (!valor) return null;
      if (!['Nuevo', 'Usado', 'Dañado'].includes(valor)) {
        return { condicionInvalida: true };
      }
      return null;
    };
  }

  /**
   * Limpia el formulario y redirige a la vista de gestión de activos.
   */
  onCancelar(): void {
    const confirmar = confirm(
      '¿Estás seguro de que deseas cancelar? Se perderán los cambios no guardados.'
    );
    if (confirmar) {
      // Limpiar el formulario y localStorage
      this.agregarActivoForm.reset();

      if (this.imagenLocalStorageKey) {
        localStorage.removeItem(this.imagenLocalStorageKey);
        this.imagenLocalStorageKey = null;
        this.previewUrl = null;
      }
      this.router.navigate(['/gestion-activos']);
    }
  }
}
