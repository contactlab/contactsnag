import {gateway} from './gateway';
import {Program} from './program';
import * as Report from './report';
import * as Upload from './upload';

export const main = (): Program =>
  gateway(process.argv.slice(2)).chain(command => {
    switch (command.cmd) {
      case 'upload':
        return Upload.upload(Upload.capabilities(command.args));
      case 'report':
        return Report.report(Report.capabilities(command.args));
    }
  });
