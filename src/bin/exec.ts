import * as child_process from 'child_process';
import {left, right} from 'fp-ts/lib/Either';
import {Task} from 'fp-ts/lib/Task';
import {TaskEither} from 'fp-ts/lib/TaskEither';

export interface ExecOutput {
  stdout: string;
  stderr: string;
}

export const exec = (cmd: string): TaskEither<Error, ExecOutput> =>
  new TaskEither(
    new Task(
      () =>
        new Promise(resolve =>
          child_process.exec(cmd, {encoding: 'utf-8'}, (err, stdout, stderr) =>
            err !== null ? resolve(left(err)) : resolve(right({stdout, stderr}))
          )
        )
    )
  );
