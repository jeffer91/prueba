const { logError } = require('../../services/loggerService');

const {
  getLibrarySummary,
  listLibraryAnalyses,
  listLibraryVideos,
  getAnalysisDetails,
  getRecentLibraryActivity
} = require('./libraryService');

function handleGetLibrarySummary() {
  try {
    return getLibrarySummary();
  } catch (error) {
    logError('Error al obtener resumen de biblioteca', error);
    return { ok: false, message: 'No se pudo obtener el resumen de biblioteca.', error: { message: error.message } };
  }
}

function handleListLibraryAnalyses(payload) {
  try {
    return listLibraryAnalyses(payload || {});
  } catch (error) {
    logError('Error al listar análisis de biblioteca', error, payload);
    return { ok: false, message: 'No se pudieron listar los análisis.', error: { message: error.message } };
  }
}

function handleListLibraryVideos(payload) {
  try {
    return listLibraryVideos(payload || {});
  } catch (error) {
    logError('Error al listar videos de biblioteca', error, payload);
    return { ok: false, message: 'No se pudieron listar los videos.', error: { message: error.message } };
  }
}

function handleGetAnalysisDetails(analysisLocalId) {
  try {
    return getAnalysisDetails(analysisLocalId);
  } catch (error) {
    logError('Error al obtener detalle del análisis', error, { analysisLocalId });
    return { ok: false, message: 'No se pudo obtener el detalle del análisis.', error: { message: error.message } };
  }
}

function handleGetRecentLibraryActivity(limit) {
  try {
    return getRecentLibraryActivity(limit);
  } catch (error) {
    logError('Error al obtener actividad reciente de biblioteca', error);
    return { ok: false, message: 'No se pudo obtener la actividad reciente.', error: { message: error.message } };
  }
}

module.exports = {
  handleGetLibrarySummary,
  handleListLibraryAnalyses,
  handleListLibraryVideos,
  handleGetAnalysisDetails,
  handleGetRecentLibraryActivity
};
