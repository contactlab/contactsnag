import * as E from 'fp-ts/lib/Either';
import * as IOE from 'fp-ts/lib/IOEither';
import {constVoid as undef} from 'fp-ts/lib/function';
import {Bugsnag, BugsnagClientCreator} from './bugsnag';
import {Config, validate} from './validate';

// --- Constants
const DEFAULT_CONFIG = {
  consoleBreadcrumbsEnabled: false
};

const NOT_STARTED_ERR_MSG = 'Client not yet started';

// --- States
type ActualClient = ConfigError | Still | Started;

interface ConfigError {
  readonly type: 'ConfigError';
  readonly error: Error;
}

const configError = (error: Error): ConfigError => ({
  type: 'ConfigError',
  error
});

interface Still {
  readonly type: 'Still';
  readonly config: Config;
}

const still = (config: Config): Still => ({type: 'Still', config});

interface Started {
  readonly type: 'Started';
  readonly bugsnag: Bugsnag.Client;
}

const started = (client: Bugsnag.Client): Started => ({
  type: 'Started',
  bugsnag: client
});

const foldValidation = E.fold<Error, Config, ActualClient>(configError, conf =>
  still(merge(DEFAULT_CONFIG, conf))
);

// --- Client
export interface Client {
  readonly client: () => ActualClient;

  readonly start: () => void;

  readonly notify: (
    error: Bugsnag.NotifiableError,
    opts?: Bugsnag.INotifyOpts
  ) => IOE.IOEither<Error, void>;

  readonly setUser: (user: object) => IOE.IOEither<Error, void>;
}

export const create = (creator: BugsnagClientCreator) => (
  config: Config
): Client => {
  let actualClient = foldValidation(validate(config));

  const starter = (s: Still): void => {
    actualClient = started(creator(s.config));
  };

  const c: Client = {
    client: () => actualClient,

    start: () => fold(actualClient, undef, starter, undef),

    notify: (error, opts) =>
      fold(actualClient, configErrorThrows, stillThrows, notify(error, opts)),

    setUser: user =>
      fold(actualClient, configErrorThrows, stillThrows, setUser(user))
  };

  return c;
};

// --- Helpers
function fold<R>(
  value: ActualClient,
  whenError: (v: ConfigError) => R,
  whenStill: (v: Still) => R,
  whenStarted: (v: Started) => R
): R {
  switch (value.type) {
    case 'ConfigError':
      return whenError(value);

    case 'Still':
      return whenStill(value);

    case 'Started':
      return whenStarted(value);
  }
}

function merge<A, B>(a: A, b: B): A & B {
  return Object.assign({}, a, b);
}

function configErrorThrows(client: ConfigError): IOE.IOEither<Error, void> {
  return IOE.ioEither.throwError(client.error);
}

function stillThrows(_: Still): IOE.IOEither<Error, void> {
  return IOE.ioEither.throwError(new Error(NOT_STARTED_ERR_MSG));
}

type ExecuteOnStarted = (client: Started) => IOE.IOEither<Error, void>;

function notify(
  error: Bugsnag.NotifiableError,
  opts?: Bugsnag.INotifyOpts
): ExecuteOnStarted {
  return v => IOE.tryCatch(() => v.bugsnag.notify(error, opts), E.toError);
}

function setUser(user: object): ExecuteOnStarted {
  return v =>
    IOE.rightIO(() => {
      v.bugsnag.user = user;
    });
}
