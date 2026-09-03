# UTET - Respaldo Firestore

Aplicación web sencilla para leer colecciones de Cloud Firestore del proyecto **utet-4387a** y generar respaldos descargables.

## Funciones

- Selección de colecciones.
- Lectura directa desde Cloud Firestore.
- Conteo de documentos por colección.
- Exportación completa a **TXT**.
- Exportación a **PDF**.
- Exportación adicional a **JSON**.
- Generación de archivos directamente en el navegador.
- Compatible con GitHub Pages.

## Colecciones configuradas

- Estudiante
- carreras
- historial
- importaciones
- matriculas
- periodos
- requisitos

También se pueden escribir nombres de colecciones adicionales desde la interfaz.

## Publicación

El repositorio incluye un workflow de GitHub Actions para desplegar automáticamente el contenido de la rama **main** en GitHub Pages.

URL esperada:

https://jeffer91.github.io/prueba/

## Seguridad

La configuración web de Firebase no debe sustituirse por una cuenta de servicio ni por credenciales privadas.

La aplicación respeta las reglas de seguridad de Firestore. Dado que GitHub Pages es público, las reglas de Firestore deben impedir lecturas no autorizadas si la base contiene información sensible.
