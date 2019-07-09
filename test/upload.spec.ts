jest.mock('bugsnag-sourcemaps');

import bugsnagSourcemaps from 'bugsnag-sourcemaps';
import {task} from 'fp-ts/lib/Task';
import {leftTask, taskEither} from 'fp-ts/lib/TaskEither';
import {testFailure, testSuccess} from './_helpers';

import {Capabilities, capabilities, program} from '../src/bin/upload';

// --- Setup
let traceLog: string[] = [];

const testCap: Capabilities = {
  getPkgInfo: taskEither.of({
    version: '0.1.0',
    bugsnag: {
      apiKey: 'TEST-API-KEY',
      minifiedUrl: 'https://my.application.com/bundle.js',
      sourceMap: './path/to/bundle.js.map',
      minifiedFile: './path/to/bundle.js'
    }
  }),
  uploadSourceMap: _ => taskEither.of(undefined),
  withTrace: (a, msg, effect) => {
    traceLog.push(msg(a));
    return effect(a);
  }
};

// --- Teardown
afterEach(() => {
  traceLog = [];
  jest.restoreAllMocks();
});

// --- Program
test('program() should upload source maps with options taken from package json', () => {
  const spy = jest.spyOn(testCap, 'uploadSourceMap');

  return testSuccess(program(testCap), data => {
    expect(data).toBe('BUGSNAG: Sourcemap was uploaded successfully.');
    expect(spy).toBeCalledWith({
      endpoint: 'https://upload-bugsnag.contactlab.it/',
      apiKey: 'TEST-API-KEY',
      appVersion: '0.1.0',
      sourceMap: './path/to/bundle.js.map',
      minifiedUrl: 'https://my.application.com/bundle.js',
      minifiedFile: './path/to/bundle.js',
      overwrite: true
    });
    expect(traceLog).toHaveLength(1);
    expect(traceLog).toEqual(['BUGSNAG: uploading sourcemap for v0.1.0']);
  });
});

test('program() should fail if package.json data are wrong', () => {
  const cap: Capabilities = {
    ...testCap,
    getPkgInfo: leftTask(task.of(new Error('fail')))
  };
  const spy = jest.spyOn(cap, 'uploadSourceMap');

  return testFailure(program(cap), err => {
    expect(err.message).toEqual('fail');
    expect(spy).not.toBeCalled();
    expect(traceLog).toHaveLength(0);
  });
});

test('program() should fail if an error is thrown during upload', () => {
  const cap: Capabilities = {
    ...testCap,
    uploadSourceMap: _ => leftTask(task.of(new Error('fail')))
  };
  const spy = jest.spyOn(cap, 'uploadSourceMap');

  return testFailure(program(cap), err => {
    expect(err.message).toEqual('fail');
    expect(spy).toBeCalled();
    expect(traceLog).toHaveLength(1);
    expect(traceLog).toEqual(['BUGSNAG: uploading sourcemap for v0.1.0']);
  });
});

// --- Capabilities
test('capabilities.getPkgInfo should retrieve info from package.json', () => {
  // --- Mock cwd
  jest.spyOn(process, 'cwd').mockReturnValue(__dirname);
  // ---

  return testSuccess(capabilities.getPkgInfo, data => {
    expect(data).toMatchObject({
      version: '0.1.0',
      bugsnag: {
        apiKey: 'TEST-API-KEY',
        minifiedUrl: 'https://my.application.com/bundle.js',
        sourceMap: './path/to/bundle.js.map',
        minifiedFile: './path/to/bundle.js'
      }
    });
  });
});

test('capabilities.getPkgInfo should fail if it cannot find a package.json', () => {
  // --- Mock cwd
  jest.spyOn(process, 'cwd').mockReturnValue('/not/a/path');
  // ---

  return testFailure(capabilities.getPkgInfo, err => {
    expect(err.message).toBe('Cannot find a package.json');
  });
});

test('capabilities.getPkgInfo should fail if package.json has not valid data', () =>
  testFailure(capabilities.getPkgInfo, err => {
    expect(err.message).toBe(
      'Invalid value undefined supplied to : Package/bugsnag: Bugsnag config in package.json'
    );
  }));

test('capabilities.uploadSourceMap() should actually upload source map', () => {
  const spy = jest
    .spyOn(bugsnagSourcemaps, 'upload')
    .mockResolvedValue(undefined);

  const opts = {
    endpoint: 'https://server.com',
    apiKey: 'TEST-API-KEY',
    appVersion: '0.1.0',
    sourceMap: './path/to/bundle.js.map',
    minifiedUrl: 'https://my.application.com/bundle.js',
    minifiedFile: './path/to/bundle.js',
    overwrite: true
  };

  return testSuccess(capabilities.uploadSourceMap(opts), data => {
    expect(data).toBeUndefined();
    expect(spy).toHaveBeenCalledWith(opts);
  });
});

test('capabilities.uploadSourceMap() should fail if upload fails', () => {
  jest.spyOn(bugsnagSourcemaps, 'upload').mockRejectedValue(new Error('fail'));

  const opts = {
    endpoint: 'https://server.com',
    apiKey: 'TEST-API-KEY',
    appVersion: '0.1.0',
    sourceMap: './path/to/bundle.js.map',
    minifiedUrl: 'https://my.application.com/bundle.js',
    minifiedFile: './path/to/bundle.js',
    overwrite: true
  };

  return testFailure(capabilities.uploadSourceMap(opts), err => {
    expect(err.message).toBe('fail');
  });
});
