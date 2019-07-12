jest.mock('read-pkg-up');

import readPkgUp from 'read-pkg-up';
import {readPkg} from '../../src/bin/read-pkg';
import {result} from '../_helpers';

const readPkgUpM: jest.Mock = readPkgUp as any;

test('readPkg should retrieve info from package.json', () => {
  readPkgUpM.mockResolvedValue({
    package: {
      name: 'test-pkg',
      version: '0.1.0',
      bugsnag: {
        apiKey: 'TEST-API-KEY',
        minifiedUrl: 'https://my.application.com/bundle.js',
        sourceMap: './path/to/bundle.js.map',
        minifiedFile: './path/to/bundle.js'
      }
    }
  });

  return expect(result(readPkg)).resolves.toEqual({
    name: 'test-pkg',
    version: '0.1.0',
    bugsnag: {
      apiKey: 'TEST-API-KEY',
      minifiedUrl: 'https://my.application.com/bundle.js',
      sourceMap: './path/to/bundle.js.map',
      minifiedFile: './path/to/bundle.js'
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
  readPkgUpM.mockResolvedValue({package: {version: '1.0.0'}});

  return expect(result(readPkg)).rejects.toEqual(
    new Error(
      'Invalid value undefined supplied to : Package/bugsnag: Bugsnag config in package.json'
    )
  );
});
