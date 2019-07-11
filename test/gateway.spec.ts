import {program} from '../src/bin/gateway';
import {result} from './_helpers';

test('program() should return the first command from arguments', () => {
  const command1 = program(['upload', 'report']);
  const command2 = program(['args', 'and', 'report', 'and', 'other']);
  const command3 = program(['report', 'upload', '--tail']);

  return expect(
    Promise.all([result(command1), result(command2), result(command3)])
  ).resolves.toEqual(['upload', 'report', 'report']);
});

test('program() should fail if no available command in arguments', () =>
  expect(result(program(['args', 'and', 'other', '--tail']))).rejects.toEqual(
    new Error('Use one of available commands: report | upload')
  ));
