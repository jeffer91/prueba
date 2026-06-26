const path = require('path');
const { ensureDir, writeText, writeJson } = require('../../services/fileService');
const { buildTranscriptDraftText, buildTranscriptDraftJson } = require('./transcriptFormatter');

function createLocalTranscriptDraft({ analysisLocalId, video, speechSegments = [], outputFolder }) {
  if (!analysisLocalId) throw new Error('No se recibió el ID del análisis.');
  if (!video) throw new Error('No se recibió la información del video.');
  if (!outputFolder) throw new Error('No se recibió la carpeta destino.');

  ensureDir(outputFolder);
  const transcriptTxtPath = path.join(outputFolder, `${analysisLocalId}.transcript.txt`);
  const transcriptJsonPath = path.join(outputFolder, `${analysisLocalId}.transcript.json`);

  const transcriptText = buildTranscriptDraftText({
    videoName: video.original_name,
    creatorName: video.creator_name,
    styleName: video.style_name,
    topic: video.topic,
    speechSegments
  });

  const transcriptJson = buildTranscriptDraftJson({
    analysisLocalId,
    videoLocalId: video.local_id,
    videoName: video.original_name,
    creatorName: video.creator_name,
    styleName: video.style_name,
    topic: video.topic,
    speechSegments
  });

  writeText(transcriptTxtPath, transcriptText);
  writeJson(transcriptJsonPath, transcriptJson);

  return {
    ok: true,
    status: 'pending_stt_engine',
    transcriptTxtPath,
    transcriptJsonPath,
    segmentCount: speechSegments.length,
    wordCount: 0,
    message: 'Transcripción base creada.'
  };
}

function getLocalTranscriptionDiagnostic() {
  return { ok: true, module: 'localTranscriptionService', status: 'draft_mode' };
}

module.exports = { createLocalTranscriptDraft, getLocalTranscriptionDiagnostic };
