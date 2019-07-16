import {task} from 'fp-ts/lib/Task';
import {leftTask} from 'fp-ts/lib/TaskEither';
import {gateway} from './gateway';
import {Program} from './program';
import * as Upload from './upload';

export const main = (): Program =>
  gateway(process.argv.slice(2)).chain(command => {
    switch (command.cmd) {
      case 'upload':
        return Upload.upload(Upload.capabilities(command.args));
      case 'report':
        return leftTask(task.of(new Error('not yet implemented')));
    }
  });
