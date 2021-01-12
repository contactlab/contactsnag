import * as BS from '@bugsnag/js';
import {left, right, isRight} from 'fp-ts/Either';
import {create} from '../src/client';
import {Config} from '../src/validate';

afterEach(() => {
  jest.clearAllMocks();
});

// --- Creation
test('create() should return a `Still` Client when provided configuration is valid', () => {
  const client = create(CREATOR)(CONFIG);

  expect(CREATOR.start).not.toBeCalled();
  expect(client.client()).toEqual({
    type: 'Still',
    config: {
      ...CONFIG,
      enabledBreadcrumbTypes: [
        'error',
        'manual',
        'navigation',
        'process',
        'request',
        'state',
        'user'
      ]
    }
  });
});

test('create() should return a `ConfigError` Client when provided configuration is not valid', () => {
  const client = create(CREATOR)(BAD_CONFIG);

  expect(CREATOR.start).not.toBeCalled();
  expect(client.client()).toEqual({
    type: 'ConfigError',
    error: new Error(ERR)
  });
});

// --- Start
test('Client.start() should do nothing when Client is `ConfigError`', () => {
  const client = create(CREATOR)(BAD_CONFIG);

  client.start();

  expect(client.client().type).toBe('ConfigError');
  expect(CREATOR.start).not.toBeCalled();
});

test('Client.start() should start the Bugsnag client', () => {
  const client = create(CREATOR)(CONFIG);

  client.start();

  const actualClient = client.client() as any;

  expect(actualClient).toEqual({type: 'Started', bugsnag: BS_CLIENT});
  expect(CREATOR.start).toBeCalledTimes(1);
});

test('Client.start() should do nothing when Client is `Started`', () => {
  const client = create(CREATOR)(CONFIG);

  client.start();

  expect(client.client().type).toBe('Started');

  client.start();

  expect(CREATOR.start).toBeCalledTimes(1);
});

// --- Notify
test('Client.notify() should fail when Client is `ConfigError`', () => {
  const client = create(CREATOR)(BAD_CONFIG);

  client.start();

  const result = client.notify(new Error('Something happened'), event => {
    event.severity = 'warning';
  })();

  expect(result).toEqual(left(new Error(ERR)));

  expect(BS_CLIENT.notify).not.toBeCalled();
});

test('Client.notify() should fail when Client is `Still`', () => {
  const client = create(CREATOR)(CONFIG);

  const result = client.notify(new Error('Something happened'), event => {
    event.severity = 'warning';
  })();

  expect(result).toEqual(left(new Error('Client not yet started')));

  expect(BS_CLIENT.notify).not.toBeCalled();
});

test('Client.notify() should notify error with client when Client is `Started`', () => {
  const client = create(CREATOR)(CONFIG);

  client.start();

  const onError: BS.OnErrorCallback = event => {
    event.severity = 'warning';
  };

  const result = client.notify(new Error('Something happened'), onError)();

  expect(result).toEqual(right(undefined));
  expect(BS_CLIENT.notify).toBeCalledWith(
    new Error('Something happened'),
    onError
  );
});

test('Client.notify() should fail if client.notify throws error', () => {
  (BS_CLIENT.notify as any).mockImplementationOnce(() => {
    throw new Error('boom');
  });

  const client = create(CREATOR)(CONFIG);

  client.start();

  const onError: BS.OnErrorCallback = event => {
    event.severity = 'warning';
  };

  const result = client.notify(new Error('Something happened'), onError)();

  expect(result).toEqual(left(new Error('boom')));
  expect(BS_CLIENT.notify).toBeCalledWith(
    new Error('Something happened'),
    onError
  );
});

// --- Set user
test('Client.setUser() should fail when Client is `ConfigError`', () => {
  const client = create(CREATOR)(BAD_CONFIG);

  client.start();

  const result = client.setUser({id: '1234'})();

  expect(result).toEqual(left(new Error(ERR)));
});

test('Client.setUser() should fail when Client is `Still`', () => {
  const client = create(CREATOR)(CONFIG);

  const result = client.setUser({id: '1234'})();

  expect(result).toEqual(left(new Error('Client not yet started')));
});

test('Client.setUser() should set a session user on client when Client is `Started`', () => {
  const client = create(CREATOR)(CONFIG);

  client.start();

  const result = client.setUser({id: '1234'})();

  expect(isRight(result)).toBe(true);
  expect(BS_CLIENT.setUser).toBeCalledWith('1234', undefined, undefined);
});

// --- Helpers
const ERR =
  '"endpoints" and "enabledBreadcrumbTypes" properties are not allowed in ContactSnag configuration object';

const BS_CLIENT: BS.Client = {
  notify: jest.fn(),
  setUser: jest.fn()
} as any; // just for testing purpose

const CONFIG: Config = {
  apiKey: 'ABCD',
  enabledReleaseStages: ['production'],
  releaseStage: 'production',
  appVersion: '1.0.0'
};

const BAD_CONFIG: Config = {...CONFIG, enabledBreadcrumbTypes: ['log']} as any; // just for testing purpose

const CREATOR: BS.BugsnagStatic = {
  start: jest.fn().mockReturnValue(BS_CLIENT)
} as any;
