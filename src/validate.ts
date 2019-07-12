import {Bugsnag} from '@bugsnag/js';
import {Either, left, right} from 'fp-ts/lib/Either';
import {Config} from './client';

const ERRMSG =
  '"endpoints" and "consoleBreadcrumbsEnabled" properties are not allowed in ContactSnag configuration object';

export function validate(a: Bugsnag.IConfig): Either<Error, Config> {
  return isValid(a) ? right(a) : left(new Error(ERRMSG));
}

function isValid(a: Bugsnag.IConfig): a is Config {
  return (
    typeof a.endpoints === 'undefined' &&
    typeof a.consoleBreadcrumbsEnabled === 'undefined'
  );
}
