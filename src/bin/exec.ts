import * as childProcess from 'child_process';
import {left, right} from 'fp-ts/lib/Either';
import {TaskEither} from 'fp-ts/lib/TaskEither';

export interface ExecOutput {
  stdout: string;
  stderr: string;
}

export const exec = (cmd: string): TaskEither<Error, ExecOutput> => () =>
  new Promise(resolve =>
    childProcess.exec(cmd, {encoding: 'utf-8'}, (err, stdout, stderr) =>
      err !== null ? resolve(left(err)) : resolve(right({stdout, stderr}))
    )
  );
