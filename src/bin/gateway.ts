import {fromOption} from 'fp-ts/lib/Either';
import {fromArray, head, tail} from 'fp-ts/lib/NonEmptyArray2v';
import {Option} from 'fp-ts/lib/Option';
import {fromEither} from 'fp-ts/lib/TaskEither';
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

const parse = (args: Args): Option<Command> =>
  fromArray(args)
    .map(nea => ({
      cmd: head(nea),
      args: tail(nea)
    }))
    .filter(isAvailableCommand);

const isAvailableCommand = (ucmd: UnknownCommand): ucmd is Command =>
  ucmd.cmd === 'upload' || ucmd.cmd === 'report';

export const gateway = (args: Args): Program<Command> =>
  fromEither(
    fromOption(new Error('Use one of available commands: upload | report'))(
      parse(args)
    )
  );
