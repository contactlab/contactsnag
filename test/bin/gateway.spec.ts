import {gateway} from '../../src/bin/gateway';
import {result} from '../_helpers';

test('program() should return the first command from arguments', () => {
  const command1 = gateway(['upload', 'report']);
  const command2 = gateway(['args', 'and', 'report', 'and', 'other']);
  const command3 = gateway(['report', 'upload', '--tail']);

  return expect(
    Promise.all([result(command1), result(command2), result(command3)])
  ).resolves.toEqual(['upload', 'report', 'report']);
});

test('program() should fail if no available command in arguments', () =>
  expect(result(gateway(['args', 'and', 'other', '--tail']))).rejects.toEqual(
    new Error('Use one of available commands: report | upload')
  ));
