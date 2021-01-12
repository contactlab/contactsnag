import chalk from 'chalk';
import {info} from 'fp-ts/Console';
import {IO, map} from 'fp-ts/IO';
import {TaskEither, rightIO} from 'fp-ts/TaskEither';
import {pipe} from 'fp-ts/function';

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
