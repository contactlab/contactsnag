import {Either, either, left, mapLeft} from 'fp-ts/lib/Either';
import {TaskEither, fromEither, taskEither} from 'fp-ts/lib/TaskEither';
import {pipe} from 'fp-ts/lib/pipeable';
import {failure} from 'io-ts/lib/PathReporter';
import readPkgUp, {NormalizedReadResult as RPUPackage} from 'read-pkg-up';
import {Package} from './decoders';

const teChain = taskEither.chain;

const decodePkg = (json: unknown): Either<Error, Package> =>
  pipe(
    Package.decode(json),
    // only takes the first failure in order to not mess error messages
    mapLeft(errors => new Error(failure(errors)[0]))
  );

const readPkgUpTE: TaskEither<Error, RPUPackage['package']> = () =>
  readPkgUp({cwd: process.cwd()}).then(result =>
    typeof result === 'undefined'
      ? left(new Error('Cannot find a package.json'))
      : either.of(result.package)
  );

export type ReadPkg = typeof readPkg;
export const readPkg = teChain(readPkgUpTE, data =>
  fromEither(decodePkg(data))
);
