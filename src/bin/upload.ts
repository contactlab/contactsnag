import {
  BugsnagSourceMapsConfig,
  upload as uploadSourceMap
} from 'bugsnag-sourcemaps';
import {sequenceT} from 'fp-ts/lib/Apply';
import {toError} from 'fp-ts/lib/Either';
import {TaskEither, taskEither, tryCatch} from 'fp-ts/lib/TaskEither';
import {Package} from './decoders';
import {Program} from './program';
import {ReadPkg, readPkg} from './read-pkg';
import {Trace, trace} from './trace';

const sequenceTE = sequenceT(taskEither);

const DEFAULT_OPTS: Omit<BugsnagSourceMapsConfig, 'apiKey'> = {
  overwrite: true
};

const toOptions = ({version, bugsnag}: Package): BugsnagSourceMapsConfig => ({
  ...DEFAULT_OPTS,
  ...bugsnag.upload,
  appVersion: version
});

// --- Capabilities
export interface Capabilities {
  readPkg: ReadPkg;
  trace: Trace;
  uploadSourceMap: (opts: BugsnagSourceMapsConfig) => TaskEither<Error, void>;
}

export const capabilities: Capabilities = {
  readPkg,
  trace,
  uploadSourceMap: opts => tryCatch(() => uploadSourceMap(opts), toError)
};

// --- Program
export const upload = (c: Capabilities): Program =>
  c.readPkg
    .chain(data =>
      sequenceTE(
        c.trace(`BUGSNAG: uploading sourcemap for v${data.version}`),
        c.uploadSourceMap(toOptions(data))
      )
    )
    .map(() => 'BUGSNAG: Sourcemap was uploaded successfully.');
