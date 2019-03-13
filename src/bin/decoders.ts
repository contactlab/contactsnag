import * as t from 'io-ts';

interface BugsnagPkgConfig extends t.TypeOf<typeof BugsnagPkgConfig> {}
const BugsnagPkgConfig = t.type(
  {
    apiKey: t.string,
    minifiedUrl: t.string,
    sourceMap: t.string,
    minifiedFile: t.string
  },
  'Bugsnag config in package.json'
);

export interface Package extends t.TypeOf<typeof Package> {}
export const Package = t.type(
  {
    version: t.string,
    bugsnag: BugsnagPkgConfig
  },
  'Package'
);
