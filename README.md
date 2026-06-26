# Video Auditor App

App local Electron para auditoría inteligente de videos.

## Estado actual

Versión inicial subida hasta el Bloque 7.

Incluye:

- Base Electron funcional.
- Estructura modular.
- SQLite local.
- Importador de videos desde la PC.
- Procesamiento técnico con FFmpeg/FFprobe.
- Extracción de audio y fotogramas.
- Detección de cortes y ritmo visual.
- Análisis base de audio, silencios y transcripción por segmentos.

## Ejecución

```bash
npm install
npm start
```

## Revisión básica

```bash
npm run check
```

## Nota

La app es local. Los datos generados se guardan en la carpeta `data/`, la cual no se sube al repositorio.
