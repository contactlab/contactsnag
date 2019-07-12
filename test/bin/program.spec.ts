import chalk from 'chalk';
import {taskEither} from 'fp-ts/lib/TaskEither';
import {constUndefined} from 'fp-ts/lib/function';
import {Program, run} from '../../src/bin/program';

afterEach(() => {
  jest.restoreAllMocks();
});

test('run() should execute Program and exit with code 0', () => {
  const spyConsole = jest
    .spyOn(console, 'log')
    .mockImplementation(constUndefined);

  const spyExit = jest
    .spyOn(process, 'exit')
    .mockImplementation(() => undefined as never);

  const program: Program = taskEither.of('success');

  return run(program).then(() => {
    expect(spyConsole).toBeCalledWith(chalk.bold.greenBright('\n🗸 success\n'));
    expect(spyExit).toBeCalledWith(0);
  });
});

test('run() should execute Program and exit with code 1', () => {
  const spyConsole = jest
    .spyOn(console, 'error')
    .mockImplementation(constUndefined);

  const spyExit = jest
    .spyOn(process, 'exit')
    .mockImplementation(() => undefined as never);

  const program: Program = taskEither.throwError(new Error('fail'));

  return run(program).then(() => {
    expect(spyConsole).toBeCalledWith(chalk.bold.redBright('\n🗴 fail\n'));
    expect(spyExit).toBeCalledWith(1);
  });
});
