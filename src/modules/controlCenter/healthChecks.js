const fs = require('fs');

function checkPath(pathValue) {
  if (!pathValue) {
    return { ok: false, exists: false, path: pathValue, message: 'Ruta no definida.' };
  }

  const exists = fs.existsSync(pathValue);
  let type = 'missing';

  if (exists) {
    const stat = fs.statSync(pathValue);
    type = stat.isDirectory() ? 'directory' : 'file';
  }

  return {
    ok: exists,
    exists,
    type,
    path: pathValue,
    message: exists ? 'Ruta disponible.' : 'Ruta no encontrada.'
  };
}

function summarizeChecks(checks = []) {
  const total = checks.length;
  const passed = checks.filter((check) => check.ok).length;
  const failed = total - passed;

  return {
    total,
    passed,
    failed,
    score: total ? Number(((passed / total) * 100).toFixed(1)) : 0,
    status: failed === 0 ? 'healthy' : 'warning'
  };
}

function classifyModuleStatus(value) {
  if (value && value.ok === true) return 'ready';
  if (value && value.ok === false) return 'error';
  return 'unknown';
}

module.exports = {
  checkPath,
  summarizeChecks,
  classifyModuleStatus
};
