function average(values = []) {
  const clean = values.map(Number).filter((value) => Number.isFinite(value));
  if (!clean.length) return null;
  const total = clean.reduce((sum, value) => sum + value, 0);
  return Number((total / clean.length).toFixed(3));
}

function inferDominantValue(items = [], key, fallback = 'Sin definir') {
  const map = new Map();
  items.forEach((item) => {
    const value = item[key] || fallback;
    map.set(value, (map.get(value) || 0) + 1);
  });
  return Array.from(map.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || fallback;
}

function inferPacingProfile(analyses = []) {
  const avgCuts = average(analyses.map((analysis) => analysis.cut_count));
  const avgSilences = average(analyses.map((analysis) => analysis.silence_count));
  const avgSections = average(analyses.map((analysis) => analysis.section_count));

  let level = 'balanced';
  let label = 'Ritmo equilibrado';
  let recommendation = 'Mantener cortes y pausas en punto medio, renovando atención por secciones.';

  if ((avgCuts || 0) >= 40) {
    level = 'dynamic';
    label = 'Ritmo dinámico';
    recommendation = 'Usar cortes frecuentes, cambios visuales, zooms y recursos de apoyo cada pocos segundos.';
  }

  if ((avgSilences || 0) >= 15) {
    level = 'paused';
    label = 'Ritmo pausado';
    recommendation = 'Usar pausas intencionales, eliminar silencios muertos y reforzar momentos reflexivos con visuales.';
  }

  return {
    level,
    label,
    recommendation,
    metrics: {
      averageCuts: avgCuts,
      averageSilences: avgSilences,
      averageSections: avgSections
    }
  };
}

function buildMasterTemplate({ analyses = [], comparison = null, name = null }) {
  const dominantStyle = comparison?.masterTemplate?.dominantStyle || inferDominantValue(analyses, 'style_name', 'Estilo mixto');
  const dominantCreator = inferDominantValue(analyses, 'creator_name', 'Varios creadores');
  const pacingProfile = inferPacingProfile(analyses);

  return {
    templateName: name || `Plantilla maestra - ${dominantStyle}`,
    styleName: dominantStyle,
    sourceCreator: dominantCreator,
    sourceAnalysisCount: analyses.length,
    sourceAnalysisIds: analyses.map((analysis) => analysis.local_id),
    createdAt: new Date().toISOString(),
    pacingProfile,
    structure: {
      hook: {
        duration: '0 a 20 segundos',
        goal: 'Captar atención con promesa, conflicto, pregunta o imagen fuerte.',
        editing: pacingProfile.level === 'dynamic' ? 'Usar cortes rápidos, texto en pantalla y apoyo visual desde el inicio.' : 'Usar entrada clara, buena frase inicial y apoyo visual suficiente.'
      },
      setup: {
        duration: '20% a 25% inicial del video',
        goal: 'Explicar contexto y por qué el tema importa.',
        editing: 'Combinar rostro, imágenes, textos y cortes que eviten monotonía.'
      },
      development: {
        duration: 'Bloque central del video',
        goal: 'Desarrollar la idea con ejemplos, argumentos o historia.',
        editing: pacingProfile.recommendation
      },
      retentionPeaks: {
        goal: 'Renovar la atención cada cierto tiempo.',
        techniques: [
          'cambio de plano',
          'imagen o meme de apoyo',
          'texto grande en pantalla',
          'pregunta al espectador',
          'mini conclusión antes de avanzar'
        ]
      },
      closing: {
        duration: 'Último bloque del video',
        goal: 'Cerrar con conclusión, remate o llamada a la acción.',
        editing: 'Evitar alargar el cierre; terminar con frase clara.'
      }
    },
    productionChecklist: [
      'Definir promesa del video antes de grabar.',
      'Preparar recursos visuales por cada idea importante.',
      'Marcar pausas intencionales y eliminar silencios muertos.',
      'Agregar cambios visuales en secciones largas.',
      'Cerrar cada bloque con una idea completa.',
      'Revisar si el inicio engancha antes de los 10 segundos.'
    ],
    notes: 'Plantilla generada localmente a partir de análisis guardados.'
  };
}

module.exports = {
  buildMasterTemplate,
  inferPacingProfile,
  inferDominantValue
};
