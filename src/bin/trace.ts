import chalk from 'chalk';
import {info} from 'fp-ts/lib/Console';
import {IO, map} from 'fp-ts/lib/IO';
import {TaskEither, rightIO} from 'fp-ts/lib/TaskEither';
import {pipe} from 'fp-ts/lib/pipeable';

const log = <A>(msg: A): IO<void> => info(chalk.cyanBright(`\n> ${msg}`));

export interface Trace {
  log: <A>(msg: A) => TaskEither<Error, A>;
}

export const traceConsole: Trace = {
  log: msg =>
    pipe(
      log(msg),
      map(() => msg),
      rightIO
    )
};
