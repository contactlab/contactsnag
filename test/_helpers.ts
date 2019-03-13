import {TaskEither} from 'fp-ts/lib/TaskEither';

const undef = () => undefined;

export function testSuccess<L, A>(
  te: TaskEither<L, A>,
  fn: (result: A) => void
): Promise<void> {
  return te.run().then(result => result.fold(undef, fn));
}

export function testFailure<L, A>(
  te: TaskEither<L, A>,
  fn: (result: L) => void
): Promise<void> {
  return te.run().then(result => result.fold(fn, undef));
}
