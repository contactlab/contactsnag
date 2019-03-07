/*tslint:disable no-console*/

import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');
const TEST_MODULE = path.join('test', 'modules', 'contactsnag');

const src = (p: string): string => path.join(ROOT, p);

const dest = (p: string): string => path.join(ROOT, TEST_MODULE, p);

const error = (err: Error): void => {
  throw err;
};

const copy = (file: string): fs.WriteStream => {
  const read = fs.createReadStream(src(file));
  const write = fs.createWriteStream(dest(file));

  read.on('error', error);
  write.on('error', error);
  write.on('finish', () => console.log(`> ${file} copied`));

  return read.pipe(write);
};

copy('lib/index.js');
copy('lib/bin/upload.js');
copy('package.json');
