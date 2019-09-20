import chalk from 'chalk';
import {isRight} from 'fp-ts/lib/Either';
import {trace} from '../../src/bin/trace';
import {result} from './_helpers';

test('trace() should log a message to the console and return it', () => {
  const spy = jest.spyOn(console, 'info').mockImplementation(() => undefined);

  return result(trace('TEST'), data => {
    expect(isRight(data)).toBe(true);
    expect((data as any).right).toBe('TEST');
    expect(spy).toBeCalledTimes(1);
    expect(spy).toBeCalledWith(chalk.cyanBright('\n> TEST'));
  });
});
