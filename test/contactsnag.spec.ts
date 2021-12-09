// --- Mocks
jest.mock('@bugsnag/js');
// ---

import Bugsnag from '@bugsnag/js';
import {mocked} from 'jest-mock';
import {ContactSnag} from '../src/index';

const bugsnagM = mocked(Bugsnag);

test('ContactSnag() should return a `Client` using an actual Bugsnag client', () => {
  const client = ContactSnag({
    apiKey: 'ABCD',
    enabledReleaseStages: ['production'],
    releaseStage: 'production',
    appVersion: '1.0.0'
  });

  client.start();

  expect(bugsnagM.start).toBeCalled();
});
