import {isLeft, isRight} from 'fp-ts/lib/Either';
import {validate} from '../src/validate';

test('validate() should return Right<Config>', () => {
  const result1 = validate({apiKey: 'abcd', user: {id: 123}});

  expect(isRight(result1)).toBe(true);
  expect((result1 as any).right).toEqual({apiKey: 'abcd', user: {id: 123}});

  const result2 = validate({
    apiKey: 'abcd',
    user: {id: 123},
    consoleBreadcrumbsEnabled: false
  });

  expect(isRight(result2)).toBe(true);
  expect((result2 as any).right).toEqual({
    apiKey: 'abcd',
    user: {id: 123},
    consoleBreadcrumbsEnabled: false
  });
});

test('validate() should return Left<Error>', () => {
  const result1 = validate({
    apiKey: 'abcd',
    endpoints: {notify: 'http://notify-server'}
  });

  expect(isLeft(result1)).toBe(true);
  expect((result1 as any).left).toEqual(
    new Error(
      '"endpoints" and "consoleBreadcrumbsEnabled" properties are not allowed in ContactSnag configuration object'
    )
  );

  const result2 = validate({
    apiKey: 'abcd',
    consoleBreadcrumbsEnabled: true
  });

  expect(isLeft(result2)).toBe(true);
  expect((result2 as any).left).toEqual(
    new Error(
      '"endpoints" and "consoleBreadcrumbsEnabled" properties are not allowed in ContactSnag configuration object'
    )
  );
});
