// const proxyquire        = require('proxyquire');
// const sinon             = require('sinon');

jest.mock('bugsnag-sourcemaps');

import bugsnagSourcemaps from 'bugsnag-sourcemaps';

test('CLI upload() should upload sourcemaps with configuration taken from package.json', () => {
  const spy = jest
    .spyOn(bugsnagSourcemaps, 'upload')
    .mockResolvedValue(undefined);

  // eslint-disable-next-line no-unused-vars
  // const upload = proxyquire('./modules/contactsnag/bin/upload.js', {
  //   bugsnagSourcemaps: {upload: spy}
  // });

  require('./modules/contactsnag/lib/bin/upload.js');

  expect(spy).toBeCalledWith({
    endpoint: 'https://upload-bugsnag.contactlab.it/',
    apiKey: 'TEST-API-KEY',
    appVersion: '0.1.0',
    minifiedUrl: 'https://my.application.com/bundle.js',
    sourceMap: './path/to/bundle.js.map',
    minifiedFile: './path/to/bundle.js',
    overwrite: 'true'
  });

  spy.mockReset();
});
