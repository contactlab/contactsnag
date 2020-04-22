import chalk from 'chalk';
import {right} from 'fp-ts/lib/Either';
import {traceConsole} from '../../src/bin/trace';

test('trace() should log a message to the console and return it', async () => {
  const spy = jest.spyOn(console, 'info').mockImplementation(() => undefined);

  const result = await traceConsole.log('TEST')();

  expect(result).toEqual(right('TEST'));
  expect(spy).toBeCalledTimes(1);
  expect(spy).toBeCalledWith(chalk.cyanBright('\n> TEST'));
});
