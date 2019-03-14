import {findFirst} from 'fp-ts/lib/Array';
import {fromOption} from 'fp-ts/lib/Either';
import {Option} from 'fp-ts/lib/Option';
import {fromEither} from 'fp-ts/lib/TaskEither';
import {Program} from './program';

const COMMANDS = {
  upload: null,
  report: null
};

type AvailableCommand = keyof typeof COMMANDS;
type Args = string[];

const isAvailableApi = (x: string): x is AvailableCommand =>
  COMMANDS.hasOwnProperty(x);

const getApi = (args: Args): Option<AvailableCommand> =>
  findFirst(args, isAvailableApi);

const commandsList = (): string =>
  Object.keys(COMMANDS)
    .sort((a, b) => a.localeCompare(b))
    .join(' | ');

export const program = (args: Args): Program<AvailableCommand> =>
  fromEither(
    fromOption(new Error(`Use one of available commands: ${commandsList()}`))(
      getApi(args)
    )
  );
