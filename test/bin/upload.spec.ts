jest.mock('bugsnag-sourcemaps');

import bugsnagSourcemaps from 'bugsnag-sourcemaps';
import {task} from 'fp-ts/lib/Task';
import {leftTask, taskEither} from 'fp-ts/lib/TaskEither';
import {Capabilities, capabilities, upload} from '../../src/bin/upload';
import {result} from '../_helpers';

const bugsnagSourcemapsM: jest.Mocked<
  typeof bugsnagSourcemaps
> = bugsnagSourcemaps as any;

// --- Teardown
afterEach(() => {
  jest.restoreAllMocks();
});

// --- Program
test('program() should upload source maps with options taken from package json', () =>
  result(upload(testCap), data => {
    expect(data.isRight()).toBe(true);
    expect(data.value).toBe('BUGSNAG: Sourcemap was uploaded successfully.');
    expect(testCap.uploadSourceMap).toBeCalledWith(OPTS);
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
    expect(cap).toBeCalled();
    expect(cap.trace).toBeCalledWith('BUGSNAG: uploading sourcemap for v0.1.0');
  });
});

// --- Capabilities
test('capabilities.uploadSourceMap() should actually upload source map', () => {
  bugsnagSourcemapsM.upload.mockResolvedValue(undefined);

  return result(capabilities.uploadSourceMap(OPTS), data => {
    expect(data.isRight()).toBe(true);
    expect(data.value).toBeUndefined();
    expect(bugsnagSourcemapsM.upload).toHaveBeenCalledWith(OPTS);
  });
});

test('capabilities.uploadSourceMap() should fail if upload fails', () => {
  bugsnagSourcemapsM.upload.mockRejectedValue(new Error('fail'));

  return expect(result(capabilities.uploadSourceMap(OPTS))).rejects.toEqual(
    new Error('fail')
  );
});

// --- Helpers
const testCap: Capabilities = {
  readPkg: taskEither.of({
    version: '0.1.0',
    bugsnag: {
      upload: {
        apiKey: 'TEST-API-KEY',
        minifiedUrl: 'https://my.application.com/bundle.js',
        sourceMap: './path/to/bundle.js.map',
        minifiedFile: './path/to/bundle.js',
        directory: './some/path'
      }
    }
  }),
  uploadSourceMap: jest.fn(_ => taskEither.of(undefined)),
  trace: jest.fn(a => taskEither.of(a))
};

const OPTS = {
  apiKey: 'TEST-API-KEY',
  appVersion: '0.1.0',
  sourceMap: './path/to/bundle.js.map',
  minifiedUrl: 'https://my.application.com/bundle.js',
  minifiedFile: './path/to/bundle.js',
  directory: './some/path',
  overwrite: true
};
