#!/usr/bin/env node

import {main} from './program';
import {capabilities, program} from './upload';

// --- Run command
main(program(capabilities));
