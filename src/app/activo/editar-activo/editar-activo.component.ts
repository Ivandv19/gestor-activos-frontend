import { Component, OnDestroy, OnInit } from "@angular/core";
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	ValidationErrors,
	ValidatorFn,
	Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import Swal from "sweetalert2";
import { ActivoPayload, GarantiaItem } from "../../models/activo.interface";
import { SelectItem } from "../../models/datos-auxiliares.interface";
import { getCloudflareImage } from "../../utils/images";
import { ActivoService } from "../service/activo.service";
import { DatosService } from "../service/datos.service";

@Component({
	selector: "app-editar-activo",
	standalone: false,
	templateUrl: "./editar-activo.component.html",
	styleUrl: "./editar-activo.component.css",
})
export class EditarActivoComponent implements OnInit, OnDestroy {
	// Formulario para editar un activo
	editarActivoForm!: FormGroup;
	activoId!: number; // ID del activo
	tiposActivos: SelectItem[] = [];
	proveedores: SelectItem[] = [];
	ubicaciones: SelectItem[] = [];
	proveedorGarantia: SelectItem[] = [];
	duenos: SelectItem[] = [];
	errorMessage: string = "";
	estados: SelectItem[] = [];

	public previewUrl: string | null = null; // Vista previa de la nueva imagen
	imagenActual: string | null | undefined = null; // URL de la imagen actual del activo
	imagenOriginal: string | null | undefined = null; // Guardar la imagen inicial del backend
	imagenLocalStorageKey: string | null = null; // Clave de la imagen en localStorage
	isUploading = false;
	private destroy$ = new Subject<void>(); // Sujeto para manejar el unsubscribe

