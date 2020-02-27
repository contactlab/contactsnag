// --- Mock exec
jest.mock('../../src/bin/exec');
// ---

import {isLeft, isRight} from 'fp-ts/lib/Either';
import {right} from 'fp-ts/lib/TaskEither';
import {mocked} from 'ts-jest/utils';
import * as Exec from '../../src/bin/exec';
import {main} from '../../src/bin/main';
import {result} from './_helpers';

const execM = mocked(Exec);

let oriCwd: string;
let oriArgv: string[];

beforeEach(() => {
  oriCwd = process.cwd();
  oriArgv = process.argv.slice(0);
  process.argv = oriArgv.slice(0, 2);
});

afterEach(() => {
  process.chdir(oriCwd);
  process.argv = oriArgv;
  jest.resetAllMocks();
});

test('main() should execute "upload"', () => {
  process.chdir(__dirname);
  process.argv.push(
    'upload',
    '--minified-url',
    '"https://my.application.com/bundle.js"',
    '--source-map',
    'bundle.js.map',
    '--minified-file',
    'bundle.js'
  );

  execM.exec.mockReturnValue(right({stdout: '', stderr: ''}));

  return result(main(), data => {
    expect(isRight(data)).toBe(true);
    expect((data as any).right).toBe(
      'BUGSNAG: Sourcemap was uploaded successfully.'
    );
  });
});

test('main() should execute "report"', () => {
  process.chdir(__dirname);
  process.argv.push(
    'report',
    '--builder-name',
    'user.name',
    '--source-control-revision',
    'ABCDEFGH1234567'
  );

  execM.exec.mockReturnValue(right({stdout: '', stderr: ''}));

  return result(main(), data => {
    expect(isRight(data)).toBe(true);
    expect((data as any).right).toBe(
      'BUGSNAG: Build was reported successfully.'
    );
  });
});

test('main() should fail with wrong commands - name', () => {
  process.chdir(__dirname);
  process.argv.push('not-a-command', '--and', 'other', '-a=rgs');

  return result(main(), data => {
    expect(isLeft(data)).toBe(true);
    expect((data as any).left).toEqual(
      new Error('Use one of available commands: upload | report')
    );
  });
});

test('main() should fail with wrong commands - position', () => {
  process.chdir(__dirname);
  process.argv.push('--other', '-a=rgs', '-and', 'upload');

  return result(main(), data => {
    expect(isLeft(data)).toBe(true);
    expect((data as any).left).toEqual(
      new Error('Use one of available commands: upload | report')
    );
  });
});
