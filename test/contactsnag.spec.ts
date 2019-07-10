jest.mock('@bugsnag/js');

import bugsnag, {Bugsnag} from '@bugsnag/js';
import {ContactSnag} from '../src/index';
import {CONFIG, noop} from './_helpers';

// bugsnag's type definition does not work with jest.Mock definitions
// declaring as `any` seems to be the only way to run tests without errors (even if it lacks of type checking)
(bugsnag as any).mockImplementation((_: Bugsnag.IConfig) => ({
  setOptions: noop,
  notify: noop
}));

test('ContactSnag() should return a `Client` using an actual Bugsnag client', () => {
  const client = ContactSnag(CONFIG);

  client.run();

  expect(bugsnag).toBeCalled();
});
