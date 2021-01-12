import {right, left} from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import {Capabilities, upload} from '../../src/bin/upload';
import {READPKG, TRACE, EXEC} from './_data';

afterEach(() => {
  jest.clearAllMocks();
});

// --- Program
test('upload() should upload source maps with options taken from package json', async () => {
  const u = upload(C)(ARGS);
  const result = await u();

  expect(result).toEqual(
    right('BUGSNAG: Sourcemap was uploaded successfully.')
  );
  expect(C.exec).toBeCalledWith(
    'npx bugsnag-sourcemaps upload --api-key TEST-API-KEY --app-version 0.1.0 --overwrite --source-map ./dist/bundle.js.map --minified-file ./dist/bundle.js'
  );
  expect(C.log).toBeCalledWith('BUGSNAG: uploading sourcemap for v0.1.0');
});

test('upload() should fail if package.json data are wrong', async () => {
  const CAP: Capabilities = {
    ...C,
    read: TE.left(new Error('fail'))
  };

  const u = upload(CAP)(ARGS);
  const result = await u();

  expect(result).toEqual(left(new Error('fail')));
  expect(CAP.exec).not.toBeCalled();
  expect(CAP.log).not.toBeCalled();
});

test('upload() should fail if an error is thrown during upload', async () => {
  const CAP: Capabilities = {
    ...C,
    exec: () => TE.left(new Error('fail'))
  };

  const u = upload(CAP)(ARGS);
  const result = await u();

  expect(result).toEqual(left(new Error('fail')));
  expect(CAP.log).toBeCalledWith('BUGSNAG: uploading sourcemap for v0.1.0');
});

// --- Helpers
const ARGS = [
  '--source-map',
  './dist/bundle.js.map',
  '--minified-file',
  './dist/bundle.js'
];

const C: Capabilities = {
  ...READPKG,
  ...TRACE,
  ...EXEC
};
