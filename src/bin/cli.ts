#!/usr/bin/env node

import {task} from 'fp-ts/lib/Task';
import {leftTask} from 'fp-ts/lib/TaskEither';
import {gateway} from './gateway';
import {Program, run} from './program';
import {capabilities, upload} from './upload';

// --- Program
const main: Program = gateway(process.argv.slice(2)).chain(command => {
  switch (command.cmd) {
    case 'upload':
      return upload(capabilities(command.args));
    case 'report':
      return leftTask(task.of(new Error('not yet implemented')));
  }
});

// --- Run command
run(main);
