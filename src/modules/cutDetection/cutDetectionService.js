const { analyzeCutFrequency } = require('./cutFrequencyAnalyzer');
const { analyzeVisualRhythm } = require('./visualRhythmAnalyzer');

function buildTechnicalEventsFromCuts(cutEvents = []) {
  return cutEvents.map((event, index) => ({
    event_type: 'cut_detected',
    event_label: `Posible corte ${index + 1}`,
    start_time: event.start_time,
    end_time: event.end_time,
    start_seconds: event.start_seconds,
    end_seconds: event.end_seconds,
    confidence: event.confidence || null,
    details_json: { detector: 'scene_change' }
  }));
}

function analyzeCutsAndVisualRhythm({ events = [], durationSeconds = null }) {
  const frequency = analyzeCutFrequency({ events, durationSeconds });
  const visualRhythm = analyzeVisualRhythm({ events, durationSeconds, frequency });
  const technicalEvents = buildTechnicalEventsFromCuts(events);
  return {
    ok: true,
    cutEvents: events,
    frequency,
    visualRhythm,
    technicalEvents,
    summary: {
      cutCount: frequency.cutCount,
      averageCutSeconds: frequency.averageCutSeconds,
      medianCutSeconds: frequency.medianCutSeconds,
      cutsPerMinute: frequency.cutsPerMinute,
      rhythmLevel: visualRhythm.rhythm.level,
      rhythmLabel: visualRhythm.rhythm.label
    }
  };
}

module.exports = { analyzeCutsAndVisualRhythm };
