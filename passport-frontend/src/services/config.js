const path = require('path');

const configPath = path.resolve(__dirname, '../../config/config.json');

function getConfig() {
  delete require.cache[require.resolve(configPath)];
  return require(configPath);
}

module.exports = {
  getConfig
};