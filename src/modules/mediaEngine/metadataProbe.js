const { runFfprobeJson } = require('./processRunner');

function parseFps(value) {
  if (!value || typeof value !== 'string') return null;
  if (value.includes('/')) {
    const [num, den] = value.split('/').map(Number);
    if (!num || !den) return null;
    return Number((num / den).toFixed(3));
  }
  const fps = Number(value);
  return Number.isFinite(fps) ? fps : null;
}

function toNumberOrNull(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

async function readMediaMetadata(videoPath) {
  if (!videoPath) throw new Error('No se recibió ruta de video.');

  const probe = await runFfprobeJson(videoPath);
  const streams = Array.isArray(probe.streams) ? probe.streams : [];
  const videoStream = streams.find((stream) => stream.codec_type === 'video');
  const audioStream = streams.find((stream) => stream.codec_type === 'audio');

  if (!videoStream) throw new Error('El archivo no contiene stream de video.');

  const durationSeconds =
    toNumberOrNull(videoStream.duration) ||
    toNumberOrNull(probe.format && probe.format.duration);

  return {
    durationSeconds,
    fps: parseFps(videoStream.avg_frame_rate) || parseFps(videoStream.r_frame_rate),
    width: videoStream.width || null,
    height: videoStream.height || null,
    format: probe.format ? probe.format.format_name : null,
    formatLongName: probe.format ? probe.format.format_long_name : null,
    videoCodec: videoStream.codec_name || null,
    videoBitrate: toNumberOrNull(videoStream.bit_rate),
    totalBitrate: probe.format ? toNumberOrNull(probe.format.bit_rate) : null,
    hasAudio: Boolean(audioStream),
    audioCodec: audioStream ? audioStream.codec_name : null,
    audioSampleRate: audioStream ? toNumberOrNull(audioStream.sample_rate) : null,
    audioChannels: audioStream ? audioStream.channels || null : null,
    raw: probe
  };
}

module.exports = {
  readMediaMetadata,
  parseFps
};
