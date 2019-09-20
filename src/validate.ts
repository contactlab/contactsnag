import * as E from 'fp-ts/lib/Either';
import {Bugsnag, BugsnagConfig} from './bugsnag';

type NonNullableConfig = Required<
  Pick<BugsnagConfig, 'notifyReleaseStages' | 'releaseStage' | 'appVersion'>
>;

type ValidConfig = Omit<BugsnagConfig, 'endpoint' | 'endpoints'>;

interface AllowedConfig {
  consoleBreadcrumbsEnabled?: false;
}

export type Config = ValidConfig & NonNullableConfig & AllowedConfig;

const ERRMSG =
  '"endpoints" and "consoleBreadcrumbsEnabled" properties are not allowed in ContactSnag configuration object';

export function validate(a: Bugsnag.IConfig): E.Either<Error, Config> {
  return isValid(a) ? E.right(a) : E.left(new Error(ERRMSG));
}

function isValid(a: Bugsnag.IConfig): a is Config {
  return (
    typeof a.endpoints === 'undefined' &&
    (typeof a.consoleBreadcrumbsEnabled === 'undefined' ||
      a.consoleBreadcrumbsEnabled === false)
  );
}
