import {Bugsnag} from '@bugsnag/js';
import {IO} from 'fp-ts/lib/IO';
import {IOEither, fromEither, rightIO} from 'fp-ts/lib/IOEither';
import {Client} from './client';
import {validate} from './validate';

export type AnyBugsnagConfig = Partial<Bugsnag.IConfig>;

export function setOptions(
  client: Client,
  opts: AnyBugsnagConfig
): IOEither<Error, void> {
  return client.chain(c =>
    fromEither(validate(Object.assign({}, c.config, opts))).chain(o =>
      rightIO(
        new IO(() => {
          c.setOptions(o);
        })
      )
    )
  );
}
