const fs = require('fs');
const path = require('path');

const { ensureDir } = require('../../services/fileService');
const { buildVideoWorkFolder } = require('../../services/pathService');
const { logInfo, logError } = require('../../services/loggerService');
const { findVideoByLocalId } = require('../../database/repositories/videoRepository');
const {
  findAnalysisByLocalId,
  updateAnalysis,
  listSections,
  listTechnicalEvents
} = require('../../database/repositories/analysisRepository');
const {
  buildQuickReportHtml,
  buildQuickReportTxt
} = require('./quickReportBuilder');

function writeTextFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf8');
}

function buildReportPaths({ analysis, video }) {
  const workFolders = buildVideoWorkFolder(video.local_id);
  ensureDir(workFolders.reports);

  return {
    htmlPath: path.join(workFolders.reports, `${analysis.local_id}.quick.html`),
    txtPath: path.join(workFolders.reports, `${analysis.local_id}.quick.txt`),
    reportsFolder: workFolders.reports
  };
}

function createQuickReport(analysisLocalId) {
  try {
    if (!analysisLocalId) {
      return {
        ok: false,
        message: 'No se recibió el ID del análisis.'
      };
    }

    const analysis = findAnalysisByLocalId(analysisLocalId);

    if (!analysis) {
      return {
        ok: false,
        message: 'No se encontró el análisis solicitado.'
      };
    }

    const video = findVideoByLocalId(analysis.video_local_id);

    if (!video) {
      return {
        ok: false,
        message: 'No se encontró el video relacionado con el análisis.'
      };
    }

    const sections = listSections(analysis.local_id);
    const technicalEvents = listTechnicalEvents(analysis.local_id);
    const paths = buildReportPaths({ analysis, video });

    const html = buildQuickReportHtml({ analysis, video, sections, technicalEvents });
    const txt = buildQuickReportTxt({ analysis, video, sections, technicalEvents });

    writeTextFile(paths.htmlPath, html);
    writeTextFile(paths.txtPath, txt);

    const updatedAnalysis = updateAnalysis(analysis.local_id, {
      pdf_report_path: paths.htmlPath,
      txt_report_path: paths.txtPath
    });

    logInfo('Reporte rápido creado', {
      analysisLocalId,
      htmlPath: paths.htmlPath,
      txtPath: paths.txtPath
    });

    return {
      ok: true,
      message: 'Reporte rápido creado correctamente.',
      analysis: updatedAnalysis,
      htmlPath: paths.htmlPath,
      txtPath: paths.txtPath,
      reportsFolder: paths.reportsFolder
    };
  } catch (error) {
    logError('Error al crear reporte rápido', error, { analysisLocalId });

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

function getQuickReportDiagnostic() {
  return {
    ok: true,
    module: 'quickReport',
    status: 'ready',
    features: [
      'generar HTML rápido',
      'generar TXT rápido',
      'guardar rutas en SQLite',
      'abrir desde biblioteca'
    ]
  };
}

module.exports = {
  createQuickReport,
  getQuickReportDiagnostic
};
