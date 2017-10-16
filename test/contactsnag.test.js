/**
 * Warning:
 * Tests use commonjs syntax in order to mock the hard-coded `window` reference in Bugsnag module
 */

const test        = require('ava');
const MockBrowser = require('mock-browser').mocks.MockBrowser;
const sinon       = require('sinon');

// mock window global object
global.window = MockBrowser.createWindow();
global.document = global.window.document;

const Bugsnag       = require('bugsnag-js');
const {ContactSnag} = require('./modules/contactsnag');

test('ContactSnag', t => {
  t.is(ContactSnag.apiKey, 'TEST-API-KEY', 'should be equal to the api key in package.json');
  t.is(ContactSnag.endpoint, 'https://notify-bugsnag.contactlab.it/js', 'should be the CLAB\'s Bugsnag url');
  t.is(ContactSnag.user, null, 'should be null');
  t.deepEqual(ContactSnag.notifyReleaseStages, ['development'], 'should be an array with only development stage');
  t.is(ContactSnag.releaseStage, 'development', 'should be the development stage');
  t.is(ContactSnag.context, null, 'should be null');
});

test('ContactSnag.notify()', t => {
  t.plan(2);

  const spy = sinon.spy(Bugsnag, 'notify');

  ContactSnag.notify('ERROR', 'CUSTOM_ERROR', {data: 'foo'});

  t.true(spy.called, 'should call Bugsnag.notify() under the hood');
  t.true(spy.calledWith('ERROR', 'CUSTOM_ERROR', {data: 'foo'}), 'should Bugsnag.notify() be called with same params');

  Bugsnag.notify.restore();
});
