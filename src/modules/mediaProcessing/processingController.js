const {
  processVideoWithMediaEngine,
  getMediaEngineDiagnostic
} = require('../mediaEngine/mediaEngineService');

async function handleProcessImportedVideo(payload) {
  return processVideoWithMediaEngine(payload || {});
}

function handleGetMediaProcessingDiagnostic() {
  const engine = getMediaEngineDiagnostic();

  return {
    ok: true,
    module: 'mediaProcessing',
    status: 'connected_to_mediaEngine',
    engine
  };
}

module.exports = {
  handleProcessImportedVideo,
  handleGetMediaProcessingDiagnostic
};
