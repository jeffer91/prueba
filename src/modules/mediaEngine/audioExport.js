const path = require('path');
const { ensureDir, getFileInfo } = require('../../services/fileService');
const { runFfmpeg } = require('./processRunner');

async function exportAudioWav({ videoPath, outputFolder }) {
  if (!videoPath) throw new Error('No se recibió ruta de video.');
  if (!outputFolder) throw new Error('No se recibió carpeta destino de audio.');

  ensureDir(outputFolder);

  const outputPath = path.join(outputFolder, 'audio_16khz_mono.wav');

  await runFfmpeg([
    '-y',
    '-i',
    videoPath,
    '-vn',
    '-acodec',
    'pcm_s16le',
    '-ar',
    '16000',
    '-ac',
    '1',
    outputPath
  ]);

  return {
    ok: true,
    audioPath: outputPath,
    info: getFileInfo(outputPath)
  };
}

module.exports = {
  exportAudioWav
};
