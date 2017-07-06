#!/usr/bin/env node

'use strict';

const PATH = require('path');
const ROOT = require('find-root');
const UPLOAD = require('bugsnag-sourcemaps').upload;
const PROJECT = require(ROOT(PATH.resolve(__dirname, './../')) + '/package.json');
const OPTIONS = {
  endpoint: 'https://upload-bugsnag.contactlab.it/',
  apiKey: PROJECT.bugsnag.apiKey,
  appVersion: PROJECT.version,
  minifiedUrl: PROJECT.bugsnag.minifiedUrl,
  sourceMap: PROJECT.bugsnag.sourceMap || ROOT(PATH.resolve(__dirname, './../')) + '/app/bundle.js.map',
  minifiedFile: PROJECT.bugsnag.minifiedFile || ROOT(PATH.resolve(__dirname, './../')) + '/app/bundle.js',
  overwrite: 'true'
}

console.log(`BUGSNAG: uploading sourcemap for v${PROJECT.version}`);

UPLOAD(OPTIONS, (err) => {
  if (err) {
    throw new Error(`BUGSNAG: Something went wrong - ${err.message}`);
  }
  console.log('BUGSNAG: Sourcemap was uploaded successfully.');
});
