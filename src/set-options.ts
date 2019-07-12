import {Bugsnag} from '@bugsnag/js';
import {sequenceT} from 'fp-ts/lib/Apply';
import {IO} from 'fp-ts/lib/IO';
import {IOEither, fromEither, ioEither, rightIO} from 'fp-ts/lib/IOEither';
import {Client} from './client';
import {validate} from './validate';

const sequenceIOE = sequenceT(ioEither);

export function setOptions(
  client: Client,
  opts: Bugsnag.IConfig
): IOEither<Error, void> {
  return sequenceIOE(fromEither(validate(opts)), client).chain(([o, c]) =>
    rightIO(
      new IO(() => {
        c.setOptions(o);
      })
    )
  );
}
