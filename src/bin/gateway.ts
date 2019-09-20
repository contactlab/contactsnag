import * as E from 'fp-ts/lib/Either';
import * as NEA from 'fp-ts/lib/NonEmptyArray';
import * as O from 'fp-ts/lib/Option';
import * as TE from 'fp-ts/lib/TaskEither';
import {pipe} from 'fp-ts/lib/pipeable';
import {Program} from './program';

type AvailableCommand = 'upload' | 'report';
type Args = string[];

interface UnknownCommand {
  cmd: string;
  args: Args;
}

interface Command extends UnknownCommand {
  cmd: AvailableCommand;
}

const parse = (args: Args): O.Option<Command> =>
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

export const gateway = (args: Args): Program<Command> =>
  TE.fromEither(
    E.fromOption(
      () => new Error('Use one of available commands: upload | report')
    )(parse(args))
  );
