import * as t from 'io-ts';

type UploadOpts = t.TypeOf<typeof UploadOpts>;
const UploadOpts = t.intersection(
  [
    t.type({
      apiKey: t.string
    }),
    t.partial({
      appVersion: t.string,
      directory: t.union([t.boolean, t.string]),
      endpoint: t.string,
      minifiedFile: t.string,
      minifiedUrl: t.string,
      overwrite: t.boolean,
      projectRoot: t.string,
      sourceMap: t.string,
      sources: t.record(t.string, t.string),
      uploadSources: t.boolean
    })
  ],
  'upload'
);

interface BugsnagPkgConfig extends t.TypeOf<typeof BugsnagPkgConfig> {}
const BugsnagPkgConfig = t.type(
  {
    upload: UploadOpts
  },
  'bugsnag'
);

export interface Package extends t.TypeOf<typeof Package> {}
export const Package = t.type(
  {
    version: t.string,
    bugsnag: BugsnagPkgConfig
  },
  'Package'
);
