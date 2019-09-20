import * as TE from 'fp-ts/lib/TaskEither';
import {gateway} from './gateway';
import {Program} from './program';
import * as Report from './report';
import * as Upload from './upload';

const teChain = TE.taskEither.chain;

export const main = (): Program =>
  teChain(gateway(process.argv.slice(2)), command => {
    switch (command.cmd) {
      case 'upload':
        return Upload.upload(Upload.capabilities(command.args));

      case 'report':
        return Report.report(Report.capabilities(command.args));
    }
  });
