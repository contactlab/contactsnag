// --- Mock read-pkg-up
jest.mock('read-pkg-up');
// ---

import {right, left} from 'fp-ts/Either';
import readPkgUp from 'read-pkg-up';
import {mocked} from 'ts-jest/utils';
import {readPkg} from '../../src/bin/read-pkg';

const readPkgUpM = mocked(readPkgUp);

test('readPkg should retrieve info from package.json', async () => {
  readPkgUpM.mockResolvedValue(({
    packageJson: {
      name: 'test-pkg',
      version: '0.1.0',
      bugsnag: {
        apiKey: 'TEST-API-KEY',
        someOtherData: 'ignored'
      }
    }
  } as unknown) as readPkgUp.ReadResult);

  const result = await readPkg.read();

  expect(result).toEqual(
    right({
      name: 'test-pkg',
      version: '0.1.0',
      bugsnag: {
        apiKey: 'TEST-API-KEY',
        someOtherData: 'ignored'
      }
    })
  );
});

test('readPkg should fail if it cannot find a package.json', async () => {
  readPkgUpM.mockResolvedValue(undefined);

  const result = await readPkg.read();

  expect(result).toEqual(left(new Error('Cannot find a package.json')));
});

test('readPkg should fail if package.json has not valid data', async () => {
  readPkgUpM.mockResolvedValue(({
    packageJson: {version: '1.0.0', bugsnag: {}}
  } as unknown) as readPkgUp.ReadResult);

  const result = await readPkg.read();

  expect(result).toEqual(
    left(
      new Error(
        'Invalid value undefined supplied to : Package/bugsnag: bugsnag/apiKey: string'
      )
    )
  );
});
