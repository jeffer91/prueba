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

  function renderBase() {
    return `
      <section class="module-card">
        <div class="module-header compact">
          <div>
            <p class="eyebrow">Bloque 16 activo</p>
            <h3>Revisión de respaldos y modo reparación</h3>
            <p>Valida respaldos, compara datos actuales y reconstruye carpetas locales faltantes.</p>
          </div>
          <button id="btnReloadRecovery" type="button" class="secondary-button">Actualizar</button>
        </div>
      </section>

      <section class="module-card">
        <div class="module-header compact">
          <div>
            <h3>Modo reparación</h3>
            <p>Reconstruye carpetas locales faltantes sin modificar archivos existentes.</p>
          </div>
          <button id="btnRepairStructure" type="button" class="primary-button">Reparar estructura</button>
        </div>
      </section>

      <section class="module-card">
        <div class="module-header">
          <div>
            <h3>Respaldos disponibles</h3>
            <p>Selecciona un respaldo para validarlo y crear una vista previa.</p>
          </div>
        </div>
        <div id="recoveryBackupsContainer" class="analysis-list">Cargando respaldos...</div>
      </section>

      <section class="module-card">
        <div class="module-header">
          <div>
            <h3>Vista previa</h3>
            <p>Selecciona carpetas para simular el plan de recuperación.</p>
          </div>
        </div>

        <input id="selectedRecoveryRoot" type="text" readonly placeholder="Selecciona un respaldo" />

        <div class="restore-options-grid">
          <label class="checkbox-row"><input type="checkbox" id="recoverDatabase" /> SQLite</label>
          <label class="checkbox-row"><input type="checkbox" id="recoverAnalysisJson" /> Análisis JSON</label>
          <label class="checkbox-row"><input type="checkbox" id="recoverTemplates" /> Plantillas</label>
          <label class="checkbox-row"><input type="checkbox" id="recoverTranscripts" /> Transcripciones</label>
          <label class="checkbox-row"><input type="checkbox" id="recoverReportsPdf" /> Reportes PDF</label>
          <label class="checkbox-row"><input type="checkbox" id="recoverReportsTxt" /> Reportes TXT</label>
          <label class="checkbox-row"><input type="checkbox" id="recoverLogs" /> Logs</label>
          <label class="checkbox-row"><input type="checkbox" id="recoverVideos" /> Videos</label>
        </div>

        <div class="form-actions">
          <button id="btnValidateRecovery" type="button" class="secondary-button">Validar respaldo</button>
          <button id="btnBuildRecoveryPlan" type="button" class="primary-button">Crear vista previa</button>
        </div>
      </section>
    `;
  }

  function renderBackups(backups = []) {
    if (!backups.length) return '<div class="empty-state">No hay respaldos disponibles.</div>';

    return backups.map((backup) => `
      <article class="analysis-card">
        <div class="analysis-main">
          <div class="analysis-topline"><span class="mini-badge ready">Backup</span><span class="analysis-date">${escapeHtml(backup.generatedAt || '')}</span></div>
          <h4>${escapeHtml(backup.backupId)}</h4>
          <p><strong>Videos incluidos:</strong> ${backup.includeVideos ? 'Sí' : 'No'}</p>
          <small>${escapeHtml(backup.backupRoot)}</small>
        </div>
        <div class="analysis-actions">
          <button class="secondary-button small-button btn-select-recovery" data-path="${escapeHtml(backup.backupRoot)}">Seleccionar</button>
          <button class="secondary-button small-button btn-open-recovery" data-path="${escapeHtml(backup.backupRoot)}">Abrir carpeta</button>
        </div>
      </article>
    `).join('');
  }

  function getPlanPayload() {
    return {
      backupRoot: getElement('#selectedRecoveryRoot')?.value || '',
      restoreDatabase: Boolean(getElement('#recoverDatabase')?.checked),
      restoreAnalysisJson: Boolean(getElement('#recoverAnalysisJson')?.checked),
      restoreTemplates: Boolean(getElement('#recoverTemplates')?.checked),
      restoreTranscripts: Boolean(getElement('#recoverTranscripts')?.checked),
      restoreReportsPdf: Boolean(getElement('#recoverReportsPdf')?.checked),
      restoreReportsTxt: Boolean(getElement('#recoverReportsTxt')?.checked),
      restoreLogs: Boolean(getElement('#recoverLogs')?.checked),
      restoreVideos: Boolean(getElement('#recoverVideos')?.checked),
      overwrite: false
    };
  }

  async function loadBackups() {
    const container = getElement('#recoveryBackupsContainer');
    if (!container) return;

    const result = await window.videoAuditor.restore.listBackups();
    container.innerHTML = renderBackups(result.backups || []);

    document.querySelectorAll('.btn-select-recovery').forEach((button) => {
      button.addEventListener('click', () => {
        getElement('#selectedRecoveryRoot').value = button.dataset.path;
        setDiagnostic('Respaldo seleccionado.', { backupRoot: button.dataset.path });
      });
    });

    document.querySelectorAll('.btn-open-recovery').forEach((button) => {
      button.addEventListener('click', async () => {
        const opened = await window.videoAuditor.fileSystem.openPath(button.dataset.path);
        setDiagnostic('Apertura de carpeta.', opened);
      });
    });
  }

  async function repairStructure() {
    const result = await window.videoAuditor.restore.repairStructure();
    setDiagnostic('Resultado de reparación.', result);
  }

  async function validateSelected() {
    const backupRoot = getElement('#selectedRecoveryRoot')?.value || '';
    const result = await window.videoAuditor.restore.validate(backupRoot);
    setDiagnostic('Validación del respaldo.', result);
  }

  async function buildPlan() {
    const result = await window.videoAuditor.restore.plan(getPlanPayload());
    setDiagnostic('Vista previa de recuperación.', result);
  }

  function bindEvents() {
    getElement('#btnReloadRecovery')?.addEventListener('click', loadBackups);
    getElement('#btnRepairStructure')?.addEventListener('click', repairStructure);
    getElement('#btnValidateRecovery')?.addEventListener('click', validateSelected);
    getElement('#btnBuildRecoveryPlan')?.addEventListener('click', buildPlan);
  }

  async function renderRecoveryScreen(container) {
    if (!container) return;
    container.innerHTML = renderBase();
    bindEvents();
    await loadBackups();
  }

  window.VideoAuditorScreens = window.VideoAuditorScreens || {};
  window.VideoAuditorScreens.renderRecoveryScreen = renderRecoveryScreen;
})();
