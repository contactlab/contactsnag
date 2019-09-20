import {isLeft, isRight} from 'fp-ts/lib/Either';
import {Bugsnag} from '../src/bugsnag';
import {create} from '../src/client';

// --- Creation
test('create() should return a `Still` Client when provided configuration is valid', () => {
  const client = create(TestClient().create)(CONFIG);

  expect(client.client().type).toBe('Still');
});

test('create() should return a `ConfigError` Client when provided configuration is not valid', () => {
  const client = create(TestClient().create)(BAD_CONFIG);
  const actualClient = client.client() as any;

  expect(actualClient.type).toBe('ConfigError');
  expect(actualClient.error).toEqual(
    new Error(
      '"endpoints" and "consoleBreadcrumbsEnabled" properties are not allowed in ContactSnag configuration object'
    )
  );
});

// --- Start
test('Client.start() should do nothing when Client is `ConfigError`', () => {
  const testClient = TestClient();
  const client = create(testClient.create)(BAD_CONFIG);

  client.start();

  expect(client.client().type).toBe('ConfigError');
  expect(testClient.create).not.toBeCalled();
});

test('Client.start() should start the Bugsnag client', () => {
  const testClient = TestClient();
  const client = create(testClient.create)(CONFIG);

  client.start();

  const actualClient = client.client() as any;

  expect(actualClient.type).toBe('Started');
  expect(actualClient.bugsnag.user).toEqual(DEFAULT_USER);
  expect(actualClient.bugsnag).toHaveProperty('notify');
  expect(testClient.create).toBeCalledTimes(1);
});

test('Client.start() should do nothing when Client is `Started`', () => {
  const testClient = TestClient();
  const client = create(testClient.create)(CONFIG);

  client.start();

  expect(client.client().type).toBe('Started');

  client.start();

  expect(testClient.create).toBeCalledTimes(1);
});

// --- Notify
test('Client.notify() should fail when Client is `ConfigError`', () => {
  const testClient = TestClient();
  const client = create(testClient.create)(BAD_CONFIG);

  client.start();

  const result = client.notify(new Error('Something happened'), {
    severity: 'warning'
  })();

  expect(isLeft(result)).toBe(true);
  expect((result as any).left).toEqual(
    new Error(
      '"endpoints" and "consoleBreadcrumbsEnabled" properties are not allowed in ContactSnag configuration object'
    )
  );
  expect(testClient.spyNotify).not.toBeCalled();
});

test('Client.notify() should fail when Client is `Still`', () => {
  const testClient = TestClient();
  const client = create(testClient.create)(CONFIG);

  const result = client.notify(new Error('Something happened'), {
    severity: 'warning'
  })();

  expect(isLeft(result)).toBe(true);
  expect((result as any).left).toEqual(new Error('Client not yet started'));
  expect(testClient.spyNotify).not.toBeCalled();
});

test('Client.notify() should notify error with client when Client is `Started`', () => {
  const testClient = TestClient();
  const client = create(testClient.create)(CONFIG);

  client.start();

  const result = client.notify(new Error('Something happened'), {
    severity: 'warning'
  })();

  expect(isRight(result)).toBe(true);
  expect(testClient.spyNotify).toBeCalledWith(new Error('Something happened'), {
    severity: 'warning'
  });
});

test('Client.notify() should fail if client.notify throws error', () => {
  const testClient = TestClient();
  testClient.spyNotify.mockImplementationOnce(() => {
    throw new Error('boom');
  });

  const client = create(testClient.create)(CONFIG);

  client.start();

  const result = client.notify(new Error('Something happened'), {
    severity: 'warning'
  })();

  expect(isLeft(result)).toBe(true);
  expect((result as any).left).toEqual(new Error('boom'));
  expect(testClient.spyNotify).toBeCalledWith(new Error('Something happened'), {
    severity: 'warning'
  });
});

// --- Set user
test('Client.setUser() should fail when Client is `ConfigError`', () => {
  const testClient = TestClient();
  const client = create(testClient.create)(BAD_CONFIG);

  client.start();

  const result = client.setUser({id: 1234})();

  expect(isLeft(result)).toBe(true);
  expect((result as any).left).toEqual(
    new Error(
      '"endpoints" and "consoleBreadcrumbsEnabled" properties are not allowed in ContactSnag configuration object'
    )
  );
});

test('Client.setUser() should fail when Client is `Still`', () => {
  const testClient = TestClient();
  const client = create(testClient.create)(CONFIG);

  const result = client.setUser({id: 1234})();

  expect(isLeft(result)).toBe(true);
  expect((result as any).left).toEqual(new Error('Client not yet started'));
});

test('Client.setUser() should set a session user on client when Client is `Started`', () => {
  const testClient = TestClient();
  const client = create(testClient.create)(CONFIG);

  client.start();

  const result = client.setUser({id: 1234})();

  expect(isRight(result)).toBe(true);
  expect((client.client() as any).bugsnag.user).toEqual({
    id: 1234
  });
});

// --- Helpers
const CONFIG = {
  apiKey: 'ABCD',
  notifyReleaseStages: ['production'],
  releaseStage: 'production',
  appVersion: '1.0.0'
};

const BAD_CONFIG = {...CONFIG, consoleBreadcrumbsEnabled: true} as any; // just for testing purpose

const DEFAULT_USER = {};

const TestClient = () => {
  const spyNotify = jest.fn();
  const spyCreate = jest.fn(
    (_: Bugsnag.IConfig): Bugsnag.Client => {
      const client = ({
        user: DEFAULT_USER,

        notify: spyNotify
      } as unknown) as Bugsnag.Client;

      return client;
    }
  );

  return {
    spyNotify,
    create: spyCreate
  };
};
