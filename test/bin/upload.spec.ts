jest.mock('child_process');

import * as child_process from 'child_process';
import {task} from 'fp-ts/lib/Task';
import {leftTask, taskEither} from 'fp-ts/lib/TaskEither';
import {Capabilities, capabilities, upload} from '../../src/bin/upload';
import {result} from '../_helpers';

const childProcessM: jest.Mocked<typeof child_process> = child_process as any;

// --- Program
test('program() should upload source maps with options taken from package json', () =>
  result(upload(testCap), data => {
    expect(data.isRight()).toBe(true);
    expect(data.value).toBe('BUGSNAG: Sourcemap was uploaded successfully.');
    expect(testCap.uploadSourceMap).toBeCalledWith(PKG_DATA);
    expect(testCap.trace).toBeCalledWith(
      'BUGSNAG: uploading sourcemap for v0.1.0'
    );
  }));

test('program() should fail if package.json data are wrong', () => {
  const cap: Capabilities = {
    ...testCap,
    readPkg: leftTask(task.of(new Error('fail')))
  };

  return result(upload(cap), err => {
    expect(err.isLeft()).toEqual(true);
    expect(err.value).toEqual(new Error('fail'));
    expect(cap.uploadSourceMap).not.toBeCalled();
    expect(cap.trace).not.toBeCalled();
  });
});

test('program() should fail if an error is thrown during upload', () => {
  const cap: Capabilities = {
    ...testCap,
    uploadSourceMap: _ => leftTask(task.of(new Error('fail')))
  };

  return result(upload(cap), err => {
    expect(err.isLeft()).toEqual(true);
    expect(err.value).toEqual(new Error('fail'));
    expect(cap.uploadSourceMap).toBeCalled();
    expect(cap.trace).toBeCalledWith('BUGSNAG: uploading sourcemap for v0.1.0');
  });
});

// --- Capabilities
test('capabilities.uploadSourceMap() should actually upload source map', () => {
  childProcessM.exec.mockImplementation(mockExecOK);

  return result(capabilities(TEST_ARGS).uploadSourceMap(PKG_DATA), data => {
    expect(data.isRight()).toBe(true);
    expect(data.value).toBeUndefined();
    expect(childProcessM.exec).toBeCalledWith(
      'npx bugsnag-sourcemaps upload --api-key TEST-API-KEY --app-version 0.1.0 --overwrite --source-map ./dist/bundle.js.map --minified-file ./dist/bundle.js',
      {encoding: 'utf8'}
    );

    childProcessM.exec.mockReset();
  });
});

test('capabilities.uploadSourceMap() should fail if upload fails', () => {
  childProcessM.exec.mockImplementation(mockExecKO);

  return result(capabilities(TEST_ARGS).uploadSourceMap(PKG_DATA), data => {
    expect(data.isLeft()).toBe(true);
    expect(data.value).toEqual(new Error('fail'));

    childProcessM.exec.mockReset();
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

// Mocking sucks...
const mockExecOK: any = (_: any, __: any, cb: any) => cb(null, '', '');
const mockExecKO: any = (_: any, __: any, cb: any) =>
  cb(new Error('fail'), '', '');
