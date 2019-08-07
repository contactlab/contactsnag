// --- Mock read-pkg-up
jest.mock('read-pkg-up');

import readPkgUp from 'read-pkg-up';

const readPkgUpM: jest.Mock = readPkgUp as any;
// ---

import {readPkg} from '../../src/bin/read-pkg';
import {result} from './_helpers';

test('readPkg should retrieve info from package.json', () => {
  readPkgUpM.mockResolvedValue({
    package: {
      name: 'test-pkg',
      version: '0.1.0',
      bugsnag: {
        apiKey: 'TEST-API-KEY',
        someOtherData: 'ignored'
      }
    }
  });

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
  readPkgUpM.mockResolvedValue({package: {version: '1.0.0', bugsnag: {}}});

  return expect(result(readPkg)).rejects.toEqual(
    new Error(
      'Invalid value undefined supplied to : Package/bugsnag: bugsnag/apiKey: string'
    )
  );
});
