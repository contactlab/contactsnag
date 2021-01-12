import {right, left} from 'fp-ts/Either';
import {validate} from '../src/validate';

test('validate() should return Right<Config>', () => {
  const result1 = validate({apiKey: 'abcd', user: {id: '123'}});

  expect(result1).toEqual(right({apiKey: 'abcd', user: {id: '123'}}));

  const result2 = validate({
    apiKey: 'abcd',
    user: {id: '123'},
    enabledBreadcrumbTypes: ['error', 'navigation']
  });

  expect(result2).toEqual(
    right({
      apiKey: 'abcd',
      user: {id: '123'},
      enabledBreadcrumbTypes: ['error', 'navigation']
    })
  );
});

test('validate() should return Left<Error>', () => {
  const ERR =
    '"endpoints" and "enabledBreadcrumbTypes" properties are not allowed in ContactSnag configuration object';

  const result1 = validate({
    apiKey: 'abcd',
    endpoints: {
      notify: 'http://notify-server',
      sessions: 'http://sessions-server'
    }
  });

  expect(result1).toEqual(left(new Error(ERR)));

  const result2 = validate({
    apiKey: 'abcd',
    enabledBreadcrumbTypes: ['error', 'log']
  });

  expect(result2).toEqual(left(new Error(ERR)));
});
