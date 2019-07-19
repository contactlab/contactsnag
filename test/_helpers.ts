import {Bugsnag} from '@bugsnag/node';
import {Either} from 'fp-ts/lib/Either';
import {ioEither} from 'fp-ts/lib/IOEither';
import {TaskEither} from 'fp-ts/lib/TaskEither';
import {Client, Config} from '../src/client';

export const CONFIG: Config = {
  apiKey: 'ABCD',
  notifyReleaseStages: ['production'],
  releaseStage: 'production',
  appVersion: '1.0.0',
  user: {id: 123}
};

export function result<L, A>(
  te: TaskEither<L, A>,
  fn: (e: Either<L, A>) => void
): Promise<void>;
export function result<L, A>(te: TaskEither<L, A>): Promise<A>;
export function result<L, A>(
  te: TaskEither<L, A>,
  fn?: (e: Either<L, A>) => void
): Promise<A | void> {
  if (typeof fn === 'undefined') {
    return te
      .run()
      .then(r => r.fold(e => Promise.reject(e), v => Promise.resolve(v)));
  }

  return te.run().then(fn);
}

// --- Really unsafe - just for testing effects
export function createClient(
  onSetOptions: jest.Mock = jest.fn(),
  onNotify: jest.Mock = jest.fn()
): Client {
  const client = ({
    setOptions: onSetOptions,
    notify: onNotify
  } as unknown) as Bugsnag.Client;

  return ioEither.of(client);
}

export function createErrorClient(): Client {
  return ioEither.throwError(new Error('something went wrong'));
}
