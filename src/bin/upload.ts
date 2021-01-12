import {sequenceT} from 'fp-ts/Apply';
import * as A from 'fp-ts/Array';
import * as TE from 'fp-ts/TaskEither';
import {pipe} from 'fp-ts/function';
import {Package} from './decoders';
import {Exec} from './exec';
import {Program} from './program';
import {ReadPkg} from './read-pkg';
import {Trace} from './trace';

const sequenceTE = sequenceT(TE.taskEither);
const concatS = A.getMonoid<string>().concat;

const prepareOpts = (pkg: Package, args: string[]): string =>
  concatS(
    [
      `--api-key ${pkg.bugsnag.apiKey}`,
      `--app-version ${pkg.version}`,
      '--overwrite'
    ],
    args
  ).join(' ');

// --- Capabilities
export interface Capabilities extends Exec, ReadPkg, Trace {}

// --- Program
export const upload = (C: Capabilities) => (args: string[]): Program =>
  pipe(
    C.read,
    TE.chain(data =>
      sequenceTE(
        C.log(`BUGSNAG: uploading sourcemap for v${data.version}`),
        C.exec(`npx bugsnag-sourcemaps upload ${prepareOpts(data, args)}`)
      )
    ),
    TE.map(() => 'BUGSNAG: Sourcemap was uploaded successfully.')
  );
