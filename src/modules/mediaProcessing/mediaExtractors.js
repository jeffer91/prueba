const fs = require('fs');
const path = require('path');

const { ensureDir, getFileInfo } = require('../../services/fileService');
const { runFfmpeg } = require('../../services/ffmpegService');

function calculateFrameInterval(durationSeconds, preferredInterval = 5, maxFrames = 300) {
  const duration = Number(durationSeconds) || 0;
  if (duration <= 0) return preferredInterval;

  const estimatedFrames = Math.ceil(duration / preferredInterval);
  if (estimatedFrames <= maxFrames) return preferredInterval;

  return Math.ceil(duration / maxFrames);
}

function listJpgFiles(folderPath) {
  if (!fs.existsSync(folderPath)) return [];

  return fs
    .readdirSync(folderPath)
    .filter((fileName) => fileName.toLowerCase().endsWith('.jpg'))
    .sort()
    .map((fileName) => getFileInfo(path.join(folderPath, fileName)));
}

async function extractAudioWav({ videoPath, outputFolder }) {
  if (!videoPath) throw new Error('No se recibió la ruta del video para extraer audio.');
  if (!outputFolder) throw new Error('No se recibió carpeta destino para audio.');

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

async function extractFrames({ videoPath, outputFolder, durationSeconds, preferredInterval = 5, maxFrames = 300 }) {
  if (!videoPath) throw new Error('No se recibió la ruta del video para extraer fotogramas.');
  if (!outputFolder) throw new Error('No se recibió carpeta destino para fotogramas.');

  ensureDir(outputFolder);

  const intervalSeconds = calculateFrameInterval(durationSeconds, preferredInterval, maxFrames);
  const outputPattern = path.join(outputFolder, 'frame_%05d.jpg');

  await runFfmpeg([
    '-y',
    '-i',
    videoPath,
    '-vf',
    `fps=1/${intervalSeconds}`,
    '-q:v',
    '2',
    outputPattern
  ]);

  const frames = listJpgFiles(outputFolder);

  return {
    ok: true,
    outputFolder,
    intervalSeconds,
    frameCount: frames.length,
    frames
  };
}

module.exports = {
  calculateFrameInterval,
  listJpgFiles,
  extractAudioWav,
  extractFrames
};
