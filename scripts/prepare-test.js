/*eslint no-console: 0*/
/*eslint-env node*/

const path = require('path');
const fs   = require('fs');

const ROOT = path.resolve(__dirname, '..');

const SRCS  = {
  INDEX : path.join(ROOT, 'index.js'),
  UPLOAD: path.join(ROOT, 'upload.js')
};

const DESTS = {
  INDEX : path.join(ROOT, 'test/modules/contactsnag/index.js'),
  UPLOAD: path.join(ROOT, 'test/modules/contactsnag/upload.js')
};

const error = err => {
  throw err;
};

const succeed = src => console.log(`> ${src} copied`);

const copy = (src, dest, cb) => {
  const read  = fs.createReadStream(src);
  const write = fs.createWriteStream(dest);

  read.on('error', error);
  write.on('error', error);
  write.on('finish', () => {
    succeed(src);

    if (cb) {
      cb(dest);
    }
  });

  return read.pipe(write);
};

// index.js
copy(SRCS.INDEX, DESTS.INDEX);

// upload.js
copy(SRCS.UPLOAD, DESTS.UPLOAD, dest => fs.chmod(dest, '755', e => e ? error(e) : null));
