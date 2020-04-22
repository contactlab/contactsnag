import * as TE from 'fp-ts/lib/TaskEither';
import {pipe} from 'fp-ts/lib/pipeable';
import {gateway} from './gateway';
import {Program} from './program';
import * as Report from './report';
import * as Upload from './upload';

export interface Capabilities
  extends Upload.Capabilities,
    Report.Capabilities {}

export const main = (C: Capabilities): Program =>
  pipe(
    TE.rightIO(() => process.argv.slice(2)),
    TE.chain(gateway),
    TE.chain(command => {
      switch (command.cmd) {
        case 'upload':
          return Upload.upload(C)(command.args);

        case 'report':
          return Report.report(C)(command.args);
      }
    })
  );
