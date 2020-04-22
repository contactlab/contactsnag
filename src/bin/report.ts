import {sequenceT} from 'fp-ts/lib/Apply';
import * as A from 'fp-ts/lib/Array';
import * as TE from 'fp-ts/lib/TaskEither';
import {pipe} from 'fp-ts/lib/pipeable';
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
      '--release-stage production'
    ],
    args
  ).join(' ');

// --- Capabilities
export interface Capabilities extends Exec, ReadPkg, Trace {}

// --- Program
export const report = (C: Capabilities) => (args: string[]): Program =>
  pipe(
    C.read,
    TE.chain(data =>
      sequenceTE(
        C.log(`BUGSNAG: reporting build for v${data.version}`),
        C.exec(`npx bugsnag-build-reporter ${prepareOpts(data, args)}`)
      )
    ),
    TE.map(() => 'BUGSNAG: Build was reported successfully.')
  );
