import {Either, either, left} from 'fp-ts/lib/Either';
import {Task} from 'fp-ts/lib/Task';
import {TaskEither, fromEither} from 'fp-ts/lib/TaskEither';
import {failure} from 'io-ts/lib/PathReporter';
import readPkgUp, {NormalizedReadResult as RPUPackage} from 'read-pkg-up';
import {Package} from './decoders';

const decodePkg = (json: unknown): Either<Error, Package> =>
  // only takes the first failure in order to not mess error messages
  Package.decode(json).mapLeft(errors => new Error(failure(errors)[0]));

const readPkgUpTE = new TaskEither<Error, RPUPackage['package']>(
  new Task(() =>
    readPkgUp({cwd: process.cwd()}).then(result =>
      typeof result === 'undefined'
        ? left(new Error('Cannot find a package.json'))
        : either.of(result.package)
    )
  )
);

export type ReadPkg = typeof readPkg;
export const readPkg = readPkgUpTE.chain(data => fromEither(decodePkg(data)));
