// --- Mock child_process
import {mocked} from 'ts-jest/utils';
jest.mock('child_process');
import * as child_process from 'child_process';
const childProcessM = mocked(child_process);
// ---

import {isLeft, isRight} from 'fp-ts/lib/Either';
import {exec} from '../../src/bin/exec';
import {result} from './_helpers';

afterEach(() => {
  jest.resetAllMocks();
});

test('exec() should execute command and lift it into TaskEither - success', () => {
  childProcessM.exec.mockImplementation(mockExecOK);

  return result(exec('npm run command --first-arg=foo -b --ar'), data => {
    expect(isRight(data)).toBe(true);
    expect((data as any).right).toEqual({
      stdout: '',
      stderr: ''
    });

    const callParams = childProcessM.exec.mock.calls[0];

    expect(callParams[0]).toBe('npm run command --first-arg=foo -b --ar');
    expect(callParams[1]).toEqual({encoding: 'utf-8'});
  });
});

test('exec() should execute command and lift it into TaskEither - fail', () => {
  childProcessM.exec.mockImplementation(mockExecKO);

  return result(exec('npm run command --first-arg=foo -b --ar'), data => {
    expect(isLeft(data)).toBe(true);
    expect((data as any).left).toEqual(new Error('fail'));
  });
});

// --- Helpers
// Mocking sucks...
const mockExecOK: any = (_: any, __: any, cb: any) => cb(null, '', '');
const mockExecKO: any = (_: any, __: any, cb: any) =>
  cb(new Error('fail'), '', '');
