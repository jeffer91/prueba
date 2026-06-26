function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function safe(value, fallback = 'No disponible') {
  if (value === null || value === undefined || value === '') return fallback;
  return String(value);
}

function buildMetric(label, value) {
  return `<article><span>${escapeHtml(label)}</span><strong>${escapeHtml(safe(value))}</strong></article>`;
}

function buildQuickReportHtml({ analysis, video, sections = [], technicalEvents = [] }) {
  const title = video?.original_name || analysis?.local_id || 'Análisis de video';

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(title)} - Reporte rápido</title>
  <style>
    body { margin: 0; font-family: Arial, Helvetica, sans-serif; background: #f4f7fb; color: #132033; }
    main { max-width: 980px; margin: 0 auto; padding: 36px; }
    .cover { background: linear-gradient(135deg, #2457ff, #0f172a); color: #fff; border-radius: 24px; padding: 34px; box-shadow: 0 18px 45px rgba(27,39,66,.15); }
    .cover p { color: #dbeafe; line-height: 1.6; }
    section { background: #fff; border: 1px solid #dbe3ef; border-radius: 20px; padding: 24px; margin-top: 20px; box-shadow: 0 12px 28px rgba(27,39,66,.08); }
    h1, h2, h3 { margin-top: 0; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
    .grid article { background: #f8fafc; border: 1px solid #dbe3ef; border-radius: 16px; padding: 16px; }
    .grid span { display: block; color: #68758a; font-size: 12px; text-transform: uppercase; font-weight: 800; margin-bottom: 8px; }
    .grid strong { font-size: 22px; }
    .item { border-top: 1px solid #dbe3ef; padding: 12px 0; }
    .muted { color: #68758a; }
    code { background: #eef3ff; padding: 2px 6px; border-radius: 6px; }
  </style>
</head>
<body>
  <main>
    <div class="cover">
      <p>VIDEO AUDITOR APP</p>
      <h1>${escapeHtml(title)}</h1>
      <p>${escapeHtml(safe(analysis?.human_summary || analysis?.summary, 'Reporte rápido generado desde la biblioteca local.'))}</p>
    </div>

    <section>
      <h2>Datos generales</h2>
      <p><strong>Creador:</strong> ${escapeHtml(safe(video?.creator_name))}</p>
      <p><strong>Estilo:</strong> ${escapeHtml(safe(video?.style_name))}</p>
      <p><strong>Tema:</strong> ${escapeHtml(safe(video?.topic))}</p>
      <p><strong>Estado:</strong> ${escapeHtml(safe(analysis?.status))}</p>
      <p><strong>JSON técnico:</strong> <code>${escapeHtml(safe(analysis?.analysis_json_path))}</code></p>
    </section>

    <section>
      <h2>Métricas principales</h2>
      <div class="grid">
        ${buildMetric('Cortes', analysis?.cut_count || 0)}
        ${buildMetric('Promedio entre cortes', analysis?.average_cut_seconds || 'N/D')}
        ${buildMetric('Frames', analysis?.frame_count || 0)}
        ${buildMetric('Pausas', analysis?.silence_count || 0)}
        ${buildMetric('Música / sonido', analysis?.music_event_count || 0)}
        ${buildMetric('Secciones', analysis?.section_count || 0)}
      </div>
    </section>

    <section>
      <h2>Resumen técnico</h2>
      <p>${escapeHtml(safe(analysis?.technical_summary))}</p>
    </section>

    <section>
      <h2>Secciones</h2>
      ${sections.length ? sections.map((section) => `<div class="item"><h3>${escapeHtml(section.section_title || 'Sección')}</h3><p class="muted">${escapeHtml(section.start_time || '')} - ${escapeHtml(section.end_time || '')}</p><p>${escapeHtml(section.description || '')}</p></div>`).join('') : '<p class="muted">No hay secciones registradas todavía.</p>'}
    </section>

    <section>
      <h2>Eventos técnicos recientes</h2>
      ${technicalEvents.length ? technicalEvents.slice(0, 25).map((event) => `<div class="item"><strong>${escapeHtml(event.event_label || event.event_type)}</strong><p class="muted">${escapeHtml(event.start_time || '')} ${escapeHtml(event.event_type || '')}</p></div>`).join('') : '<p class="muted">No hay eventos técnicos registrados.</p>'}
    </section>
  </main>
</body>
</html>`;
}

function buildQuickReportTxt({ analysis, video, sections = [], technicalEvents = [] }) {
  const lines = [];
  lines.push('VIDEO AUDITOR APP - REPORTE RAPIDO');
  lines.push('============================================================');
  lines.push(`Video: ${safe(video?.original_name || analysis?.local_id)}`);
  lines.push(`Creador: ${safe(video?.creator_name)}`);
  lines.push(`Estilo: ${safe(video?.style_name)}`);
  lines.push(`Tema: ${safe(video?.topic)}`);
  lines.push(`Estado: ${safe(analysis?.status)}`);
  lines.push('');
  lines.push('RESUMEN');
  lines.push(safe(analysis?.human_summary || analysis?.summary));
  lines.push('');
  lines.push('METRICAS');
  lines.push(`Cortes: ${safe(analysis?.cut_count || 0)}`);
  lines.push(`Promedio entre cortes: ${safe(analysis?.average_cut_seconds)}`);
  lines.push(`Frames: ${safe(analysis?.frame_count || 0)}`);
  lines.push(`Pausas: ${safe(analysis?.silence_count || 0)}`);
  lines.push(`Secciones: ${safe(analysis?.section_count || 0)}`);
  lines.push('');
  lines.push('TECNICO');
  lines.push(safe(analysis?.technical_summary));
  lines.push('');
  lines.push('RUTAS');
  lines.push(`JSON: ${safe(analysis?.analysis_json_path)}`);
  lines.push(`Audio: ${safe(analysis?.audio_path)}`);
  lines.push(`Frames: ${safe(analysis?.frames_folder_path)}`);
  lines.push('');
  lines.push('SECCIONES');
  if (!sections.length) lines.push('Sin secciones registradas.');
  sections.forEach((section) => {
    lines.push(`- ${safe(section.section_title)} (${safe(section.start_time)} - ${safe(section.end_time)})`);
    lines.push(`  ${safe(section.description, '')}`);
  });
  lines.push('');
  lines.push('EVENTOS TECNICOS');
  if (!technicalEvents.length) lines.push('Sin eventos técnicos registrados.');
  technicalEvents.slice(0, 50).forEach((event) => {
    lines.push(`- ${safe(event.event_label || event.event_type)} | ${safe(event.start_time)} | ${safe(event.event_type)}`);
  });

  return lines.join('\n');
}

module.exports = {
  buildQuickReportHtml,
  buildQuickReportTxt
};
