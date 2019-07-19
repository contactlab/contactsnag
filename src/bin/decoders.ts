import * as t from 'io-ts';

interface BugsnagPkgConfig extends t.TypeOf<typeof BugsnagPkgConfig> {}
const BugsnagPkgConfig = t.type(
  {
    apiKey: t.string
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
