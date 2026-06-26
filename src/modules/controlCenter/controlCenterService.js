const { getStoragePaths } = require('../../services/pathService');
const { getDatabaseInfo, getDatabasePath } = require('../../database/sqliteConnection');
const { getMigrationStatus } = require('../../database/migrations');
const { countVideos } = require('../../database/repositories/videoRepository');
const { countAnalyses } = require('../../database/repositories/analysisRepository');
const { countTemplates } = require('../../database/repositories/templateRepository');
const { getLibrarySummary } = require('../library/libraryService');
const { getComparisonDiagnostic } = require('../comparison/comparisonService');
const { getTemplateDiagnostic } = require('../templates/templateService');
const { checkPath, summarizeChecks, classifyModuleStatus } = require('./healthChecks');

function getStorageHealth() {
  const paths = getStoragePaths();
  const checks = Object.entries(paths).map(([key, value]) => ({ key, ...checkPath(value) }));

  return {
    ok: checks.every((check) => check.ok),
    summary: summarizeChecks(checks),
    checks
  };
}

function getDatabaseHealth() {
  try {
    const info = getDatabaseInfo();
    const migrations = getMigrationStatus();

    return {
      ok: true,
      databasePath: getDatabasePath(),
      info,
      migrations,
      counts: {
        videos: countVideos(),
        analyses: countAnalyses(),
        templates: countTemplates()
      }
    };
  } catch (error) {
    return {
      ok: false,
      message: 'No se pudo verificar SQLite.',
      error: { message: error.message }
    };
  }
}

function getModuleHealth() {
  const library = getLibrarySummary();
  const comparison = getComparisonDiagnostic();
  const templates = getTemplateDiagnostic();

  const modules = [
    { id: 'library', name: 'Biblioteca', status: classifyModuleStatus(library), detail: library },
    { id: 'comparison', name: 'Comparación', status: classifyModuleStatus(comparison), detail: comparison },
    { id: 'templates', name: 'Plantillas', status: classifyModuleStatus(templates), detail: templates }
  ];

  return {
    ok: modules.every((module) => module.status === 'ready'),
    modules
  };
}

function getControlCenterSnapshot() {
  const storage = getStorageHealth();
  const database = getDatabaseHealth();
  const modules = getModuleHealth();

  const ok = storage.ok && database.ok && modules.ok;

  return {
    ok,
    status: ok ? 'healthy' : 'warning',
    generatedAt: new Date().toISOString(),
    storage,
    database,
    modules,
    summary: {
      storageScore: storage.summary.score,
      videos: database.counts?.videos || 0,
      analyses: database.counts?.analyses || 0,
      templates: database.counts?.templates || 0,
      moduleCount: modules.modules.length
    }
  };
}

function getControlCenterRecommendations(snapshot = null) {
  const data = snapshot || getControlCenterSnapshot();
  const recommendations = [];

  if (!data.storage.ok) {
    recommendations.push('Revisar carpetas locales faltantes antes de procesar videos.');
  }

  if (!data.database.ok) {
    recommendations.push('Revisar SQLite y migraciones antes de usar biblioteca, comparación o plantillas.');
  }

  if ((data.summary.analyses || 0) === 0) {
    recommendations.push('Procesar al menos un video para alimentar biblioteca, comparación y plantillas.');
  }

  if ((data.summary.templates || 0) === 0) {
    recommendations.push('Crear una primera plantilla maestra desde análisis guardados.');
  }

  if (!recommendations.length) {
    recommendations.push('El sistema base está listo. Puedes continuar con mejoras de procesamiento, reportes y comparación avanzada.');
  }

  return {
    ok: true,
    recommendations
  };
}

module.exports = {
  getStorageHealth,
  getDatabaseHealth,
  getModuleHealth,
  getControlCenterSnapshot,
  getControlCenterRecommendations
};
