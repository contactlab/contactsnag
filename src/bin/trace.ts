import chalk from 'chalk';
import {info} from 'fp-ts/lib/Console';
import {IO} from 'fp-ts/lib/IO';
import {TaskEither, rightIO} from 'fp-ts/lib/TaskEither';

const log = <A>(msg: A): IO<void> => info(chalk.cyanBright(`\n> ${msg}`));

export type Trace = typeof trace;
export const trace = <A>(msg: A): TaskEither<Error, A> =>
  rightIO(log(msg).map(() => msg));
