// --- Mock child_process
jest.mock('child_process');

import * as child_process from 'child_process';

const childProcessM: jest.Mocked<typeof child_process> = child_process as any;
// ---

import {exec} from '../../src/bin/exec';
import {result} from '../_helpers';

afterEach(() => {
  jest.resetAllMocks();
});

test('exec() should execute command and lift it into TaskEither - success', () => {
  childProcessM.exec.mockImplementation(mockExecOK);

  return result(exec('npm run command --first-arg=foo -b --ar'), data => {
    expect(data.isRight()).toBe(true);
    expect(data.value).toEqual({
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
    expect(data.isLeft()).toBe(true);
    expect(data.value).toEqual(new Error('fail'));
  });
});

// --- Helpers
// Mocking sucks...
const mockExecOK: any = (_: any, __: any, cb: any) => cb(null, '', '');
const mockExecKO: any = (_: any, __: any, cb: any) =>
  cb(new Error('fail'), '', '');
