#!/usr/bin/env node

const {root, cliPath} = require('../helpers');

// --- Set CLI arguments
process.argv.push('upload');

// --- Change cwd to root project: this will make decoding package.json fail
process.chdir(root);

// --- Run CLI
require(cliPath);
