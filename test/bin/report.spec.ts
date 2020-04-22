import {right, left} from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import {Capabilities, report} from '../../src/bin/report';
import {READPKG, TRACE, EXEC} from './_data';

afterEach(() => {
  jest.clearAllMocks();
});

// --- Program
test('report() should report build with options taken from package json', async () => {
  const r = report(C)(ARGS);
  const result = await r();

  expect(result).toEqual(right('BUGSNAG: Build was reported successfully.'));
  expect(C.exec).toBeCalledWith(
    'npx bugsnag-build-reporter --api-key TEST-API-KEY --app-version 0.1.0 --release-stage production --builder-name user.name --source-control-revision ABCDEFGH1234567'
  );
  expect(C.log).toBeCalledWith('BUGSNAG: reporting build for v0.1.0');
});

test('report() should fail if package.json data are wrong', async () => {
  const CAP: Capabilities = {
    ...C,
    read: TE.left(new Error('fail'))
  };

  const r = report(CAP)(ARGS);
  const result = await r();

  expect(result).toEqual(left(new Error('fail')));
  expect(CAP.exec).not.toBeCalled();
  expect(CAP.log).not.toBeCalled();
});

test('report() should fail if an error is thrown during report', async () => {
  const CAP: Capabilities = {
    ...C,
    exec: () => TE.left(new Error('fail'))
  };

  const r = report(CAP)(ARGS);
  const result = await r();

  expect(result).toEqual(left(new Error('fail')));
  expect(CAP.log).toBeCalledWith('BUGSNAG: reporting build for v0.1.0');
});

// --- Helpers
const ARGS = [
  '--builder-name',
  'user.name',
  '--source-control-revision',
  'ABCDEFGH1234567'
];

const C: Capabilities = {
  ...READPKG,
  ...TRACE,
  ...EXEC
};
