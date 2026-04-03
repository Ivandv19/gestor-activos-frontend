# Gestor de Activos IT (Frontend)

## Descripción

Esta es la interfaz gráfica del Gestor de Activos IT, una plataforma web donde el departamento de TI interactúa y administra todo el ciclo de vida de los equipos informáticos. Está diseñada para ofrecer una experiencia fluida, rápida y modular, conectándose de forma segura al motor central de la empresa.

## Características

- **Dashboard Resumido**: Panel visual principal (con gráficas) que te muestra el estado de todos tus recursos asignados y disponibles en un solo lugar.
- **Alertas Proactivas**: Avisos en pantalla cuando una licencia está por vencer, un activo entra a mantenimiento o una garantía está a punto de caducar.
- **Reportes en PDF**: Funcionalidad para filtrar información de los equipos y generar un reporte descargable en PDF con un simple clic.
- **Seguridad y Accesos**: Sistema de inicio de sesión seguro, asegurando que solo el personal autorizado pueda modificar el inventario.

## Secciones

1. **Dashboard**: Pantalla principal de resumen con gráficos y alertas generales.
2. **Gestión de Activos**: Lista completa para registrar, consultar opciones y dar de baja cualquier hardware o software.
3. **Asignaciones**: Módulo especial para enlazar o desenlazar un equipo a un empleado.
4. **Reportes**: Apartado que permite descargar archivos estadísticos en formato PDF o Excel.
5. **Configuración**: Ajustes globales y actualización de los datos o perfiles del administrador.

## Uso

- **Visualización del Proyecto:** El proyecto ya se encuentra en funcionamiento. Puedes explorarlo aquí: [Gestor de Activos](https://gestor.mgdc.site/).
- **Inicio Rápido**: Inicia sesión mediante tus credenciales para acceder a la herramienta completa.
- **Visualización y Búsqueda**: Usa el buscador interno o los filtros en la lista de gestión para aislar información (ej. buscar "laptops disponibles").
- **Flujo de Asignación**: Da clic en asignar activo y selecciona a qué empleado o departamento va dirigido el equipo en cuestión.

## Tecnologías Utilizadas

- HTML / CSS / TypeScript
- Angular 19
- Angular Material
- Chart.js
- jsPDF
- npm

## Instalación

1. **Clonar el Repositorio**: Descarga el código de este proyecto a tu máquina usando Git.

```bash
git clone https://github.com/Ivandv19/gestor-activos-frontend.git
```

2. **Instalar Dependencias**: Abre una terminal en la carpeta principal del proyecto y ejecuta:

```bash
npm install
```

3. **Configuración**: El proyecto está configurado para conectarse localmente por defecto. Puedes ajustar las URLs en la carpeta `src/environments` si es necesario.

4. **Iniciar el Proyecto**: Enciende la página localmente con el siguiente comando:

```bash
npm run start
```
*(Nota: Asegúrate de tener encendido tu proyecto backend en paralelo para que el inicio de sesión y la carga de datos funcione correctamente).*

## Créditos

Este proyecto administra la cara visual de las herramientas empresariales del ecosistema.

- Desarrollado por Ivan Cruz.

## Despliegue

El sitio web está desplegado en Cloudflare Pages. Puedes visitarlo directamente aquí: [gestor.mgdc.site](https://gestor.mgdc.site/).

## Licencia

Licencia de Uso Personal:

Este software es propiedad de **Ivan Cruz**. Se permite el uso de este software solo para fines personales y no comerciales. No se permite la distribución, modificación ni uso comercial de este software sin el consentimiento expreso de **Ivan Cruz**.

Cualquier uso no autorizado puede resultar en acciones legales.
