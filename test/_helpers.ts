import {Bugsnag} from '@bugsnag/node';
import {ioEither} from 'fp-ts/lib/IOEither';
import {TaskEither} from 'fp-ts/lib/TaskEither';
import {Client, Config} from '../src/client';

export const noop = () => undefined;

export const CONFIG: Config = {
  apiKey: 'ABCD',
  notifyReleaseStages: ['production'],
  releaseStage: 'production',
  appVersion: '1.0.0',
  user: {id: 123}
};

export function testSuccess<L, A>(
  te: TaskEither<L, A>,
  fn: (result: A) => void
): Promise<void> {
  return te.run().then(result => result.fold(noop, fn));
}

export function testFailure<L, A>(
  te: TaskEither<L, A>,
  fn: (result: L) => void
): Promise<void> {
  return te.run().then(result => result.fold(fn, noop));
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
