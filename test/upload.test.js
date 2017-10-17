import path from 'path';
import test from 'ava';
import sinon from 'sinon';
import bugsnagSourcemaps from 'bugsnag-sourcemaps';

test('upload', async t => {
  t.plan(2);

  const spy = sinon.spy(bugsnagSourcemaps, 'upload');
  const upload = require('./modules/contactsnag/upload.js');

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
