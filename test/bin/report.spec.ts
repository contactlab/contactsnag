// --- Mock exec
jest.mock('../../src/bin/exec');
// ---

import {isLeft, isRight} from 'fp-ts/lib/Either';
import {task} from 'fp-ts/lib/Task';
import {left, leftTask, right, taskEither} from 'fp-ts/lib/TaskEither';
import {mocked} from 'ts-jest/utils';
import * as Exec from '../../src/bin/exec';
import {Capabilities, capabilities, report} from '../../src/bin/report';
import {result} from './_helpers';

const execM = mocked(Exec);

afterEach(() => {
  jest.clearAllMocks();
});

// --- Program
test('report() should report build with options taken from package json', () =>
  result(report(testCap), data => {
    expect(isRight(data)).toBe(true);
    expect((data as any).right).toBe(
      'BUGSNAG: Build was reported successfully.'
    );
    expect(testCap.reportBuild).toBeCalledWith(PKG_DATA);
    expect(testCap.trace).toBeCalledWith('BUGSNAG: reporting build for v0.1.0');
  }));

test('report() should fail if package.json data are wrong', () => {
  const cap: Capabilities = {
    ...testCap,
    readPkg: leftTask(task.of(new Error('fail')))
  };

  return result(report(cap), err => {
    expect(isLeft(err)).toEqual(true);
    expect((err as any).left).toEqual(new Error('fail'));
    expect(cap.reportBuild).not.toBeCalled();
    expect(cap.trace).not.toBeCalled();
  });
});

test('report() should fail if an error is thrown during report', () => {
  const cap: Capabilities = {
    ...testCap,
    reportBuild: _ => leftTask(task.of(new Error('fail')))
  };

  return result(report(cap), err => {
    expect(isLeft(err)).toEqual(true);
    expect((err as any).left).toEqual(new Error('fail'));
    expect(cap.trace).toBeCalledWith('BUGSNAG: reporting build for v0.1.0');
  });
});

// --- Capabilities
test('capabilities.reportBuild() should actually report build', () => {
  execM.exec.mockReturnValueOnce(right({stdout: '', stderr: ''}));

  return result(capabilities(TEST_ARGS).reportBuild(PKG_DATA), data => {
    expect(isRight(data)).toBe(true);
    expect((data as any).right).toEqual({stdout: '', stderr: ''});
    expect(execM.exec).toBeCalledWith(
      'npx bugsnag-build-reporter --api-key TEST-API-KEY --app-version 0.1.0 --release-stage production --builder-name user.name --source-control-revision ABCDEFGH1234567'
    );
  });
});

test('capabilities.reportBuild() should fail if reporting fails', () => {
  execM.exec.mockReturnValueOnce(left(new Error('fail')));

  return result(capabilities(TEST_ARGS).reportBuild(PKG_DATA), data => {
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
  '--builder-name',
  'user.name',
  '--source-control-revision',
  'ABCDEFGH1234567'
];

const EXEC_OUTPUT = {stdout: '', stderr: ''};

const testCap: Capabilities = {
  readPkg: taskEither.of(PKG_DATA),
  reportBuild: jest.fn(_ => taskEither.of(EXEC_OUTPUT)),
  trace: jest.fn(a => taskEither.of(a))
};
