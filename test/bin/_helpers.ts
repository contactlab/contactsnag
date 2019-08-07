import {Either} from 'fp-ts/lib/Either';
import {TaskEither} from 'fp-ts/lib/TaskEither';

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
