import chalk from 'chalk';
import {info} from 'fp-ts/lib/Console';
import {IO, map} from 'fp-ts/lib/IO';
import {TaskEither, rightIO} from 'fp-ts/lib/TaskEither';
import {pipe} from 'fp-ts/lib/pipeable';

const log = <A>(msg: A): IO<void> => info(chalk.cyanBright(`\n> ${msg}`));

export type Trace = typeof trace;
export const trace = <A>(msg: A): TaskEither<Error, A> =>
  pipe(
    log(msg),
    map(() => msg),
    rightIO
  );
