declare global {
  namespace NodeJS {
    interface Global {
      window: any;
    }
  }
}

global.window = {};

import C = require('./modules/contactsnag');

const {ContactSnag} = C;

test('ContactSnag should be configured with defaults and apiKey from package.json', () => {
  expect(ContactSnag.apiKey).toBe('TEST-API-KEY');
  expect(ContactSnag.endpoint).toBe('https://notify-bugsnag.contactlab.it/js');
  expect(ContactSnag.user).toEqual({});
  expect(ContactSnag.notifyReleaseStages).toEqual(['development']);
  expect(ContactSnag.releaseStage).toBe('development');
  expect(ContactSnag.context).toBe('');
});

test('ContactSnag.notify()', () => {
  const spy = jest
    .spyOn(global.window.Bugsnag, 'notify')
    .mockImplementation(() => undefined);

  ContactSnag.notify('ERROR', 'CUSTOM_ERROR', {data: 'foo'});

  expect(spy).toBeCalledWith('ERROR', 'CUSTOM_ERROR', {
    data: 'foo'
  });

  spy.mockReset();
});
