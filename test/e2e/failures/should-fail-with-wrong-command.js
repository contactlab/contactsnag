#!/usr/bin/env node

const {cliPath, e2ePath} = require('../helpers');

// --- Set CLI arguments
process.argv.push('report');

// --- Change cwd to root project: this will make decoding package.json fail
process.chdir(e2ePath);

// --- Run CLI
require(cliPath);
