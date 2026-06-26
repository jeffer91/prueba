# Bloque 18 - Refuerzo real del procesamiento FFmpeg

Este bloque activa y verifica procesamiento multimedia real con FFmpeg/FFprobe.

## Archivos agregados

- `src/modules/mediaProcessing/mediaMetadata.js`
- `src/modules/mediaProcessing/mediaExtractors.js`
- `src/modules/mediaProcessing/mediaVisualScan.js`
- `src/modules/mediaProcessing/mediaAudioScan.js`

## Archivos verificados existentes

- `src/modules/mediaEngine/processRunner.js`
- `src/modules/mediaEngine/metadataProbe.js`
- `src/modules/mediaEngine/audioExport.js`
- `src/modules/mediaEngine/frameExport.js`
- `src/modules/mediaEngine/mediaEngineService.js`
- `src/modules/mediaProcessing/processingController.js`

## Archivos actualizados

- `src/modules/mediaEngine/mediaEngineService.js`
- `package.json`

## Funciones activadas

- Lectura real de metadatos con FFprobe.
- Extraccion real de audio WAV.
- Extraccion real de fotogramas JPG.
- Deteccion real de cambios visuales con FFmpeg scene select.
- Deteccion real de pausas con FFmpeg silencedetect.
- Guardado de resumen tecnico en JSON.
- Guardado de analisis en SQLite.
- Guardado de eventos tecnicos.

## Comandos de prueba

```bash
npm install
npm run doctor
npm run check
npm start
```

## Prueba dentro de la app

1. Importar video.
2. Procesar video.
3. Revisar `data/videos_work/<videoId>/audio`.
4. Revisar `data/videos_work/<videoId>/frames`.
5. Revisar `data/analysis_json`.
6. Revisar biblioteca y diagnostico.

## Resultado esperado

- Audio WAV si el video tiene audio.
- Frames JPG extraidos.
- JSON tecnico con metadata, visual y audioAnalysis.
- SQLite actualizado con cut_count, frame_count y silence_count.
