import {sequenceT} from 'fp-ts/lib/Apply';
import * as A from 'fp-ts/lib/Array';
import * as TE from 'fp-ts/lib/TaskEither';
import {pipe} from 'fp-ts/lib/pipeable';
import {Package} from './decoders';
import {ExecOutput, exec} from './exec';
import {Program} from './program';
import {ReadPkg, readPkg} from './read-pkg';
import {Trace, trace} from './trace';

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
export interface Capabilities {
  readPkg: ReadPkg;
  trace: Trace;
  reportBuild: (pkg: Package) => TE.TaskEither<Error, ExecOutput>;
}

export const capabilities = (args: string[]): Capabilities => ({
  readPkg,
  trace,
  reportBuild: pkg =>
    exec(`npx bugsnag-build-reporter ${prepareOpts(pkg, args)}`)
});

// --- Program
export const report = (c: Capabilities): Program =>
  pipe(
    c.readPkg,
    TE.chain(data =>
      sequenceTE(
        c.trace(`BUGSNAG: reporting build for v${data.version}`),
        c.reportBuild(data)
      )
    ),
    TE.map(() => 'BUGSNAG: Build was reported successfully.')
  );
