const fs = require('fs');
const path = require('path');

function fileExists(targetPath) {
  return Boolean(targetPath) && fs.existsSync(targetPath);
}

function readJsonFile(filePath) {
  if (!fileExists(filePath)) {
    return {
      ok: false,
      message: 'No existe el archivo JSON solicitado.',
      path: filePath
    };
  }

  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return {
      ok: true,
      path: filePath,
      data: JSON.parse(raw)
    };
  } catch (error) {
    return {
      ok: false,
      message: 'No se pudo leer el JSON.',
      path: filePath,
      error: {
        message: error.message
      }
    };
  }
}

function findManifestPath(backupRoot) {
  if (!backupRoot) {
    return null;
  }

  return path.join(backupRoot, 'backup_manifest.json');
}

function readBackupManifest(backupRoot) {
  const manifestPath = findManifestPath(backupRoot);

  if (!manifestPath) {
    return {
      ok: false,
      message: 'No se recibió la carpeta del respaldo.'
    };
  }

  const result = readJsonFile(manifestPath);

  if (!result.ok) {
    return result;
  }

  return {
    ok: true,
    backupRoot,
    manifestPath,
    manifest: result.data
  };
}

function listBackupFolderItems(backupRoot) {
  if (!fileExists(backupRoot)) {
    return {
      ok: false,
      message: 'La carpeta del respaldo no existe.',
      backupRoot,
      items: []
    };
  }

  const items = fs.readdirSync(backupRoot, { withFileTypes: true }).map((entry) => {
    const itemPath = path.join(backupRoot, entry.name);

    return {
      name: entry.name,
      path: itemPath,
      type: entry.isDirectory() ? 'directory' : 'file'
    };
  });

  return {
    ok: true,
    backupRoot,
    items
  };
}

module.exports = {
  readBackupManifest,
  listBackupFolderItems,
  readJsonFile,
  fileExists
};
