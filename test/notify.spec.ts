import {notify} from '../src/notify';
import {createClient, createErrorClient} from './_helpers';

test('notify() should notify error with client', () => {
  const spyNotify = jest.fn();
  const client = createClient(jest.fn(), spyNotify);
  const result = notify(client, 'Something happened', {
    severity: 'warning'
  }).run();

  expect(result.isRight()).toBe(true);
  expect(spyNotify).toBeCalledWith('Something happened', {severity: 'warning'});
});

test('notify() should fail if client.notify throws error', () => {
  const client = createClient(
    jest.fn(),
    jest.fn(() => {
      throw new Error('boom');
    })
  );
  const result = notify(client, 'Something happened', {
    severity: 'warning'
  }).run();

  expect(result.isLeft()).toBe(true);
  expect(result.value).toEqual(new Error('boom'));
});

test('notify() should fail if client has errors', () => {
  const client = createErrorClient();
  const result = notify(client, 'Something happened', {
    severity: 'warning'
  }).run();

  expect(result.isLeft()).toBe(true);
  expect(result.value).toEqual(new Error('something went wrong'));
});
