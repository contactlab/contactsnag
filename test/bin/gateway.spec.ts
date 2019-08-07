import {gateway} from '../../src/bin/gateway';
import {result} from './_helpers';

test('gateway() should return Command from arguments', () => {
  const T1 = gateway(['upload', '--some=kind', '-o', '-f', 'arg']);
  const T2 = gateway(['report', '--some=kind', '-o', '-f', 'arg']);

  return expect(Promise.all([result(T1), result(T2)])).resolves.toEqual([
    {cmd: 'upload', args: ['--some=kind', '-o', '-f', 'arg']},
    {cmd: 'report', args: ['--some=kind', '-o', '-f', 'arg']}
  ]);
});

test('gateway() should fail if no available command from arguments', () =>
  expect(result(gateway(['args', 'and', 'other', '--tail']))).rejects.toEqual(
    new Error('Use one of available commands: upload | report')
  ));

test('gateway() should fail if no available command from arguments - wrong position', () =>
  expect(
    result(gateway(['other', 'upload', '--some=kind', '-o', '-f', 'arg']))
  ).rejects.toEqual(
    new Error('Use one of available commands: upload | report')
  ));
