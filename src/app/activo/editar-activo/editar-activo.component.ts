import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ActivoService } from "../service/activo.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DatosService } from "../service/datos.service";
import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

@Component({
	selector: "app-editar-activo",
	standalone: false,
	templateUrl: "./editar-activo.component.html",
	styleUrl: "./editar-activo.component.css",
})
export class EditarActivoComponent implements OnInit {
	// Formulario para editar un activo
	editarActivoForm!: FormGroup;
	activoId!: number; // ID del activo
	tiposActivos: any[] = [];
	proveedores: any[] = [];
	ubicaciones: any[] = [];
	proveedorGarantia: any[] = [];
	duenos: any[] = [];
	errorMessage: string = "";
	estados: any[] = [];

	public previewUrl: string | null = null; // Vista previa de la nueva imagen
	imagenActual: string | null | undefined = null; // URL de la imagen actual del activo
	imagenLocalStorageKey: string | null = null; // Clave de la imagen en localStorage

	condicionesFisicas = [
		{ id: 1, nombre: "Nuevo" },
		{ id: 2, nombre: "Usado" },
		{ id: 3, nombre: "Dañado" },
	];

	estadoGarantia = [
		{ id: 1, nombre: "Vigente" },
		{ id: 2, nombre: "Por vencer" },
		{ id: 3, nombre: "Vencida" },
	];

	constructor(
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private activoService: ActivoService,
		private datosService: DatosService,
	) {}

	ngOnInit(): void {
		// Obtener el ID del activo desde la ruta
		this.activoId = +this.route.snapshot.paramMap.get("id")!;
		this.inicializarFormulario();
		this.cargarDatosActivo();
		this.cargarDatosAdicionales();
	}

	// Inicializar el formulario
	inicializarFormulario(): void {
		this.editarActivoForm = this.fb.group({
			nombreActivo: [""],
			dueno: [""],
			tipoActivo: [""],
			fechaAdquisicion: [""],
			valorCompra: [""],
			proveedor: [""],
			modelo: [""],
			versionSoftware: [""],
			tipoLicencia: [""],
			condicionFisica: [""],
			etiquetaSerial: [""],
			descripcion: [""],
			estado: [""],
			ubicacion: [""],
			fechaVencimiento: [""],
			costoMensual: [""],
			recursosAsignados: [""],
			imagen: [""],
			nombreGarantia: [""],
			proveedorGarantia: [""],
			fechaInicioGarantia: [""],
			fechaFinGarantia: [""],
			estadoGarantia: [""],
			descripcionGarantia: [""],
			costo: [""],
			condiciones: [""],
		});
	}

	// Cargar datos auxiliares (tipos, proveedores, ubicaciones, etc.)
	cargarDatosAdicionales(): void {
		this.datosService.obtenerDatosAuxiliares().subscribe({
			next: (response) => {
				console.log(response);
				this.tiposActivos = response.tipos;
				this.proveedores = response.proveedores;
				this.ubicaciones = response.ubicaciones;
				this.proveedorGarantia = response.proveedoresGarantia;
				this.duenos = response.duenos;
				this.estados = response.estados;
			},
			error: (error) => {
				// Ejem. Si el backend devuelve { mensaje: "Error al obtener datos auxiliares" }
				const errorMessage =
					error.error?.mensaje || "Error al obtener datos auxiliares";

				// Mostrar el mensaje
				this.errorMessage = errorMessage;
				console.error("Error del backend:", errorMessage);
				alert(errorMessage);
			},
		});
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
		this.imagenActual = null; // Limpiar imagen actual del activo
		// También limpiar el input file
		this.editarActivoForm.get("imagen")?.reset();
	}

	// Restaurar la imagen original del backend
	restoreOriginalImage(): void {
		// Eliminar imagen nueva del localStorage si existe
		if (this.imagenLocalStorageKey) {
			localStorage.removeItem(this.imagenLocalStorageKey);
			this.imagenLocalStorageKey = null;
		}

		// Restaurar la imagen original del backend
		this.previewUrl = "http://localhost:3000" + this.imagenActual;

		// También limpiar el input file
		this.editarActivoForm.get("imagen")?.reset();
	}

