import {result} from './_helpers';

import chalk from 'chalk';
import {TaskEither, taskEither} from 'fp-ts/lib/TaskEither';
import {withTrace} from '../src/bin/trace';

test('withTrace() should apply an effectful operation with provided data logging a message to the console', () => {
  const spy = jest.spyOn(console, 'info').mockImplementation(() => undefined);
  const msg = (a: string): string => `MSG: ${a}`;
  const effect = (a: string): TaskEither<Error, string> => taskEither.of(a);

  return result(withTrace('TEST', msg, effect), data => {
    expect(data.isRight()).toBe(true);
    expect(data.value).toBe('TEST');
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(chalk.cyanBright('\n> MSG: TEST'));
  });
});
