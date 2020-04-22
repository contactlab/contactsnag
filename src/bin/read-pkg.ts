import {Either, left, mapLeft, right} from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import {pipe} from 'fp-ts/lib/pipeable';
import {failure} from 'io-ts/lib/PathReporter';
import readPkgUp, {NormalizedReadResult as RPUPackage} from 'read-pkg-up';
import {Package} from './decoders';
import {Program} from './program';

const decodePkg = (json: unknown): Either<Error, Package> =>
  pipe(
    Package.decode(json),
    // only takes the first failure in order to not mess error messages
    mapLeft(errors => new Error(failure(errors)[0]))
  );

const readPkgUpTE: Program<RPUPackage['packageJson']> = () =>
  readPkgUp({cwd: process.cwd()}).then(result =>
    typeof result === 'undefined'
      ? left(new Error('Cannot find a package.json'))
      : right(result.packageJson)
  );

export interface ReadPkg {
  read: Program<Package>;
}

export const readPkg: ReadPkg = {
  read: pipe(
    readPkgUpTE,
    TE.chain(data => TE.fromEither(decodePkg(data)))
  )
};
