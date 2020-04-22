import chalk from 'chalk';
import {right, left} from 'fp-ts/lib/TaskEither';
import {constUndefined} from 'fp-ts/lib/function';
import {Program, run} from '../../src/bin/program';

afterEach(() => {
  jest.restoreAllMocks();
});

test('run() should execute Program and exit with code 0', async () => {
  const spyConsole = jest
    .spyOn(console, 'log')
    .mockImplementation(constUndefined);

  const spyExit = jest
    .spyOn(process, 'exit')
    .mockImplementation(() => undefined as never);

  const program: Program = right('success');

  await run(program);

  expect(spyConsole).toBeCalledWith(chalk.bold.greenBright('\n🗸 success\n'));
  expect(spyExit).toBeCalledWith(0);
});

test('run() should execute Program and exit with code 1', async () => {
  const spyConsole = jest
    .spyOn(console, 'error')
    .mockImplementation(constUndefined);

  const spyExit = jest
    .spyOn(process, 'exit')
    .mockImplementation(() => undefined as never);

  const program: Program = left(new Error('fail'));

  await run(program);

  expect(spyConsole).toBeCalledWith(chalk.bold.redBright('\n🗴 fail\n'));
  expect(spyExit).toBeCalledWith(1);
});
