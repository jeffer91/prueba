const path = require('path');
const { app, BrowserWindow, ipcMain, dialog } = require('electron');

const {
  initializeApp,
  getAppStatus,
  runBaseDiagnostic,
  getBaseConfiguration
} = require('../src/app/appController');

const { APP_CONFIG } = require('../src/config/appConfig');

const {
  handleGetVideoImportOptions,
  handleImportVideo,
  handleListRecentImportedVideos,
  handleGetImportedVideo
} = require('../src/modules/videoImport/videoImportController');

const {
  handleProcessImportedVideo,
  handleGetMediaProcessingDiagnostic
} = require('../src/modules/mediaProcessing/processingController');

let mainWindow = null;
let ipcRegistered = false;

function registerBaseIpc() {
  if (ipcRegistered) return;

  ipcMain.handle('app:ping', async () => {
    return {
      ok: true,
      appName: 'Video Auditor App',
      mode: 'electron-local',
      platform: process.platform,
      timestamp: new Date().toISOString()
    };
  });

  ipcMain.handle('app:initialize', async () => {
    return initializeApp();
  });

  ipcMain.handle('app:getStatus', async () => {
    return getAppStatus();
  });

  ipcMain.handle('app:diagnostic', async () => {
    return runBaseDiagnostic();
  });

  ipcMain.handle('app:getConfig', async () => {
    return getBaseConfiguration();
  });

  ipcMain.handle('dialog:selectVideo', async () => {
    const extensions = APP_CONFIG.supportedVideoExtensions.map((extension) =>
      extension.replace('.', '')
    );

    const result = await dialog.showOpenDialog(mainWindow, {
      title: 'Seleccionar video para auditar',
      properties: ['openFile'],
      filters: [
        {
          name: 'Videos permitidos',
          extensions
        }
      ]
    });

    if (result.canceled || !result.filePaths.length) {
      return {
        ok: true,
        canceled: true
      };
    }

    const filePath = result.filePaths[0];

    return {
      ok: true,
      canceled: false,
      filePath,
      fileName: path.basename(filePath)
    };
  });

  ipcMain.handle('videoImport:getOptions', async () => {
    return handleGetVideoImportOptions();
  });

  ipcMain.handle('videoImport:importVideo', async (_event, payload) => {
    return handleImportVideo(payload);
  });

  ipcMain.handle('videoImport:listRecentVideos', async (_event, limit) => {
    return handleListRecentImportedVideos(limit);
  });

  ipcMain.handle('videoImport:getVideo', async (_event, localId) => {
    return handleGetImportedVideo(localId);
  });

  ipcMain.handle('mediaProcessing:processVideo', async (_event, payload) => {
    return handleProcessImportedVideo(payload);
  });

  ipcMain.handle('mediaProcessing:diagnostic', async () => {
    return handleGetMediaProcessingDiagnostic();
  });

  ipcRegistered = true;
}

function createMainWindow() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.focus();
    return mainWindow;
  }

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 1080,
    minHeight: 700,
    title: 'Video Auditor App',
    backgroundColor: '#f4f7fb',
    show: false,
    autoHideMenuBar: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  const indexPath = path.join(__dirname, '..', 'src', 'ui', 'index.html');

  mainWindow.loadFile(indexPath);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();

    if (!app.isPackaged) {
      mainWindow.webContents.openDevTools({ mode: 'detach' });
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  return mainWindow;
}

module.exports = {
  createMainWindow,
  registerBaseIpc
};
