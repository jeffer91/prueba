# Bloque 19 - Reconexión de Importar video y Biblioteca

Este bloque conecta la interfaz con el motor multimedia real.

## Problema detectado

El menú lateral tenía opciones para:

- Importar video
- Biblioteca

Pero el renderer no las estaba abriendo y caían en una pantalla placeholder.

## Archivos agregados

- `src/ui/screens/importScreen.js`
- `src/ui/screens/libraryScreen.js`

## Archivos modificados

- `src/ui/index.html`
- `src/ui/scripts/renderer.js`
- `package.json`

## Funciones activadas

### Importar video

- Seleccionar video local.
- Registrar creador, estilo, tema, objetivo y notas.
- Guardar registro en SQLite.
- Listar videos importados.
- Procesar video con `mediaProcessing.processVideo`.

### Biblioteca

- Ver resumen de videos, análisis y plantillas.
- Listar análisis guardados.
- Ver detalle del análisis.
- Abrir JSON técnico generado.

## Prueba

```bash
npm install
npm run doctor
npm run check
npm start
```

Luego probar:

1. Importar video.
2. Seleccionar un archivo local.
3. Importar a biblioteca.
4. Procesar.
5. Abrir Biblioteca.
6. Ver el análisis generado.

## Resultado esperado

La app debe permitir pasar de:

`Importar video -> Procesar con FFmpeg -> Biblioteca -> Ver análisis`
