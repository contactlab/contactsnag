import {right, left} from 'fp-ts/Either';
import {Capabilities, main} from '../../src/bin/main';
import {READPKG, TRACE, EXEC} from './_data';

let oriArgv: string[];

beforeEach(() => {
  oriArgv = process.argv.slice(0);
  process.argv = oriArgv.slice(0, 2);
});

afterEach(() => {
  process.argv = oriArgv;
  jest.clearAllMocks();
});

test('main() should execute "upload"', async () => {
  process.argv.push(
    'upload',
    '--minified-url',
    '"https://my.application.com/bundle.js"',
    '--source-map',
    'bundle.js.map',
    '--minified-file',
    'bundle.js'
  );

  const result = await main(C)();

  expect(result).toEqual(
    right('BUGSNAG: Sourcemap was uploaded successfully.')
  );
});

test('main() should execute "report"', async () => {
  process.argv.push(
    'report',
    '--builder-name',
    'user.name',
    '--source-control-revision',
    'ABCDEFGH1234567'
  );

  const result = await main(C)();

  expect(result).toEqual(right('BUGSNAG: Build was reported successfully.'));
});

test('main() should fail with wrong commands - name', async () => {
  process.argv.push('not-a-command', '--and', 'other', '-a=rgs');

  const result = await main(C)();

  expect(result).toEqual(
    left(new Error('Use one of available commands: upload | report'))
  );
});

test('main() should fail with wrong commands - position', async () => {
  process.argv.push('--other', '-a=rgs', '-and', 'upload');

  const result = await main(C)();

  expect(result).toEqual(
    left(new Error('Use one of available commands: upload | report'))
  );
});

// --- Helpers
const C: Capabilities = {
  ...READPKG,
  ...TRACE,
  ...EXEC
};
