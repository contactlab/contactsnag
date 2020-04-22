import * as childProcess from 'child_process';
import {left, right} from 'fp-ts/lib/Either';
import {Program} from './program';

export interface ExecOutput {
  stdout: string;
  stderr: string;
}

export interface Exec {
  exec: (cmd: string) => Program<ExecOutput>;
}

export const execNode: Exec = {
  exec: cmd => () =>
    new Promise(resolve =>
      childProcess.exec(cmd, {encoding: 'utf-8'}, (err, stdout, stderr) =>
        err !== null ? resolve(left(err)) : resolve(right({stdout, stderr}))
      )
    )
};
