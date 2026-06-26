# Bloque 20 - Reporte simple desde Biblioteca

Este bloque agrega reportes rápidos HTML y TXT desde cada análisis guardado.

## Archivos agregados

- `src/modules/quickReport/quickReportBuilder.js`
- `src/modules/quickReport/quickReportService.js`
- `src/modules/quickReport/quickReportController.js`
- `docs/BLOQUE_20_REPORTE_RAPIDO.md`

## Archivos modificados

- `electron/windowManager.js`
- `electron/preload.js`
- `src/ui/screens/libraryScreen.js`
- `package.json`

## Funciones

Desde Biblioteca ahora se puede:

- Crear reporte rápido.
- Generar HTML visual.
- Generar TXT técnico resumido.
- Guardar rutas del reporte en SQLite.
- Abrir HTML desde la app.
- Abrir TXT desde la app.

## Flujo de prueba

```bash
npm install
npm run doctor
npm run check
npm start
```

Dentro de la app:

1. Importar video.
2. Procesar video.
3. Ir a Biblioteca.
4. Clic en Crear reporte.
5. Abrir HTML o TXT.

## Resultado esperado

Los reportes se guardan en:

```txt
data/videos_work/<videoId>/reports/
```

Con archivos similares a:

```txt
analysis_xxxxx.quick.html
analysis_xxxxx.quick.txt
```
