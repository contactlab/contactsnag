jest.mock('child_process');

import * as child_process from 'child_process';
import {main} from '../../src/bin/main';
import {result} from '../_helpers';

const childProcessM: jest.Mocked<typeof child_process> = child_process as any;

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

  childProcessM.exec.mockImplementation(mockExecOK);

  return result(main(), data => {
    expect(data.isRight()).toBe(true);
    expect(data.value).toBe('BUGSNAG: Sourcemap was uploaded successfully.');
  });
});

test('main() should execute "report"', () => {
  process.chdir(__dirname);
  process.argv.push('report');

  return result(main(), data => {
    expect(data.isLeft()).toBe(true);
    expect(data.value).toEqual(new Error('not yet implemented'));
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

// --- Mocking
const mockExecOK: any = (_: any, __: any, cb: any) => cb(null, '', '');
// const mockExecKO: any = (_: any, __: any, cb: any) =>
//   cb(new Error('fail'), '', '');
