import {validate} from '../src/validate';

test('validate() should return Right<Config>', () => {
  const result = validate({apiKey: 'abcd', user: {id: 123}});

  expect(result.isRight()).toBe(true);
  expect(result.value).toEqual({apiKey: 'abcd', user: {id: 123}});
});

test('validate() should return Left<Error>', () => {
  const result1 = validate({
    apiKey: 'abcd',
    endpoints: {notify: 'http://notify-server'}
  });

  expect(result1.isLeft()).toBe(true);
  expect(result1.value).toEqual(
    new Error(
      '"endpoints" and "consoleBreadcrumbsEnabled" properties are not allowed in ContactSnag configuration object'
    )
  );

  const result2 = validate({
    apiKey: 'abcd',
    consoleBreadcrumbsEnabled: true
  });

  expect(result2.isLeft()).toBe(true);
  expect(result2.value).toEqual(
    new Error(
      '"endpoints" and "consoleBreadcrumbsEnabled" properties are not allowed in ContactSnag configuration object'
    )
  );
});
