const path = require('path');
const { STORAGE_FOLDERS } = require('../config/storageConfig');

function getProjectRoot() {
  return path.resolve(__dirname, '..', '..');
}

function resolveFromRoot(relativePath) {
  return path.join(getProjectRoot(), relativePath);
}

function getDataRootPath() {
  return resolveFromRoot(STORAGE_FOLDERS.dataRoot);
}

function getStoragePaths() {
  return {
    projectRoot: getProjectRoot(),
    dataRoot: getDataRootPath(),
    database: resolveFromRoot(STORAGE_FOLDERS.database),
    videos: resolveFromRoot(STORAGE_FOLDERS.videos),
    audio: resolveFromRoot(STORAGE_FOLDERS.audio),
    frames: resolveFromRoot(STORAGE_FOLDERS.frames),
    transcripts: resolveFromRoot(STORAGE_FOLDERS.transcripts),
    reportsPdf: resolveFromRoot(STORAGE_FOLDERS.reportsPdf),
    reportsTxt: resolveFromRoot(STORAGE_FOLDERS.reportsTxt),
    analysisJson: resolveFromRoot(STORAGE_FOLDERS.analysisJson),
    templates: resolveFromRoot(STORAGE_FOLDERS.templates),
    logs: resolveFromRoot(STORAGE_FOLDERS.logs),
    temp: resolveFromRoot(STORAGE_FOLDERS.temp),
    exports: resolveFromRoot(STORAGE_FOLDERS.exports)
  };
}

function getPathByKey(key) {
  const paths = getStoragePaths();
  return paths[key] || null;
}

function buildVideoWorkFolder(videoId) {
  const safeVideoId = String(videoId || '').trim();

  if (!safeVideoId) {
    throw new Error('No se recibió un ID válido para crear la carpeta del video.');
  }

  return {
    root: path.join(getStoragePaths().dataRoot, 'videos_work', safeVideoId),
    audio: path.join(getStoragePaths().dataRoot, 'videos_work', safeVideoId, 'audio'),
    frames: path.join(getStoragePaths().dataRoot, 'videos_work', safeVideoId, 'frames'),
    transcripts: path.join(getStoragePaths().dataRoot, 'videos_work', safeVideoId, 'transcripts'),
    reports: path.join(getStoragePaths().dataRoot, 'videos_work', safeVideoId, 'reports'),
    temp: path.join(getStoragePaths().dataRoot, 'videos_work', safeVideoId, 'temp')
  };
}

module.exports = {
  getProjectRoot,
  resolveFromRoot,
  getDataRootPath,
  getStoragePaths,
  getPathByKey,
  buildVideoWorkFolder
};
