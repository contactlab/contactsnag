import {client} from '../src/client';
import {CONFIG} from './_helpers';

test('client() should create a new client with provided config', () => {
  const spyCreator = jest.fn();
  const c = client(spyCreator)(CONFIG).run();

  expect(c.isRight()).toBe(true);
  expect(spyCreator).toBeCalledWith({
    consoleBreadcrumbsEnabled: false,
    ...CONFIG
  });
});

test('client() should fail if provided config is not valid', () => {
  const BAD_CONFIG = {
    ...CONFIG,
    consoleBreadcrumbsEnabled: true
  };
  const c = client(jest.fn())(BAD_CONFIG).run();

  expect(c.isLeft()).toBe(true);
  expect(c.value).toEqual(
    new Error(
      '"endpoints" and "consoleBreadcrumbsEnabled" properties are not allowed in ContactSnag configuration object'
    )
  );
});

test('client() should fail if Bugsnag client creator throws error', () => {
  const badCreator = jest.fn(() => {
    throw new Error('boom');
  });
  const c = client(badCreator)(CONFIG).run();

  expect(c.isLeft()).toBe(true);
  expect(c.value).toEqual(new Error('boom'));
});
