const fs = require('fs');
const path = require('path');

function exists(targetPath) {
  return fs.existsSync(targetPath);
}

function ensureDir(dirPath) {
  if (!dirPath) {
    throw new Error('No se recibió una ruta de carpeta válida.');
  }

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  return dirPath;
}

function ensureDirs(dirPaths = []) {
  const createdOrChecked = [];

  dirPaths.forEach((dirPath) => {
    ensureDir(dirPath);
    createdOrChecked.push(dirPath);
  });

  return createdOrChecked;
}

function writeJson(filePath, data) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  return filePath;
}

function readJson(filePath, fallback = null) {
  if (!fs.existsSync(filePath)) {
    return fallback;
  }

  const raw = fs.readFileSync(filePath, 'utf8');

  try {
    return JSON.parse(raw);
  } catch (error) {
    return fallback;
  }
}

function writeText(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, String(content || ''), 'utf8');
  return filePath;
}

function appendText(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.appendFileSync(filePath, String(content || ''), 'utf8');
  return filePath;
}

function copyFile(sourcePath, targetPath) {
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`No existe el archivo origen: ${sourcePath}`);
  }

  ensureDir(path.dirname(targetPath));
  fs.copyFileSync(sourcePath, targetPath);

  return targetPath;
}

function getFileInfo(filePath) {
  if (!fs.existsSync(filePath)) {
    return {
      exists: false,
      path: filePath
    };
  }

  const stats = fs.statSync(filePath);

  return {
    exists: true,
    path: filePath,
    name: path.basename(filePath),
    extension: path.extname(filePath).toLowerCase(),
    sizeBytes: stats.size,
    createdAt: stats.birthtime.toISOString(),
    modifiedAt: stats.mtime.toISOString(),
    isFile: stats.isFile(),
    isDirectory: stats.isDirectory()
  };
}

function removeFileIfExists(filePath) {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    return true;
  }

  return false;
}

module.exports = {
  exists,
  ensureDir,
  ensureDirs,
  writeJson,
  readJson,
  writeText,
  appendText,
  copyFile,
  getFileInfo,
  removeFileIfExists
};