	// Cargar datos del activo a editar
	cargarDatosActivo(): void {
		this.activoService.getActivoById(this.activoId).subscribe({
			next: (response) => {
				console.log("Datos del activo:", response);
				// Guarda la imagen actual del activo
				this.imagenActual = response.fotoUrl || undefined;
				// Si hay imagen actual, prepara la vista previa
				if (this.imagenActual) {
					this.previewUrl = "http://localhost:3000" + this.imagenActual;
				}
				// Manejo SEGURO de garantía (si es null o undefined)
				const garantia = response.garantia?.[0] ?? {}; // Si no hay garantía, usa objeto vacío
				const datosFormulario = {
					nombreActivo: response.nombre || undefined,
					dueno: response.dueno?.id || undefined,
					tipoActivo: response.tipo?.id || undefined,
					fechaAdquisicion: undefined,
					valorCompra: response.valorCompra,
					proveedor: response.proveedor?.id || undefined,
					modelo: response.modelo || undefined,
					versionSoftware: response.versionSoftware || undefined,
					tipoLicencia: response.tipoLicencia || undefined,
					condicionFisica: response.condicionFisica || undefined,
					etiquetaSerial: response.etiquetaSerial || undefined,
					descripcion: response.descripcion || undefined,
					estado: response.estado || undefined,
					ubicacion: response.ubicacion?.id || undefined,
					fechaVencimiento: undefined,
					costoMensual: response.costoMensual || undefined,
					recursosAsignados: response.recursosAsignados || undefined,
					nombreGarantia: garantia.nombre || undefined,
					proveedorGarantia: garantia.proveedor?.id || undefined,
					fechaInicioGarantia: garantia.fecha_inicio || undefined,
					fechaFinGarantia: garantia.fecha_fin || undefined,
					estadoGarantia: garantia.estado || undefined,
					descripcionGarantia: garantia.descripcion || undefined,
					costo: garantia.costo || undefined,
					condiciones: garantia.condiciones || undefined,
				};

				this.editarActivoForm.patchValue(datosFormulario);
				console.log("Datos del formulario:", datosFormulario);
				console.log("Imagen actual:", this.imagenActual);
			},
			error: (error) => {
				// Ejem. Si el backend devuelve { error: "Error al obtener activo" }
				const errorMessage = error.error?.error || "Error al obtener activo";

				// Mostrar el mensaje
				this.errorMessage = errorMessage;
				console.error("Error del backend:", errorMessage);
				alert(errorMessage);
			},
		});
	}
	// Manejar la selección de archivos (imagen)
	onFileSelected(event: any): void {
		const file: File = event.target.files[0];
		if (file && file.type.startsWith("image/")) {
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
			alert("Por favor selecciona una imagen válida (JPEG, PNG, GIF).");
		}
	}
	// Manejar el envío del formulario
	onSubmit(): void {
		if (this.imagenLocalStorageKey) {
			const imageDataUrl = localStorage.getItem(this.imagenLocalStorageKey);
			if (imageDataUrl) {
				// Convertir DataURL a Blob y subir la imagen
				const blob = this.dataURLtoBlob(imageDataUrl);
				const formData = new FormData();
				formData.append("file", blob, "activo_image.jpg");

				// Primero subir la imagen
				this.activoService.subirImagen(formData).subscribe({
					next: (res) => {
						console.log("Imagen subida exitosamente:", res);
						this.actualizarActivoConDatos(res.url); // Enviar la URL de la imagen al backend
						// Limpiar localStorage en cualquier caso exitoso
						if (this.imagenLocalStorageKey) {
							localStorage.removeItem(this.imagenLocalStorageKey);
							this.imagenLocalStorageKey = null;
						}
					},
					error: (err) => {
						alert("Error al subir la imagen. Intenta nuevamente.");
						console.error(err);
					},
				});
				return; // Salir para no ejecutar actualizarActivoConDatos otra vez
			}
		}

		this.actualizarActivoConDatos(this.imagenActual);
	}

