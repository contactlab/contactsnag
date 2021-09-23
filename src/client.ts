import * as BS from '@bugsnag/js';
import * as E from 'fp-ts/Either';
import * as IOE from 'fp-ts/IOEither';
import {constVoid as undef} from 'fp-ts/function';
import {pipe} from 'fp-ts/function';
import {Config, validate} from './validate';

// --- Constants
const DEFAULT_CONFIG: Partial<Config> = {
  enabledBreadcrumbTypes: [
    'error',
    'manual',
    'navigation',
    'process',
    'request',
    'state',
    'user'
  ]
};

const NOT_STARTED_ERR_MSG = 'Client not yet started';

// --- States
type ActualClient = ConfigError | Still | Started;

interface ConfigError {
  readonly type: 'ConfigError';
  readonly error: Error;
}

const ConfigError = (error: Error): ConfigError => ({
  type: 'ConfigError',
  error
});

interface Still {
  readonly type: 'Still';
  readonly config: Config;
}

const Still = (config: Config): Still => ({type: 'Still', config});

interface Started {
  readonly type: 'Started';
  readonly bugsnag: BS.Client;
}

const Started = (bugsnag: BS.Client): Started => ({
  type: 'Started',
  bugsnag
});

// --- Client
export interface Client {
  readonly client: () => ActualClient;

  readonly start: () => void;

  readonly notify: (
    error: BS.NotifiableError,
    onError?: BS.OnErrorCallback
  ) => IOE.IOEither<Error, void>;

  readonly setUser: (user: BS.User) => IOE.IOEither<Error, void>;
}

export const create =
  (creator: BS.BugsnagStatic) =>
  (config: Config): Client => {
    let actualClient = pipe(
      validate(config),
      E.map(withDefaults),
      E.fold<Error, Config, ActualClient>(ConfigError, Still)
    );

    const c: Client = {
      client: () => actualClient,

      start: () =>
        match(
          actualClient,
          undef,
          s => (actualClient = Started(creator.start(s.config))),
          undef
        ),

      notify: (error, onError) =>
        match(
          actualClient,
          configErrorThrows,
          stillThrows,
          notify(error, onError)
        ),

      setUser: user =>
        match(actualClient, configErrorThrows, stillThrows, setUser(user))
    };

    return c;
  };

// --- Helpers
function match<R>(
  value: ActualClient,
  whenConfigError: (v: ConfigError) => R,
  whenStill: (v: Still) => R,
  whenStarted: (v: Started) => R
): R {
  switch (value.type) {
    case 'ConfigError':
      return whenConfigError(value);

    case 'Still':
      return whenStill(value);

    case 'Started':
      return whenStarted(value);
  }
}

function withDefaults(c: Config): Config {
  return Object.assign({}, DEFAULT_CONFIG, c);
}

function configErrorThrows(client: ConfigError): IOE.IOEither<Error, void> {
  return IOE.MonadThrow.throwError(client.error);
}

function stillThrows(_: Still): IOE.IOEither<Error, void> {
  return IOE.MonadThrow.throwError(new Error(NOT_STARTED_ERR_MSG));
}

type ExecWhenIsStarted = (client: Started) => IOE.IOEither<Error, void>;

function notify(
  error: BS.NotifiableError,
  onError?: BS.OnErrorCallback
): ExecWhenIsStarted {
  return ({bugsnag}) =>
    IOE.tryCatch(() => bugsnag.notify(error, onError), E.toError);
}

function setUser(user: BS.User): ExecWhenIsStarted {
  return ({bugsnag}) =>
    IOE.rightIO(() => bugsnag.setUser(user.id, user.email, user.name));
}
