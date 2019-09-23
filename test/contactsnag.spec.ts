// --- Mock Bugsnag
import {mocked} from 'ts-jest/utils';
jest.mock('../src/bugsnag');
import {Bugsnag, bugsnag} from '../src/bugsnag';
const bugsnagM = mocked(bugsnag);
// ---

// bugsnag's type definition does not work with jest.Mock definitions
// declaring as `any` seems to be the only way to run tests without errors (even if it lacks of type checking)
// (bugsnag as any).mockImplementation((_: Bugsnag.IConfig) => ({
bugsnagM.mockImplementation(
  () =>
    (({
      setOptions: () => undefined,
      notify: () => undefined
    } as unknown) as Bugsnag.Client)
);

import {ContactSnag} from '../src/index';

test('ContactSnag() should return a `Client` using an actual Bugsnag client', () => {
  const client = ContactSnag({
    apiKey: 'ABCD',
    notifyReleaseStages: ['production'],
    releaseStage: 'production',
    appVersion: '1.0.0'
  });

  client.start();

  expect(bugsnag).toBeCalled();
});
