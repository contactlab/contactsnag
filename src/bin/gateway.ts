import * as E from 'fp-ts/lib/Either';
import * as NEA from 'fp-ts/lib/NonEmptyArray';
import * as O from 'fp-ts/lib/Option';
import * as TE from 'fp-ts/lib/TaskEither';
import {flow} from 'fp-ts/lib/function';
import {pipe} from 'fp-ts/lib/pipeable';
import {Program} from './program';

const ERR_MSG = 'Use one of available commands: upload | report';

type AvailableCommand = 'upload' | 'report';

interface UnknownCommand {
  cmd: string;
  args: string[];
}

interface Command extends UnknownCommand {
  cmd: AvailableCommand;
}

const parse = (args: string[]): O.Option<Command> =>
  pipe(
    NEA.fromArray(args),
    O.map(nea => ({
      cmd: NEA.head(nea),
      args: NEA.tail(nea)
    })),
    O.filter(isAvailableCommand)
  );

const isAvailableCommand = (ucmd: UnknownCommand): ucmd is Command =>
  ucmd.cmd === 'upload' || ucmd.cmd === 'report';

export const gateway: (args: string[]) => Program<Command> = flow(
  parse,
  E.fromOption(() => new Error(ERR_MSG)),
  TE.fromEither
);
