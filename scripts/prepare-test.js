/*eslint no-console: 0*/
/*eslint-env node*/

const path = require('path');
const fs   = require('fs');

const ROOT        = path.resolve(__dirname, '..');
const TEST_MODULE = path.join('test', 'modules', 'contactsnag');

const src = p => path.join(ROOT, p);

const dest = p => path.join(ROOT, TEST_MODULE, p);

const error = err => {
  throw err;
};

const copy = file => {
  const read  = fs.createReadStream(src(file));
  const write = fs.createWriteStream(dest(file));

  read.on('error', error);
  write.on('error', error);
  write.on('finish', () => console.log(`> ${file} copied`));

  return read.pipe(write);
};

copy('dist.js');
copy('bin/upload.js');
copy('package.json');
