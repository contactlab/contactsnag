import chalk from 'chalk';
import {info} from 'fp-ts/lib/Console';
import {TaskEither, fromIO} from 'fp-ts/lib/TaskEither';

const infoTxt = chalk.cyanBright;
const trace = (msg: string) => info(infoTxt(`\n> ${msg}`));
const traceTE = <L>(msg: string): TaskEither<L, void> => fromIO(trace(msg));

export type WithTrace = typeof withTrace;

export const withTrace = <L, A, O = A>(
  a: A,
  msg: (a: A) => string,
  effect: (a: A) => TaskEither<L, O>
): TaskEither<L, O> => traceTE<L>(msg(a)).applySecond(effect(a));
