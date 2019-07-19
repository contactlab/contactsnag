import {setOptions} from '../src/set-options';
import {createClient, createErrorClient} from './_helpers';

test('setOptions() should set options on client without errors', () => {
  const spySetOptions = jest.fn();
  const client = createClient(spySetOptions);
  const result = setOptions(client, {apiKey: 'ABCD', user: {id: 123}}).run();

  expect(result.isRight()).toBe(true);
  expect(spySetOptions).toBeCalledWith({apiKey: 'ABCD', user: {id: 123}});
});

test('setOptions() should set options, even without `apiKey` field, on client without errors', () => {
  const spySetOptions = jest.fn();
  const client = createClient(spySetOptions);
  const result = setOptions(client, {user: {id: 123}}).run();

  expect(result.isRight()).toBe(true);
  expect(spySetOptions).toBeCalledWith({user: {id: 123}});
});

test('setOptions() should fail if opts are not valid', () => {
  const spySetOptions = jest.fn();
  const client = createClient(spySetOptions);
  const result = setOptions(client, {
    apiKey: 'ABCD',
    endpoints: {notify: 'http://notify-server'}
  }).run();

  expect(result.isLeft()).toBe(true);
  expect(result.value).toEqual(
    new Error(
      '"endpoints" and "consoleBreadcrumbsEnabled" properties are not allowed in ContactSnag configuration object'
    )
  );
  expect(spySetOptions).not.toBeCalled();
});

test('setOptions() should fail if client has errors', () => {
  const client = createErrorClient();
  const result = setOptions(client, {apiKey: 'ABCD', user: {id: 123}}).run();

  expect(result.isLeft()).toBe(true);
  expect(result.value).toEqual(new Error('something went wrong'));
});
