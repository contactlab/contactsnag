import {program} from '../src/bin/gateway';
import {testFailure, testSuccess} from './_helpers';

test('program() should return the first command from arguments', () => {
  const p1 = program(['upload', 'report']);
  const p2 = program(['args', 'and', 'report', 'and', 'other']);
  const p3 = program(['report', 'upload', '--tail']);

  return testSuccess(p1, data => expect(data).toBe('upload'))
    .then(() => testSuccess(p2, data => expect(data).toBe('report')))
    .then(() => testSuccess(p3, data => expect(data).toBe('report')));
});

test('program() should fail if no available command in arguments', () =>
  testFailure(program(['args', 'and', 'other', '--tail']), err =>
    expect(err.message).toBe('Use one of available commands: report | upload')
  ));
