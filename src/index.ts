import {Bugsnag, default as bugsnag} from '@bugsnag/js';
import {IO, io} from 'fp-ts/lib/IO';
import {IOEither, left, right, tryCatch2v} from 'fp-ts/lib/IOEither';

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

type KnownKeys<T> = {
  [K in keyof T]: string extends K ? never : number extends K ? never : K
} extends {[_ in keyof T]: infer U}
  ? U
  : never;

type BugsnagConfig = Pick<Bugsnag.IConfig, KnownKeys<Bugsnag.IConfig>>;

type ContactSnagConfig = Omit<BugsnagConfig, 'endpoint' | 'endpoints'> & {
  notifyReleaseStages: NonNullable<BugsnagConfig['notifyReleaseStages']>;
  releaseStage: NonNullable<BugsnagConfig['releaseStage']>;
  appVersion: NonNullable<BugsnagConfig['appVersion']>;
};

type DefaultConfig = Pick<
  BugsnagConfig,
  'endpoints' | 'consoleBreadcrumbsEnabled'
>;

const DEFAULT_CONFIG: DefaultConfig = {
  endpoints: {
    notify: 'https://notify-bugsnag.contactlab.it/js'
  },
  consoleBreadcrumbsEnabled: false
};

const ERRMSG =
  '"endpoint" and "consoleBreadcrumbsEnabled" properties are not allowed in ContactSnag configuration object';

export type ContactSnagClient = IOEither<Error, Bugsnag.Client>;

export function ContactSnag(conf: ContactSnagConfig): ContactSnagClient {
  return isValid(conf)
    ? right(new IO(() => bugsnag({...DEFAULT_CONFIG, ...conf})))
    : left(io.of(new Error(ERRMSG)));
}

export function setOptions(
  client: ContactSnagClient,
  opts: Bugsnag.IConfig
): IOEither<Error, void> {
  return isValid(opts)
    ? client.chain(c =>
        right(
          new IO(() => {
            c.setOptions(opts);
          })
        )
      )
    : left(io.of(new Error(ERRMSG)));
}

export function notify(
  client: ContactSnagClient,
  error: Bugsnag.NotifiableError,
  opts?: Bugsnag.INotifyOpts
): IOEither<Error, void> {
  return client.chain(c =>
    tryCatch2v(
      () => {
        c.notify(error, opts);
      },
      err => (err instanceof Error ? err : new Error(String(err)))
    )
  );
}

// --- Helpers
function isValid(conf: any): boolean {
  return (
    typeof conf.endpoints === 'undefined' &&
    typeof conf.consoleBreadcrumbsEnabled === 'undefined'
  );
}
