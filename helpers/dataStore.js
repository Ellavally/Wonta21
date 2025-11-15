// helpers/dataStore.js
const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');

function loadJson(name, fallback = []) {
  const file = path.join(__dirname, '..', 'data', `${name}.json`);
  try {
    if (!fs.existsSync(file)) {
      fse.outputJsonSync(file, fallback, { spaces: 2 });
      return fallback;
    }
    return JSON.parse(fs.readFileSync(file, 'utf8') || '[]');
  } catch (err) {
    console.error('loadJson error', err);
    return fallback;
  }
}

function saveJson(name, data) {
  const file = path.join(__dirname, '..', 'data', `${name}.json`);
  fse.outputJsonSync(file, data, { spaces: 2 });
}

module.exports = { loadJson, saveJson };
