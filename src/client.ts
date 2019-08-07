import {toError} from 'fp-ts/lib/Either';
import {IO} from 'fp-ts/lib/IO';
import {IOEither, ioEither, rightIO, tryCatch2v} from 'fp-ts/lib/IOEither';
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

// --- Client
export interface Client {
  readonly client: () => ActualClient;

  readonly start: () => void;

  readonly notify: (
    error: Bugsnag.NotifiableError,
    opts?: Bugsnag.INotifyOpts
  ) => IOEither<Error, void>;

  readonly setUser: (user: object) => IOEither<Error, void>;
}

export const create = (creator: BugsnagClientCreator) => (
  config: Config
): Client => {
  let actualClient = validate(config).fold<ActualClient>(configError, conf =>
    still(merge(DEFAULT_CONFIG, conf))
  );

  const starter = (s: Still) => {
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

function configErrorThrows(client: ConfigError): IOEither<Error, any> {
  return ioEither.throwError(client.error);
}

function stillThrows(_: Still): IOEither<Error, any> {
  return ioEither.throwError(new Error(NOT_STARTED_ERR_MSG));
}

function notify(
  error: Bugsnag.NotifiableError,
  opts?: Bugsnag.INotifyOpts
): (client: Started) => IOEither<Error, void> {
  return v => tryCatch2v(() => v.bugsnag.notify(error, opts), toError);
}

function setUser(user: object): (client: Started) => IOEither<Error, void> {
  return v =>
    rightIO(
      new IO(() => {
        v.bugsnag.user = user;
      })
    );
}
