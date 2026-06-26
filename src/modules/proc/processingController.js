function handleProcessImportedVideo() {
  return Promise.resolve({ ok: false, message: 'Pendiente.' });
}

function handleGetMediaProcessingDiagnostic() {
  return { ok: true, module: 'proc' };
}

module.exports = { handleProcessImportedVideo, handleGetMediaProcessingDiagnostic };
