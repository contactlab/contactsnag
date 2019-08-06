import {Bugsnag} from '@bugsnag/js';
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
  expect(actualClient.bugsnag.config).toEqual({
    ...CONFIG,
    consoleBreadcrumbsEnabled: false
  });
  expect(actualClient.bugsnag).toHaveProperty('notify');
  expect(actualClient.bugsnag).toHaveProperty('setOptions');
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

  const result = client
    .notify(new Error('Something happened'), {severity: 'warning'})
    .run();

  expect(result.isLeft()).toBe(true);
  expect(result.value).toEqual(
    new Error(
      '"endpoints" and "consoleBreadcrumbsEnabled" properties are not allowed in ContactSnag configuration object'
    )
  );
  expect(testClient.spyNotify).not.toBeCalled();
});

test('Client.notify() should fail when Client is `Still`', () => {
  const testClient = TestClient();
  const client = create(testClient.create)(CONFIG);

  const result = client
    .notify(new Error('Something happened'), {severity: 'warning'})
    .run();

  expect(result.isLeft()).toBe(true);
  expect(result.value).toEqual(new Error('Client not yet started'));
  expect(testClient.spyNotify).not.toBeCalled();
});

test('Client.notify() should notify error with client when Client is `Started`', () => {
  const testClient = TestClient();
  const client = create(testClient.create)(CONFIG);

  client.start();

  const result = client
    .notify(new Error('Something happened'), {severity: 'warning'})
    .run();

  expect(result.isRight()).toBe(true);
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

  const result = client
    .notify(new Error('Something happened'), {severity: 'warning'})
    .run();

  expect(result.isLeft()).toBe(true);
  expect(result.value).toEqual(new Error('boom'));
  expect(testClient.spyNotify).toBeCalledWith(new Error('Something happened'), {
    severity: 'warning'
  });
});

// --- Set options
test('Client.setOptions() should fail when Client is `ConfigError`', () => {
  const testClient = TestClient();
  const client = create(testClient.create)(BAD_CONFIG);

  client.start();

  const result = client.setOptions({apiKey: 'ABCD', user: {id: 123}}).run();

  expect(result.isLeft()).toBe(true);
  expect(result.value).toEqual(
    new Error(
      '"endpoints" and "consoleBreadcrumbsEnabled" properties are not allowed in ContactSnag configuration object'
    )
  );
  expect(testClient.spySetOptions).not.toBeCalled();
});

test('Client.setOptions() should fail when Client is `Still`', () => {
  const testClient = TestClient();
  const client = create(testClient.create)(CONFIG);

  const result = client.setOptions({apiKey: 'ABCD', user: {id: 123}}).run();

  expect(result.isLeft()).toBe(true);
  expect(result.value).toEqual(new Error('Client not yet started'));
  expect(testClient.spySetOptions).not.toBeCalled();
});

test('Client.setOptions() should set options on client without errors when Client is `Started`', () => {
  const testClient = TestClient();
  const client = create(testClient.create)(CONFIG);

  client.start();

  // --- First time
  const result = client.setOptions({apiKey: 'ABCD', user: {id: 123}}).run();
  const expectedConfig = {
    ...CONFIG,
    consoleBreadcrumbsEnabled: false,
    user: {id: 123}
  };

  expect(result.isRight()).toBe(true);
  expect(testClient.spySetOptions).toBeCalledWith(expectedConfig);
  expect((client.client() as any).bugsnag.config).toEqual(expectedConfig);

  // --- Second time (update the same client);
  const result2 = client.setOptions({user: {id: 456}}).run();
  const expectedConfig2 = {...expectedConfig, user: {id: 456}};

  expect(result2.isRight()).toBe(true);
  expect(testClient.spySetOptions).toBeCalledWith(expectedConfig2);
  expect((client.client() as any).bugsnag.config).toEqual(expectedConfig2);
});

test('Client.setOptions() should set options, even without `apiKey` field, on client without errors when Client is `Started`', () => {
  const testClient = TestClient();
  const client = create(testClient.create)(CONFIG);

  client.start();

  const result = client.setOptions({user: {id: 123}}).run();
  const expectedConfig = {
    ...CONFIG,
    consoleBreadcrumbsEnabled: false,
    user: {id: 123}
  };

  expect(result.isRight()).toBe(true);
  expect(testClient.spySetOptions).toBeCalledWith(expectedConfig);
  expect((client.client() as any).bugsnag.config).toEqual(expectedConfig);
});

test('Client.setOptions() should fail if opts are not valid when Client is `Started`', () => {
  const testClient = TestClient();
  const client = create(testClient.create)(CONFIG);

  client.start();

  const result = client
    .setOptions({endpoints: {notify: 'http://notify-server'}})
    .run();

  expect(result.isLeft()).toBe(true);
  expect(result.value).toEqual(
    new Error(
      '"endpoints" and "consoleBreadcrumbsEnabled" properties are not allowed in ContactSnag configuration object'
    )
  );
  expect(testClient.spySetOptions).not.toBeCalled();
});

// --- Helpers
const CONFIG = {
  apiKey: 'ABCD',
  notifyReleaseStages: ['production'],
  releaseStage: 'production',
  appVersion: '1.0.0'
};

const BAD_CONFIG = {...CONFIG, consoleBreadcrumbsEnabled: true} as any; // just for testing purpose

const TestClient = () => {
  const spySetOptions = jest.fn();
  const spyNotify = jest.fn();
  const spyCreate = jest.fn(
    (configuration: Bugsnag.IConfig): Bugsnag.Client => {
      const client = ({
        config: configuration,

        setOptions: spySetOptions.mockImplementation(opts => {
          client.config = {...client.config, ...opts};
          return client;
        }),

        notify: spyNotify
      } as unknown) as Bugsnag.Client;

      return client;
    }
  );

  return {
    spySetOptions,
    spyNotify,
    create: spyCreate
  };
};
