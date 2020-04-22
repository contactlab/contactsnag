// --- Mock child_process
jest.mock('child_process');
// ---

import * as childProcess from 'child_process';
import {right, left} from 'fp-ts/lib/Either';
import {mocked} from 'ts-jest/utils';
import {execNode} from '../../src/bin/exec';

const childProcessM = mocked(childProcess);

afterEach(() => {
  jest.resetAllMocks();
});

test('exec() should execute command and lift it into TaskEither - success', async () => {
  childProcessM.exec.mockImplementation(mockExecOK);

  const result = await execNode.exec(
    'npm run command --first-arg=foo -b --ar'
  )();

  expect(result).toEqual(right({stdout: '', stderr: ''}));

  const params = childProcessM.exec.mock.calls[0];

  expect(params[0]).toBe('npm run command --first-arg=foo -b --ar');
  expect(params[1]).toEqual({encoding: 'utf-8'});
});

test('exec() should execute command and lift it into TaskEither - fail', async () => {
  childProcessM.exec.mockImplementation(mockExecKO);

  const result = await execNode.exec(
    'npm run command --first-arg=foo -b --ar'
  )();

  expect(result).toEqual(left(new Error('fail')));
});

// --- Helpers
// Mocking sucks...
const mockExecOK: any = (_: any, __: any, cb: any) => cb(null, '', '');
const mockExecKO: any = (_: any, __: any, cb: any) =>
  cb(new Error('fail'), '', '');
