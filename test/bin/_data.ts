import * as TE from 'fp-ts/lib/TaskEither';
import {ExecOutput, Exec} from '../../src/bin/exec';
import {ReadPkg} from '../../src/bin/read-pkg';
import {Trace} from '../../src/bin/trace';

export const PKG_DATA = {
  name: 'test-pkg',
  version: '0.1.0',
  bugsnag: {
    apiKey: 'TEST-API-KEY',
    someOtherData: 'ignored'
  }
};

export const EXEC_OUTPUT: ExecOutput = {stdout: '', stderr: ''};

export const READPKG: ReadPkg = {
  read: TE.right(PKG_DATA)
};

export const EXEC: Exec = {
  exec: jest.fn(() => TE.right(EXEC_OUTPUT))
};

export const TRACE: Trace = {
  log: jest.fn(a => TE.right(a))
};
