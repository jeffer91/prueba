function average(numbers = []) {
  if (!numbers.length) return null;
  const total = numbers.reduce((sum, value) => sum + value, 0);
  return Number((total / numbers.length).toFixed(3));
}

function buildSpeechSegments({ silences = [], durationSeconds = null }) {
  const safeDuration = Number(durationSeconds) || 0;
  if (safeDuration <= 0) return [];
  const sortedSilences = [...silences].sort((a, b) => a.start_seconds - b.start_seconds);
  const speechSegments = [];
  let cursor = 0;
  sortedSilences.forEach((silence) => {
    const start = Number(silence.start_seconds) || 0;
    const end = Number(silence.end_seconds) || start;
    if (start > cursor) {
      const duration = start - cursor;
      if (duration >= 0.25) speechSegments.push({ start_seconds: Number(cursor.toFixed(3)), end_seconds: Number(start.toFixed(3)), duration_seconds: Number(duration.toFixed(3)) });
    }
    cursor = Math.max(cursor, end);
  });
  if (cursor < safeDuration) {
    const duration = safeDuration - cursor;
    if (duration >= 0.25) speechSegments.push({ start_seconds: Number(cursor.toFixed(3)), end_seconds: Number(safeDuration.toFixed(3)), duration_seconds: Number(duration.toFixed(3)) });
  }
  return speechSegments;
}

function classifyAudioRhythm({ speechRatio, pausesPerMinute, averageSpeechSegmentSeconds, averageSilenceSeconds }) {
  if (speechRatio === null || pausesPerMinute === null) return { level: 'unknown', label: 'Ritmo de audio no determinado', description: 'No hay suficientes datos.' };
  if (speechRatio >= 0.86 && pausesPerMinute <= 6 && averageSpeechSegmentSeconds >= 8) return { level: 'continuous', label: 'Ritmo muy continuo', description: 'Pocas pausas y bloques largos.' };
  if (speechRatio >= 0.76 && pausesPerMinute <= 10) return { level: 'fast', label: 'Ritmo rápido', description: 'Movimiento constante con pausas limitadas.' };
  if (speechRatio >= 0.62 && pausesPerMinute <= 16) return { level: 'balanced', label: 'Ritmo equilibrado', description: 'Combina explicación con pausas.' };
  if (averageSilenceSeconds >= 1.2 || pausesPerMinute > 16) return { level: 'paused', label: 'Ritmo pausado', description: 'Muchas pausas o silencios largos.' };
  return { level: 'moderate', label: 'Ritmo moderado', description: 'Velocidad media.' };
}

function analyzeAudioRhythm({ silences = [], durationSeconds = null }) {
  const safeDuration = Number(durationSeconds) || 0;
  const speechSegments = buildSpeechSegments({ silences, durationSeconds: safeDuration });
  const totalSilenceSeconds = silences.reduce((sum, silence) => sum + (Number(silence.duration_seconds) || 0), 0);
  const totalSpeechSeconds = speechSegments.reduce((sum, segment) => sum + (Number(segment.duration_seconds) || 0), 0);
  const averageSilenceSeconds = average(silences.map((silence) => silence.duration_seconds));
  const averageSpeechSegmentSeconds = average(speechSegments.map((segment) => segment.duration_seconds));
  const minutes = safeDuration > 0 ? safeDuration / 60 : null;
  const pausesPerMinute = minutes && minutes > 0 ? Number((silences.length / minutes).toFixed(3)) : null;
  const speechRatio = safeDuration > 0 ? Number((totalSpeechSeconds / safeDuration).toFixed(3)) : null;
  const rhythm = classifyAudioRhythm({ speechRatio, pausesPerMinute, averageSpeechSegmentSeconds, averageSilenceSeconds });
  return { ok: true, durationSeconds: safeDuration, silenceCount: silences.length, speechSegmentCount: speechSegments.length, totalSilenceSeconds: Number(totalSilenceSeconds.toFixed(3)), totalSpeechSeconds: Number(totalSpeechSeconds.toFixed(3)), speechRatio, pausesPerMinute, averageSilenceSeconds, averageSpeechSegmentSeconds, speechSegments, rhythm, technicalEvents: [] };
}

module.exports = { analyzeAudioRhythm, buildSpeechSegments, classifyAudioRhythm };
