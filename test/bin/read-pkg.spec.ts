// --- Mock read-pkg-up
import {mocked} from 'ts-jest/utils';
jest.mock('read-pkg-up');
import readPkgUp from 'read-pkg-up';
const readPkgUpM = mocked(readPkgUp);
// ---

import {readPkg} from '../../src/bin/read-pkg';
import {result} from './_helpers';

test('readPkg should retrieve info from package.json', () => {
  readPkgUpM.mockResolvedValue(({
    package: {
      name: 'test-pkg',
      version: '0.1.0',
      bugsnag: {
        apiKey: 'TEST-API-KEY',
        someOtherData: 'ignored'
      }
    }
  } as unknown) as readPkgUp.ReadResult);

  return expect(result(readPkg)).resolves.toEqual({
    name: 'test-pkg',
    version: '0.1.0',
    bugsnag: {
      apiKey: 'TEST-API-KEY',
      someOtherData: 'ignored'
    }
  });
});

test('readPkg should fail if it cannot find a package.json', () => {
  readPkgUpM.mockResolvedValue(undefined);

  return expect(result(readPkg)).rejects.toEqual(
    new Error('Cannot find a package.json')
  );
});

test('readPkg should fail if package.json has not valid data', () => {
  readPkgUpM.mockResolvedValue(({
    package: {version: '1.0.0', bugsnag: {}}
  } as unknown) as readPkgUp.ReadResult);

  return expect(result(readPkg)).rejects.toEqual(
    new Error(
      'Invalid value undefined supplied to : Package/bugsnag: bugsnag/apiKey: string'
    )
  );
});
