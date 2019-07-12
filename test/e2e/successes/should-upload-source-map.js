#!/usr/bin/env node

const Mitm = require('mitm');
const {cliPath, e2ePath} = require('../helpers');

// --- Intercepts and mocks http requests
Mitm().on('request', function(req, res) {
  res.statusCode = 200;
  res.end();
});

// --- Set CLI arguments
process.argv.push('upload');

// --- Change cwd
process.chdir(e2ePath);

// --- Run CLI
require(cliPath);
