const STORAGE_FOLDERS = {
  dataRoot: 'data',
  database: 'data/database',
  videos: 'data/videos',
  audio: 'data/audio',
  frames: 'data/frames',
  transcripts: 'data/transcripts',
  reportsPdf: 'data/reports_pdf',
  reportsTxt: 'data/reports_txt',
  analysisJson: 'data/analysis_json',
  templates: 'data/templates',
  logs: 'data/logs',
  temp: 'data/temp',
  exports: 'data/exports'
};

const STORAGE_CONFIG = {
  useProjectDataFolder: true,
  autoCreateFolders: true,
  logFileName: 'app.log',
  errorLogFileName: 'errors.log',
  diagnosticFileName: 'diagnostic.json'
};

module.exports = {
  STORAGE_FOLDERS,
  STORAGE_CONFIG
};