	private actualizarActivoConDatos(imagenUrl: string | undefined | null): void {
		const formValue = this.editarActivoForm.value;

		// Preparar objeto de datos para el backend
		const datosBackend: any = {
			nombre: formValue.nombreActivo || undefined,
			dueno_id: formValue.dueno || undefined,
			tipo_id: formValue.tipoActivo || undefined,
			fecha_adquisicion: this.formatDateForBackend(formValue.fechaAdquisicion),
			valor_compra: formValue.valorCompra || undefined,
			proveedor_id: formValue.proveedor || undefined,
			modelo: formValue.modelo || undefined,
			version_software: formValue.versionSoftware || undefined,
			tipo_licencia: formValue.tipoLicencia || undefined,
			condicion_fisica: formValue.condicionFisica || undefined,
			etiqueta_serial: formValue.etiquetaSerial || undefined,
			descripcion: formValue.descripcion || undefined,
			estado: formValue.estado || undefined,
			ubicacion_id: formValue.ubicacion || undefined,
			fecha_vencimiento_licencia: this.formatDateForBackend(
				formValue.fechaVencimiento,
			),
			costo_mensual: formValue.costoMensual || undefined,
			recursos_asignados: formValue.recursosAsignados || undefined,
			foto_url: imagenUrl,

			// Datos de garantía
			nombre_garantia: formValue.nombreGarantia || undefined,
			proveedor_garantia_id: formValue.proveedorGarantia || undefined,
			fecha_inicio: this.formatDateForBackend(formValue.fechaInicioGarantia),
			fecha_fin: this.formatDateForBackend(formValue.fechaFinGarantia),
			estado_garantia: formValue.estadoGarantia || undefined,
			descripcion_garantia: formValue.descripcionGarantia || undefined,
			costo: formValue.garantiaCosto || undefined,
			condiciones: formValue.garantiaCondiciones || undefined,
		};

		// Filtrar para eliminar campos undefined (no enviarlos)
		const payload = Object.fromEntries(
			Object.entries(datosBackend).filter(([_, v]) => v !== undefined),
		);

		this.activoService.updateActivo(this.activoId, payload).subscribe({
			next: (response) => {
				console.log("activo actualizado exitosamente:", response);
				alert("Activo actualizado exitosamente");
				this.router.navigate(["/gestion-activos"]);
			},
			error: (error) => {
				// Ejem. Si el backend devuelve { error: "Error al actualizar el activo" }
				const errorMessage =
					error.error?.error || "Error al actualizar el activo";
				// Mostrar el mensaje
				this.errorMessage = errorMessage;
				console.error("Error del backend:", errorMessage);
				alert(errorMessage);
			},
		});
	}

	/**
	 * Convierte DataURL a Blob (para enviar la imagen al backend).
	 */
	private dataURLtoBlob(dataURL: string): Blob {
		const arr = dataURL.split(",");
		const mime = arr[0].match(/:(.*?);/)![1];
		const bstr = atob(arr[1]);
		let n = bstr.length;
		const u8arr = new Uint8Array(n);

		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new Blob([u8arr], { type: mime });
	}

	/**
	 * Formatea la fecha para el backend (YYYY-MM-DD).
	 * Si la fecha es undefined, null o string vacío, retorna undefined.
	 * Si ya está en formato YYYY-MM-DD, retorna la fecha tal cual.
	 * Para cualquier otro caso (incluyendo objetos Date), retorna undefined.
	 */
	formatDateForBackend(date: any): string | undefined {
		// Si es undefined, null o string vacío, retornar undefined
		if (date === undefined || date === null || date === "") {
			return undefined;
		}

		// Si ya está en formato YYYY-MM-DD, retornar directo
		if (typeof date === "string" && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
			return date;
		}

		// Para cualquier otro caso (incluyendo objetos Date), retornar undefined
		return undefined;
	}

	// Manejar el evento de cancelar
	onCancelar(): void {
		const confirmar = confirm(
			"¿Estás seguro de que deseas cancelar? Se perderán los cambios no guardados.",
		);

		if (confirmar) {
			// Limpiar el formulario y localStorage
			this.editarActivoForm.reset();

			if (this.imagenLocalStorageKey) {
				localStorage.removeItem(this.imagenLocalStorageKey);
				this.imagenLocalStorageKey = null;
				this.previewUrl = null;
			}

			this.router.navigate(["/gestion-activos"]);
		}
	}

	// Validador personalizado para condicionFisica
	condicionFisicaValidator(): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			const valor = control.value;
			if (!valor) return null;
			if (!["Nuevo", "Usado", "Dañado"].includes(valor)) {
				return { condicionInvalida: true };
			}
			return null;
		};
	}
}
