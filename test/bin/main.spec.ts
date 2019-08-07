// --- Mock exec
jest.mock('../../src/bin/exec');

import * as Exec from '../../src/bin/exec';

const execM: jest.Mocked<typeof Exec> = Exec as any;
// ---

import {right2v} from 'fp-ts/lib/TaskEither';
import {main} from '../../src/bin/main';
import {result} from './_helpers';

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

  execM.exec.mockReturnValue(right2v({stdout: '', stderr: ''}));

  return result(main(), data => {
    expect(data.isRight()).toBe(true);
    expect(data.value).toBe('BUGSNAG: Sourcemap was uploaded successfully.');
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

  execM.exec.mockReturnValue(right2v({stdout: '', stderr: ''}));

  return result(main(), data => {
    expect(data.isRight()).toBe(true);
    expect(data.value).toBe('BUGSNAG: Build was reported successfully.');
  });
});

test('main() should fail with wrong commands - name', () => {
  process.chdir(__dirname);
  process.argv.push('not-a-command', '--and', 'other', '-a=rgs');

  return result(main(), data => {
    expect(data.isLeft()).toBe(true);
    expect(data.value).toEqual(
      new Error('Use one of available commands: upload | report')
    );
  });
});

test('main() should fail with wrong commands - position', () => {
  process.chdir(__dirname);
  process.argv.push('--other', '-a=rgs', '-and', 'upload');

  return result(main(), data => {
    expect(data.isLeft()).toBe(true);
    expect(data.value).toEqual(
      new Error('Use one of available commands: upload | report')
    );
  });
});
