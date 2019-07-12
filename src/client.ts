import {Bugsnag} from '@bugsnag/js';
import {toError} from 'fp-ts/lib/Either';
import {IOEither, fromEither, tryCatch2v} from 'fp-ts/lib/IOEither';
import {validate} from './validate';

type KnownKeys<T> = {
  [K in keyof T]: string extends K ? never : number extends K ? never : K;
} extends {[_ in keyof T]: infer U}
  ? U
  : never;

type BugsnagConfig = Pick<Bugsnag.IConfig, KnownKeys<Bugsnag.IConfig>>;

interface BugsnagClientCreator {
  (config: Bugsnag.IConfig): Bugsnag.Client;
}

export type Config = Omit<
  BugsnagConfig,
  'endpoint' | 'endpoints' | 'consoleBreadcrumbsEnabled'
> & {
  notifyReleaseStages: NonNullable<BugsnagConfig['notifyReleaseStages']>;
  releaseStage: NonNullable<BugsnagConfig['releaseStage']>;
  appVersion: NonNullable<BugsnagConfig['appVersion']>;
};

const DEFAULT_CONFIG: Omit<BugsnagConfig, 'apiKey'> = {
  consoleBreadcrumbsEnabled: false
};

export type Client = IOEither<Error, Bugsnag.Client>;

export function client(
  creator: BugsnagClientCreator
): (conf: Config) => Client {
  return conf =>
    fromEither(validate(conf)).chain(c =>
      tryCatch2v(() => creator(merge(DEFAULT_CONFIG, c)), toError)
    );
}

// --- Helpers
function merge<A, B>(a: A, b: B): A & B {
  return Object.assign({}, a, b);
}
