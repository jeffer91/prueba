const { logError } = require('../../services/loggerService');
const {
  createQuickReport,
  getQuickReportDiagnostic
} = require('./quickReportService');

function handleCreateQuickReport(analysisLocalId) {
  try {
    return createQuickReport(analysisLocalId);
  } catch (error) {
    logError('Error en controlador de reporte rápido', error, { analysisLocalId });

    return {
      ok: false,
      message: 'No se pudo crear el reporte rápido.',
      error: {
        message: error.message,
        stack: error.stack
      }
    };
  }
}

function handleQuickReportDiagnostic() {
  try {
    return getQuickReportDiagnostic();
  } catch (error) {
    logError('Error en diagnóstico de reporte rápido', error);

    return {
      ok: false,
      message: 'No se pudo verificar el módulo de reporte rápido.',
      error: {
        message: error.message
      }
    };
  }
}

module.exports = {
  handleCreateQuickReport,
  handleQuickReportDiagnostic
};
