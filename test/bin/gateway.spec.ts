import {right, left} from 'fp-ts/Either';
import {gateway} from '../../src/bin/gateway';

test('gateway() should return Command from arguments', async () => {
  const result1 = await gateway(['upload', '--some=kind', '-o', '-f', 'arg'])();

  expect(result1).toEqual(
    right({cmd: 'upload', args: ['--some=kind', '-o', '-f', 'arg']})
  );

  const result2 = await gateway(['report', '--some=kind', '-o', '-f', 'arg'])();
  expect(result2).toEqual(
    right({cmd: 'report', args: ['--some=kind', '-o', '-f', 'arg']})
  );
});

test('gateway() should fail if no available command from arguments', async () => {
  const result = await gateway(['args', 'and', 'other', '--tail'])();

  expect(result).toEqual(
    left(new Error('Use one of available commands: upload | report'))
  );
});

test('gateway() should fail if no available command from arguments - wrong position', async () => {
  const result = await gateway([
    'other',
    'upload',
    '--some=kind',
    '-o',
    '-f',
    'arg'
  ])();

  expect(result).toEqual(
    left(new Error('Use one of available commands: upload | report'))
  );
});
