jest.mock('@bugsnag/js');

import bugsnag, {Bugsnag} from '@bugsnag/js';
import {ContactSnag, notify, setOptions} from '../src/index';

// bugsnag's type definition does not work with jest.Mock definitions
// declaring as `any` seems to be the only way to run tests without errors (even if it lacks of type checking)
(bugsnag as any).mockImplementation((config: Bugsnag.IConfig) => ({
  config,
  setOptions: optionsLogger,
  notify: notifyLogger
}));

beforeEach(() => {
  notifyLog = [];
  setOptionsLog = [];
});

test('ContactSnag(conf) should return an IOEither with a Bugsnag client in the `right` channel or an Error in the `left` channel if the provided `conf` is not valid', () => {
  const csnag = ContactSnag({
    apiKey: 'TEST-API-KEY',
    appVersion: '1.2.3',
    notifyReleaseStages: ['production'],
    releaseStage: 'production'
  });
  const client = csnag.run();

  expect(client.isRight()).toBe(true);
  expect(client.fold(() => null, c => c.config)).toEqual({
    apiKey: 'TEST-API-KEY',
    appVersion: '1.2.3',
    notifyReleaseStages: ['production'],
    releaseStage: 'production',
    endpoints: {
      notify: 'https://notify-bugsnag.contactlab.it/js'
    },
    consoleBreadcrumbsEnabled: false
  });

  const faultyCsnag = ContactSnag({
    endpoints: {notify: 'http://notify.server'},
    consoleBreadcrumbsEnabled: true
  } as any);
  const faultyClient = faultyCsnag.run();

  expect(faultyClient.isLeft()).toBe(true);
  expect(faultyClient.fold(err => err.message, () => null)).toBe(
    '"endpoint" and "consoleBreadcrumbsEnabled" properties are not allowed in ContactSnag configuration object'
  );
});

test('notify() should call notify method on provided ContactSnag instance', () => {
  const client = ContactSnag({
    apiKey: 'TEST-API-KEY',
    appVersion: '1.2.3',
    notifyReleaseStages: ['production'],
    releaseStage: 'production'
  });

  // Notify goes right
  const runOk = notify(client, new Error('something bad happened'), {
    user: {id: '1'},
    metaData: {custom: true}
  }).run();

  expect(runOk.isRight()).toBe(true);
  expect(notifyLog).toEqual([
    {
      err: new Error('something bad happened'),
      opts: {
        user: {id: '1'},
        metaData: {custom: true}
      }
    }
  ]);

  // Notify goes wrong (see mock implementation)
  const thrownsErr = notify(client, new Error('THROW')).run();
  expect(thrownsErr.isLeft()).toBe(true);
  expect(thrownsErr.fold(err => err.message, () => null)).toBe('ouch!');

  const thrownsCode = notify(client, 101).run();
  expect(thrownsCode.isLeft()).toBe(true);
  expect(thrownsCode.fold(err => err.message, () => null)).toBe('101');

  expect(notifyLog).toHaveLength(1);
});

test('setOptions() should set options on provided ContactSnag instance', () => {
  const client = ContactSnag({
    apiKey: 'TEST-API-KEY',
    appVersion: '1.2.3',
    notifyReleaseStages: ['production'],
    releaseStage: 'production'
  });

  // Set options goes right
  const runOk = setOptions(client, {
    apiKey: 'TEST-API-KEY',
    user: {id: 1}
  }).run();

  expect(runOk.isRight()).toBe(true);
  expect(setOptionsLog).toEqual([{apiKey: 'TEST-API-KEY', user: {id: 1}}]);

  // Set notify goes wrong
  const runKo = setOptions(client, {
    endpoints: {endpoints: {notify: 'http://notify.server'}}
  } as any).run();

  expect(runKo.isLeft()).toBe(true);
  expect(runKo.fold(err => err.message, () => null)).toBe(
    '"endpoint" and "consoleBreadcrumbsEnabled" properties are not allowed in ContactSnag configuration object'
  );

  expect(setOptionsLog).toHaveLength(1);
});

// --- Helpers
interface NotifyLog {
  err: Bugsnag.NotifiableError;
  opts?: Bugsnag.INotifyOpts;
}

let notifyLog: NotifyLog[] = [];
let setOptionsLog: Bugsnag.IConfig[] = [];

function optionsLogger(opts: Bugsnag.IConfig): void {
  setOptionsLog.push(opts);
}

function notifyLogger(
  err: Bugsnag.NotifiableError,
  opts?: Bugsnag.INotifyOpts
): void {
  if (err.message === 'THROW') {
    throw new Error('ouch!');
  }

  if (err === 101) {
    throw err;
  }

  notifyLog.push({err, opts});
}
