// import {findFirst} from 'fp-ts/lib/Array';
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

const out = (args: Args): Option<Command> =>
  fromArray(args)
    .map(nea => ({
      cmd: head(nea),
      args: tail(nea)
    }))
    .filter(isAvailableCommand);

const isAvailableCommand = (ucmd: UnknownCommand): ucmd is Command =>
  ucmd.cmd === 'upload' || ucmd.cmd === 'report';

// const isAvailableApi = (x: string): x is AvailableCommand =>
//   COMMANDS.hasOwnProperty(x);

// const getApi = (args: Args): Option<AvailableCommand> =>
//   findFirst(isAvailableApi)(args);

// const commandsList = (): string =>
//   Object.keys(COMMANDS)
//     .sort((a, b) => a.localeCompare(b))
//     .join(' | ');

const ERROR_MSG = 'Use one of available commands: upload | report';

export const gateway = (args: Args): Program<Command> =>
  fromEither(fromOption(new Error(ERROR_MSG))(out(args)));
