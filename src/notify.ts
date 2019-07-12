import {Bugsnag} from '@bugsnag/js';
import {toError} from 'fp-ts/lib/Either';
import {IOEither, tryCatch2v} from 'fp-ts/lib/IOEither';
import {Client} from './client';

export function notify(
  client: Client,
  error: Bugsnag.NotifiableError,
  opts?: Bugsnag.INotifyOpts
): IOEither<Error, void> {
  return client.chain(c => tryCatch2v(() => c.notify(error, opts), toError));
}
