import * as BS from '@bugsnag/js';
import * as E from 'fp-ts/Either';

type ValidConfig = Omit<BS.Config, 'endpoints'>;

type RequiredConfig = Required<
  Pick<ValidConfig, 'enabledReleaseStages' | 'releaseStage' | 'appVersion'>
>;

interface RedefinedConfig {
  enabledBreadcrumbTypes?: Array<Exclude<BS.BreadcrumbType, 'log'>>;
}

export type Config = ValidConfig & RequiredConfig & RedefinedConfig;

const ERRMSG =
  '"endpoints" and "enabledBreadcrumbTypes" properties are not allowed in ContactSnag configuration object';

export function validate(c: BS.Config): E.Either<Error, Config> {
  return isValid(c) ? E.right(c) : E.left(new Error(ERRMSG));
}

function isValid(c: BS.Config): c is Config {
  return typeof c.endpoints === 'undefined' && isBreadcrumbValid(c);
}

function isBreadcrumbValid(c: BS.Config): boolean {
  return (
    c.enabledBreadcrumbTypes !== null &&
    (typeof c.enabledBreadcrumbTypes === 'undefined' ||
      c.enabledBreadcrumbTypes.indexOf('log') < 0)
  );
}