	get haCambiadoImagen(): boolean {
		// Ha cambiado si hay un preview nuevo O si la imagen actual es nula pero la original no lo era (borrado)
		return (
			!!this.previewUrl ||
			(this.imagenActual === null && this.imagenOriginal !== null)
		);
	}

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
		this.activoId = +(this.route.snapshot.paramMap.get("id") || 0);
		this.inicializarFormulario();
		this.cargarDatosActivo();
		this.cargarDatosAdicionales();
	}

	// Inicializar el formulario
	inicializarFormulario(): void {
		this.editarActivoForm = this.fb.group({
			nombre: ["", Validators.required],
			tipo_id: ["", Validators.required],
			fecha_adquisicion: ["", Validators.required],
			valor_compra: [null, [Validators.required, Validators.min(0)]],
			estado: ["", Validators.required],
			proveedor_id: ["", Validators.required],
			ubicacion_id: ["", Validators.required],
			dueno_id: ["", Validators.required],
			modelo: [""],
			version_software: [""],
			tipo_licencia: [""],
			fecha_vencimiento_licencia: [""],
			costo_mensual: [null, Validators.min(0)],
			recursos_asignados: [""],
			condicion_fisica: ["", this.condicionFisicaValidator()],
			etiqueta_serial: [""],
			descripcion: [""],
			nombre_garantia: [""],
			proveedor_garantia_id: [""],
			fecha_inicio: [""],
			fecha_fin: [""],
			estado_garantia: [""],
			descripcion_garantia: [""],
			costo: [null],
			condiciones: [""],
		});
	}

	// Cargar datos auxiliares (tipos, proveedores, ubicaciones, etc.)
	cargarDatosAdicionales(): void {
		this.datosService
			.obtenerDatosAuxiliares()
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (response) => {
					console.log(response);
					this.tiposActivos = response.tipos || [];
					this.proveedores = response.proveedores || [];
					this.ubicaciones = response.ubicaciones || [];
					this.proveedorGarantia = response.proveedoresGarantia || [];
					this.duenos = response.duenos || [];
					this.estados = response.estados || [];
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

	// Quitar imagen completamente (enviará null al backend al guardar)
	removeImage(): void {
		Swal.fire({
			title: "¿Eliminar Imagen?",
			text: "Esta acción marcará la imagen para ser eliminada permanentemente al guardar los cambios.",
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Sí, eliminar",
			cancelButtonText: "Cancelar",
			reverseButtons: true,
			buttonsStyling: false,
			customClass: {
				popup: "premium-swal-popup",
				title: "premium-swal-title",
				htmlContainer: "premium-swal-html",
				confirmButton: "premium-swal-confirm",
				cancelButton: "premium-swal-cancel",
			},
		}).then((result) => {
			if (result.isConfirmed) {
				// Eliminar imagen del localStorage si existe
				if (this.imagenLocalStorageKey) {
					localStorage.removeItem(this.imagenLocalStorageKey);
					this.imagenLocalStorageKey = null;
				}

				// Limpiar vista previa
				this.previewUrl = null;
				this.imagenActual = null; // Marcar como nula para el backend
			}
		});
	}

	// Restaurar la imagen original del backend
	restoreOriginalImage(): void {
		// Eliminar imagen nueva del localStorage si existe
		if (this.imagenLocalStorageKey) {
			localStorage.removeItem(this.imagenLocalStorageKey);
			this.imagenLocalStorageKey = null;
		}

		// Limpiar vista previa y volver a la original
		this.previewUrl = null;
		this.imagenActual = this.imagenOriginal;
	}

	// Cargar datos del activo a editar
	cargarDatosActivo(): void {
		this.activoService
			.getActivoById(this.activoId)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (response) => {
					console.log("Datos del activo:", response);
					// Guarda la imagen actual y la original para comparaciones
					this.imagenActual = response.foto_url || null;
					this.imagenOriginal = response.foto_url || null;

					// Si hay imagen actual, prepara la vista previa (esto es opcional ahora que usamos haCambiadoImagen)
					this.previewUrl = null;

					// Manejo SEGURO de garantía (si es null o undefined)
					const garantia: GarantiaItem =
						response.garantia?.[0] ?? ({} as GarantiaItem); // Si no hay garantía, usa objeto vacío
					const datosFormulario = {
						nombre: response.nombre || undefined,
						dueno_id: response.dueno?.id || undefined,
						tipo_id: response.tipo?.id || undefined,
						fecha_adquisicion: response.fecha_adquisicion
							? response.fecha_adquisicion.split("T")[0]
							: undefined,
						valor_compra: response.valor_compra,
						proveedor_id: response.proveedor?.id || undefined,
						modelo: response.modelo || undefined,
						version_software: response.version_software || undefined,
						tipo_licencia: response.tipo_licencia || undefined,
						condicion_fisica: response.condicion_fisica || undefined,
						etiqueta_serial: response.etiqueta_serial || undefined,
						descripcion: response.descripcion || undefined,
						estado: response.estado || undefined,
						ubicacion_id: response.ubicacion?.id || undefined,
						fecha_vencimiento_licencia: response.fecha_vencimiento_licencia
							? response.fecha_vencimiento_licencia.split("T")[0]
							: undefined,
						costo_mensual: response.costo_mensual || undefined,
						recursos_asignados: response.recursos_asignados || undefined,
						nombre_garantia: garantia.nombre_garantia || undefined,
						proveedor_garantia_id: garantia.proveedor?.id || undefined,
						fecha_inicio: garantia.fecha_inicio
							? garantia.fecha_inicio.split("T")[0]
							: undefined,
						fecha_fin: garantia.fecha_fin
							? garantia.fecha_fin.split("T")[0]
							: undefined,
						estado_garantia: garantia.estado_garantia || undefined,
						descripcion_garantia: garantia.descripcion || undefined,
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
	onFileSelected(event: Event): void {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file?.type.startsWith("image/")) {
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
		if (!this.editarActivoForm.valid) {
			this.editarActivoForm.markAllAsTouched();
			return;
		}

		const formData = new FormData();
		const fv = this.editarActivoForm.value as ActivoPayload;

		for (const key of Object.keys(fv) as (keyof ActivoPayload)[]) {
			const val = fv[key];
			if (val !== null && val !== undefined && val !== "") {
				formData.append(key, String(val));
			}
		}

		if (this.imagenLocalStorageKey) {
			const imageDataUrl = localStorage.getItem(this.imagenLocalStorageKey);
			if (imageDataUrl) {
				const blob = this.dataURLtoBlob(imageDataUrl);
				formData.append("file", blob, "activo.jpg");
			}
		} else if (this.imagenActual) {
			formData.append("foto_url", this.imagenActual);
		} else if (this.imagenActual === null) {
			formData.append("foto_url", "");
		}

		this.isUploading = true;
		Swal.fire({
			title: "Actualizando activo...",
			allowOutsideClick: false,
			didOpen: () => Swal.showLoading(),
		});

		this.activoService
			.updateActivo(this.activoId, formData)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (response) => {
					this.isUploading = false;
					Swal.close();
					console.log("activo actualizado exitosamente:", response);
					if (this.imagenLocalStorageKey) {
						localStorage.removeItem(this.imagenLocalStorageKey);
						this.imagenLocalStorageKey = null;
					}
					Swal.fire({
						title: "¡Actualizado!",
						text: "Los cambios se han guardado exitosamente.",
						icon: "success",
						timer: 2000,
						timerProgressBar: true,
						buttonsStyling: false,
						customClass: {
							popup: "premium-swal-popup",
							title: "premium-swal-title",
							htmlContainer: "premium-swal-html",
							confirmButton: "premium-swal-confirm",
						},
					}).then(() => {
						this.router.navigate(["/gestion-activos"]);
					});
				},
				error: (error) => {
					this.isUploading = false;
					Swal.close();
					const errorMessage =
						error.error?.error || "Error al actualizar el activo";
					Swal.fire({
						title: "Error de Guardado",
						text: errorMessage,
						icon: "error",
						buttonsStyling: false,
						customClass: {
							popup: "premium-swal-popup",
							title: "premium-swal-title",
							htmlContainer: "premium-swal-html",
							confirmButton: "premium-swal-confirm",
						},
					});
					this.errorMessage = errorMessage;
				},
			});
	}

	/**
	 * Convierte DataURL a Blob (para enviar la imagen al backend).
	 */
	private dataURLtoBlob(dataURL: string): Blob {
		const arr = dataURL.split(",");
		const mime = arr[0].match(/:(.*?);/)?.[1] || "";
		const bstr = atob(arr[1]);
		let n = bstr.length;
		const u8arr = new Uint8Array(n);

		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new Blob([u8arr], { type: mime });
	}

	// Manejar el evento de cancelar
	onCancelar(): void {
		Swal.fire({
			title: "¿Descartar Cambios?",
			text: "Tienes cambios sin guardar. Si continúas, se perderá toda la información editada.",
			icon: "question",
			showCancelButton: true,
			confirmButtonText: "Sí, descartar",
			cancelButtonText: "Seguir editando",
			reverseButtons: true,
			buttonsStyling: false,
			customClass: {
				popup: "premium-swal-popup",
				title: "premium-swal-title",
				htmlContainer: "premium-swal-html",
				confirmButton: "premium-swal-confirm",
				cancelButton: "premium-swal-cancel",
			},
		}).then((result) => {
			if (result.isConfirmed) {
				this.editarActivoForm.reset();
				if (this.imagenLocalStorageKey) {
					localStorage.removeItem(this.imagenLocalStorageKey);
					this.imagenLocalStorageKey = null;
					this.previewUrl = null;
				}
				this.router.navigate(["/gestion-activos"]);
			}
		});
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

	getAssetPhoto(fotoUrl: string | null | undefined): string {
		if (!fotoUrl) return "";
		return getCloudflareImage(fotoUrl, { width: 300 });
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
