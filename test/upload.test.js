/**
 * Warning:
 * Tests use commonjs syntax in order to mock Bugsnag sourcemaps module
 */

const test              = require('ava');
const proxyquire        = require('proxyquire');
const sinon             = require('sinon');
const bugsnagSourcemaps = require('bugsnag-sourcemaps');

test('upload', t => {
  t.plan(2);

  const spy = sinon.spy(bugsnagSourcemaps, 'upload');
  // eslint-disable-next-line no-unused-vars
  const upload = proxyquire('./modules/contactsnag/bin/upload.js', {
    bugsnagSourcemaps: {upload: spy}
  });

  t.true(spy.called, 'should call bugsnag-sourcemaps `upload`');
  t.true(
    spy.calledWith({
      endpoint    : 'https://upload-bugsnag.contactlab.it/',
      apiKey      : 'TEST-API-KEY',
      appVersion  : '0.1.0',
      minifiedUrl : 'https://my.application.com/bundle.js',
      sourceMap   : './path/to/bundle.js.map',
      minifiedFile: './path/to/bundle.js',
      overwrite   : 'true'
    }),
    'should bugsnag-sourcemaps `upload` be called with correct options'
  );

  bugsnagSourcemaps.upload.restore();
});
