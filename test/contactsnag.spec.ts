// --- Mock Bugsnag
jest.mock('@bugsnag/js');

import bugsnag, {Bugsnag} from '@bugsnag/js';
// ---

import {constUndefined} from 'fp-ts/lib/function';
import {ContactSnag} from '../src/index';
import {CONFIG} from './_helpers';

// bugsnag's type definition does not work with jest.Mock definitions
// declaring as `any` seems to be the only way to run tests without errors (even if it lacks of type checking)
(bugsnag as any).mockImplementation((_: Bugsnag.IConfig) => ({
  setOptions: constUndefined,
  notify: constUndefined
}));

test('ContactSnag() should return a `Client` using an actual Bugsnag client', () => {
  const client = ContactSnag(CONFIG);

  client.run();

  expect(bugsnag).toBeCalled();
});
