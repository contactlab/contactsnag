const path = require('path');

const root = path.resolve(__dirname, '../..');
const pkg = require(path.join(root, 'package.json'));
const cliPath = path.join(root, pkg.bin);
const e2ePath = __dirname;

module.exports = {
  root,
  pkg,
  cliPath,
  e2ePath
};
