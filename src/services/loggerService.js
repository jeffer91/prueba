const path = require('path');
const { getStoragePaths } = require('./pathService');
const { appendText, ensureDir } = require('./fileService');
const { STORAGE_CONFIG } = require('../config/storageConfig');

function getLogPaths() {
  const storagePaths = getStoragePaths();

  return {
    appLog: path.join(storagePaths.logs, STORAGE_CONFIG.logFileName),
    errorLog: path.join(storagePaths.logs, STORAGE_CONFIG.errorLogFileName)
  };
}

function formatLogLine(level, message, details = null) {
  const payload = {
    timestamp: new Date().toISOString(),
    level,
    message,
    details
  };

  return `${JSON.stringify(payload)}\n`;
}

function initializeLogger() {
  const storagePaths = getStoragePaths();

  ensureDir(storagePaths.logs);

  const logPaths = getLogPaths();

  logInfo('Logger inicializado', {
    appLog: logPaths.appLog,
    errorLog: logPaths.errorLog
  });

  return logPaths;
}

function logInfo(message, details = null) {
  const logPaths = getLogPaths();

  appendText(logPaths.appLog, formatLogLine('INFO', message, details));

  return true;
}

function logWarning(message, details = null) {
  const logPaths = getLogPaths();

  appendText(logPaths.appLog, formatLogLine('WARNING', message, details));

  return true;
}

function logError(message, error = null, details = null) {
  const logPaths = getLogPaths();

  const errorPayload = {
    errorMessage: error ? error.message : null,
    stack: error ? error.stack : null,
    details
  };

  appendText(logPaths.errorLog, formatLogLine('ERROR', message, errorPayload));
  appendText(logPaths.appLog, formatLogLine('ERROR', message, errorPayload));

  return true;
}

function readRecentLogInfo() {
  return {
    logPaths: getLogPaths()
  };
}

module.exports = {
  initializeLogger,
  logInfo,
  logWarning,
  logError,
  readRecentLogInfo
};
