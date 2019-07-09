import {BugsnagSourceMapsConfig, upload} from 'bugsnag-sourcemaps';
import {Either, either, left, toError} from 'fp-ts/lib/Either';
import {Task} from 'fp-ts/lib/Task';
import {TaskEither, fromEither, tryCatch} from 'fp-ts/lib/TaskEither';
import {flow} from 'fp-ts/lib/function';
import {failure} from 'io-ts/lib/PathReporter';
import readPkgUp, {NormalizedReadResult as RPUPackage} from 'read-pkg-up';
import {Package} from './decoders';
import {Program} from './program';
import {WithTrace, withTrace} from './trace';

// --- Constants
const UPLOAD_SERVER = 'https://upload-bugsnag.contactlab.it/';

// --- Helpers
const decodePkg = (json: unknown): Either<Error, Package> =>
  Package.decode(json).mapLeft(errors => new Error(failure(errors).join('\n')));

const readPkgUpTE = new TaskEither<Error, RPUPackage['package']>(
  new Task(() =>
    readPkgUp({cwd: process.cwd()}).then(result =>
      typeof result === 'undefined'
        ? left(new Error('Cannot find a package.json'))
        : either.of(result.package)
    )
  )
);

const readPkg = readPkgUpTE.chain(data => fromEither(decodePkg(data)));

const toOptions = ({version, bugsnag}: Package): BugsnagSourceMapsConfig => ({
  endpoint: UPLOAD_SERVER,
  apiKey: bugsnag.apiKey,
  appVersion: version,
  sourceMap: bugsnag.sourceMap,
  minifiedUrl: bugsnag.minifiedUrl,
  minifiedFile: bugsnag.minifiedFile,
  overwrite: true
});

// --- Capabilities
export interface Capabilities {
  getPkgInfo: TaskEither<Error, Package>;
  uploadSourceMap: (opts: BugsnagSourceMapsConfig) => TaskEither<Error, void>;
  withTrace: WithTrace;
}

export const capabilities: Capabilities = {
  getPkgInfo: readPkg,
  uploadSourceMap: opts => tryCatch(() => upload(opts), toError),
  withTrace
};

// --- Program
export const program = (c: Capabilities): Program =>
  c.getPkgInfo
    .chain(data =>
      c.withTrace(
        data,
        ({version}) => `BUGSNAG: uploading sourcemap for v${version}`,
        flow(
          toOptions,
          c.uploadSourceMap
        )
      )
    )
    .map(() => 'BUGSNAG: Sourcemap was uploaded successfully.');
