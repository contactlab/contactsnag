/*eslint no-console: 0*/
/*eslint-env node*/

const path = require('path');
const fs   = require('fs');

const SRC  = path.join(__dirname, '../index.js');
const DEST = path.join(__dirname, '../test/modules/contactsnag/index.js');

const read  = fs.createReadStream(SRC);
const write = fs.createWriteStream(DEST);

read.on('error', err => {
  throw err;
});

write.on('error', err => {
  throw err;
});

write.on('finish', () => console.log('> contactsnag/index.js copied'));

read.pipe(write);
