// --- Mock exec
import {mocked} from 'ts-jest/utils';
jest.mock('../../src/bin/exec');
import * as Exec from '../../src/bin/exec';
const execM = mocked(Exec);
// ---

import {isLeft, isRight} from 'fp-ts/lib/Either';
import {task} from 'fp-ts/lib/Task';
import {left, leftTask, right, taskEither} from 'fp-ts/lib/TaskEither';
import {Capabilities, capabilities, upload} from '../../src/bin/upload';
import {result} from './_helpers';

afterEach(() => {
  jest.clearAllMocks();
});

// --- Program
test('upload() should upload source maps with options taken from package json', () =>
  result(upload(testCap), data => {
    expect(isRight(data)).toBe(true);
    expect((data as any).right).toBe(
      'BUGSNAG: Sourcemap was uploaded successfully.'
    );
    expect(testCap.uploadSourceMap).toBeCalledWith(PKG_DATA);
    expect(testCap.trace).toBeCalledWith(
      'BUGSNAG: uploading sourcemap for v0.1.0'
    );
  }));

test('upload() should fail if package.json data are wrong', () => {
  const cap: Capabilities = {
    ...testCap,
    readPkg: leftTask(task.of(new Error('fail')))
  };

  return result(upload(cap), err => {
    expect(isLeft(err)).toEqual(true);
    expect((err as any).left).toEqual(new Error('fail'));
    expect(cap.uploadSourceMap).not.toBeCalled();
    expect(cap.trace).not.toBeCalled();
  });
});

test('upload() should fail if an error is thrown during upload', () => {
  const cap: Capabilities = {
    ...testCap,
    uploadSourceMap: _ => leftTask(task.of(new Error('fail')))
  };

  return result(upload(cap), err => {
    expect(isLeft(err)).toEqual(true);
    expect((err as any).left).toEqual(new Error('fail'));
    expect(cap.trace).toBeCalledWith('BUGSNAG: uploading sourcemap for v0.1.0');
  });
});

// --- Capabilities
test('capabilities.uploadSourceMap() should actually upload source map', () => {
  execM.exec.mockReturnValueOnce(right({stdout: '', stderr: ''}));

  return result(capabilities(TEST_ARGS).uploadSourceMap(PKG_DATA), data => {
    expect(isRight(data)).toBe(true);
    expect((data as any).right).toEqual({stdout: '', stderr: ''});
    expect(execM.exec).toBeCalledWith(
      'npx bugsnag-sourcemaps upload --api-key TEST-API-KEY --app-version 0.1.0 --overwrite --source-map ./dist/bundle.js.map --minified-file ./dist/bundle.js'
    );
  });
});

test('capabilities.uploadSourceMap() should fail if upload fails', () => {
  execM.exec.mockReturnValueOnce(left(new Error('fail')));

  return result(capabilities(TEST_ARGS).uploadSourceMap(PKG_DATA), data => {
    expect(isLeft(data)).toBe(true);
    expect((data as any).left).toEqual(new Error('fail'));
  });
});

// --- Helpers
const PKG_DATA = {
  version: '0.1.0',
  bugsnag: {
    apiKey: 'TEST-API-KEY',
    someOtherData: 'ignored'
  }
};

const TEST_ARGS = [
  '--source-map',
  './dist/bundle.js.map',
  '--minified-file',
  './dist/bundle.js'
];

const EXEC_OUTPUT = {stdout: '', stderr: ''};

const testCap: Capabilities = {
  readPkg: taskEither.of(PKG_DATA),
  uploadSourceMap: jest.fn(_ => taskEither.of(EXEC_OUTPUT)),
  trace: jest.fn(a => taskEither.of(a))
};
