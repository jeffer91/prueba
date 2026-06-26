const { spawn } = require('child_process');
const ffmpegPath = require('ffmpeg-static');
const ffprobeStatic = require('ffprobe-static');

function getFfmpegPath() {
  if (!ffmpegPath) throw new Error('No se encontró ffmpeg-static.');
  return ffmpegPath;
}

function getFfprobePath() {
  if (!ffprobeStatic || !ffprobeStatic.path) throw new Error('No se encontró ffprobe-static.');
  return ffprobeStatic.path;
}

function runCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { windowsHide: true });
    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => { stdout += data.toString(); });
    child.stderr.on('data', (data) => { stderr += data.toString(); });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Proceso finalizado con código ${code}. ${stderr}`));
        return;
      }
      resolve({ ok: true, code, stdout, stderr });
    });
  });
}

async function runFfprobeJson(filePath) {
  const result = await runCommand(getFfprobePath(), [
    '-v',
    'quiet',
    '-print_format',
    'json',
    '-show_format',
    '-show_streams',
    filePath
  ]);

  return JSON.parse(result.stdout || '{}');
}

async function runFfmpeg(args = []) {
  return runCommand(getFfmpegPath(), args);
}

function getProcessRunnerDiagnostic() {
  return {
    ok: true,
    ffmpegPath: getFfmpegPath(),
    ffprobePath: getFfprobePath()
  };
}

module.exports = {
  getFfmpegPath,
  getFfprobePath,
  runCommand,
  runFfprobeJson,
  runFfmpeg,
  getProcessRunnerDiagnostic
};
