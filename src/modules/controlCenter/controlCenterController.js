const { logError } = require('../../services/loggerService');

const {
  getStorageHealth,
  getDatabaseHealth,
  getModuleHealth,
  getControlCenterSnapshot,
  getControlCenterRecommendations
} = require('./controlCenterService');

function handleGetControlCenterSnapshot() {
  try {
    return getControlCenterSnapshot();
  } catch (error) {
    logError('Error al obtener snapshot del centro de control', error);
    return {
      ok: false,
      message: 'No se pudo obtener el estado general del sistema.',
      error: { message: error.message, stack: error.stack }
    };
  }
}

function handleGetStorageHealth() {
  try {
    return getStorageHealth();
  } catch (error) {
    logError('Error al verificar almacenamiento', error);
    return { ok: false, message: 'No se pudo verificar almacenamiento.', error: { message: error.message } };
  }
}

function handleGetDatabaseHealth() {
  try {
    return getDatabaseHealth();
  } catch (error) {
    logError('Error al verificar base de datos', error);
    return { ok: false, message: 'No se pudo verificar SQLite.', error: { message: error.message } };
  }
}

function handleGetModuleHealth() {
  try {
    return getModuleHealth();
  } catch (error) {
    logError('Error al verificar módulos', error);
    return { ok: false, message: 'No se pudieron verificar los módulos.', error: { message: error.message } };
  }
}

function handleGetControlCenterRecommendations() {
  try {
    const snapshot = getControlCenterSnapshot();
    return getControlCenterRecommendations(snapshot);
  } catch (error) {
    logError('Error al generar recomendaciones de centro de control', error);
    return { ok: false, message: 'No se pudieron generar recomendaciones.', error: { message: error.message } };
  }
}

module.exports = {
  handleGetControlCenterSnapshot,
  handleGetStorageHealth,
  handleGetDatabaseHealth,
  handleGetModuleHealth,
  handleGetControlCenterRecommendations
};
