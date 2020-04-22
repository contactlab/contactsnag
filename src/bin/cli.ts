#!/usr/bin/env node

import {execNode} from './exec';
import {main} from './main';
import {run} from './program';
import {readPkg} from './read-pkg';
import {traceConsole} from './trace';

run(
  main({
    ...readPkg,
    ...traceConsole,
    ...execNode
  })
);
