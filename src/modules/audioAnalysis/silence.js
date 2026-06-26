function secondsToTime(seconds) {
  const safeSeconds = Math.max(0, Number(seconds) || 0);
  const totalSeconds = Math.floor(safeSeconds);
  const minutes = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function buildSilenceTechnicalEvents(silences = []) {
  return silences.map((item, index) => ({
    event_type: item.duration_seconds >= 1.2 ? 'long_silence_detected' : 'silence_detected',
    event_label: item.duration_seconds >= 1.2 ? `Silencio largo ${index + 1}` : `Silencio ${index + 1}`,
    start_time: item.start_time,
    end_time: item.end_time,
    start_seconds: item.start_seconds,
    end_seconds: item.end_seconds,
    confidence: null,
    details_json: { durationSeconds: item.duration_seconds }
  }));
}

async function detectSilences() {
  const silences = [];
  return { ok: true, detector: 'base_silence_detector', silenceCount: 0, silences, technicalEvents: buildSilenceTechnicalEvents(silences) };
}

module.exports = { detectSilences, buildSilenceTechnicalEvents, secondsToTime };
