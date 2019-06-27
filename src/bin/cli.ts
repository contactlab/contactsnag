#!/usr/bin/env node

import {task} from 'fp-ts/lib/Task';
import {leftTask} from 'fp-ts/lib/TaskEither';
import * as gateway from './gateway';
import {Program, main} from './program';
import * as upload from './upload';

// --- Program
const program = (): Program =>
  gateway.program(process.argv.slice(2)).chain(command => {
    switch (command) {
      case 'upload':
        return upload.program(upload.capabilities);
      case 'report':
        return leftTask(task.of(new Error('not yet implemented')));
    }
  });

// --- Run command
main(program());
