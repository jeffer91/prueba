(function () {
  function getElement(selector) {
    return document.querySelector(selector);
  }

  function setDiagnostic(message, data = null) {
    const output = getElement('#diagnosticOutput');
    if (!output) return;
    output.textContent = data ? `${message}\n\n${JSON.stringify(data, null, 2)}` : message;
  }

  function escapeHtml(value) {
    return String(value || '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function renderComparisonBase() {
    return `
      <section class="module-card">
        <div class="module-header compact">
          <div>
            <p class="eyebrow">Bloque 11 activo</p>
            <h3>Comparación entre youtubers y estilos</h3>
            <p>Selecciona dos o más análisis para comparar ritmo visual, audio, retención y estilo.</p>
          </div>
          <button id="btnReloadComparison" type="button" class="secondary-button">Actualizar</button>
        </div>
      </section>

      <section class="module-card">
        <div class="module-header compact">
          <div>
            <h3>Análisis disponibles</h3>
            <p>Marca los análisis que quieres comparar.</p>
          </div>
          <button id="btnRunComparison" type="button" class="primary-button">Comparar seleccionados</button>
        </div>

        <div id="comparisonAnalysesContainer" class="analysis-list">Cargando análisis...</div>
      </section>

      <section class="module-card">
        <div class="module-header">
          <div>
            <h3>Resultado de comparación</h3>
            <p>Aquí aparecerán patrones comunes, diferencias y plantilla base.</p>
          </div>
        </div>
        <div id="comparisonResultContainer" class="empty-state">Todavía no se ha ejecutado una comparación.</div>
      </section>
    `;
  }

  function renderAnalysisOptions(analyses = []) {
    if (!analyses.length) {
      return '<div class="empty-state">No hay análisis disponibles para comparar.</div>';
    }

    return analyses.map((analysis) => `
      <label class="comparison-option">
        <input type="checkbox" class="comparison-checkbox" value="${escapeHtml(analysis.local_id)}" />
        <div>
          <strong>${escapeHtml(analysis.video_original_name || analysis.local_id)}</strong>
          <p>
            Creador: ${escapeHtml(analysis.creator_name || 'Sin creador')}
            · Estilo: ${escapeHtml(analysis.style_name || 'Sin estilo')}
            · Estado: ${escapeHtml(analysis.status || 'Sin estado')}
          </p>
          <small>
            Cortes: ${escapeHtml(analysis.cut_count || 0)} · Silencios: ${escapeHtml(analysis.silence_count || 0)} · Secciones: ${escapeHtml(analysis.section_count || 0)}
          </small>
        </div>
      </label>
    `).join('');
  }

  function renderComparisonResult(result) {
    if (!result || !result.ok) {
      return `<div class="empty-state error">${escapeHtml(result?.message || 'No se pudo comparar.')}</div>`;
    }

    const patterns = result.styleComparison?.patterns || [];
    const template = result.masterTemplate || {};

    return `
      <div class="comparison-result">
        <h4>${escapeHtml(result.summary.label)}</h4>
        <p>${escapeHtml(result.summary.description)}</p>

        <div class="analysis-metrics">
          <span>Análisis: ${escapeHtml(result.totalAnalyses)}</span>
          <span>Estilo dominante: ${escapeHtml(result.summary.dominantStyle)}</span>
          <span>Patrón: ${escapeHtml(result.summary.dominantPattern)}</span>
        </div>

        <h4>Patrones comunes</h4>
        ${patterns.map((pattern) => `<p><strong>${escapeHtml(pattern.label)}:</strong> ${escapeHtml(pattern.description)}</p>`).join('')}

        <h4>Plantilla maestra base</h4>
        <p><strong>Nombre:</strong> ${escapeHtml(template.templateName)}</p>
        <p><strong>Inicio:</strong> ${escapeHtml(template.structure?.opening)}</p>
        <p><strong>Ritmo visual:</strong> ${escapeHtml(template.structure?.visualRhythm)}</p>
        <p><strong>Ritmo de audio:</strong> ${escapeHtml(template.structure?.audioRhythm)}</p>
        <p><strong>Desarrollo:</strong> ${escapeHtml(template.structure?.development)}</p>
        <p><strong>Cierre:</strong> ${escapeHtml(template.structure?.closing)}</p>

        <small>Archivo JSON: ${escapeHtml(result.outputPath)}</small>
      </div>
    `;
  }

  async function loadComparableAnalyses() {
    const container = getElement('#comparisonAnalysesContainer');
    if (!container) return;

    container.innerHTML = 'Cargando análisis...';

    try {
      const result = await window.videoAuditor.comparison.listAnalyses(50);
      if (!result.ok) {
        container.innerHTML = '<div class="empty-state error">No se pudieron cargar análisis.</div>';
        setDiagnostic('Error al cargar análisis comparables.', result);
        return;
      }

      container.innerHTML = renderAnalysisOptions(result.analyses || []);
      setDiagnostic('Análisis comparables cargados.', { total: result.total });
    } catch (error) {
      container.innerHTML = '<div class="empty-state error">Error inesperado.</div>';
      setDiagnostic('Error inesperado al cargar comparables.', { message: error.message });
    }
  }

  async function runComparison() {
    const selected = Array.from(document.querySelectorAll('.comparison-checkbox:checked')).map((input) => input.value);
    const resultContainer = getElement('#comparisonResultContainer');

    if (selected.length < 2) {
      setDiagnostic('Selecciona al menos dos análisis para comparar.', { selected });
      return;
    }

    resultContainer.innerHTML = 'Comparando análisis seleccionados...';

    const result = await window.videoAuditor.comparison.compare({ analysisIds: selected });
    resultContainer.innerHTML = renderComparisonResult(result);
    setDiagnostic('Resultado de comparación.', result);
  }

  function bindComparisonEvents() {
    const reload = getElement('#btnReloadComparison');
    const run = getElement('#btnRunComparison');

    if (reload) reload.addEventListener('click', loadComparableAnalyses);
    if (run) run.addEventListener('click', runComparison);
  }

  async function renderComparisonScreen(container) {
    if (!container) return;
    container.innerHTML = renderComparisonBase();
    bindComparisonEvents();
    await loadComparableAnalyses();
  }

  window.VideoAuditorScreens = window.VideoAuditorScreens || {};
  window.VideoAuditorScreens.renderComparisonScreen = renderComparisonScreen;
})();
