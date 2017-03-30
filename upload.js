'use strict';

const PATH = require('path');
const ROOT = require('find-root')
const UPLOAD = require('bugsnag-sourcemap').upload;
const PROJECT = require(ROOT(PATH.resolve(__dirname)) + '/package.json');

// console.log(PROJECT);
console.log(`BUGSNAG: uploading sourcemap for v${PROJECT.version}`);

UPLOAD({
  apiKey: PROJECT.bugsnag.apiKey,
  appVersion: PROJECT.version,
  minifiedUrl: PROJECT.bugsnag.minifiedUrl,
  sourceMap: PATH.resolve(__dirname, '../app/bundle.js.map'),
  minifiedFile: PATH.resolve(__dirname, '../app/bundle.js'),
  overwrite: 'true'
}, (err) => {
  if (err) {
    throw new Error(`BUGSNAG: Something went wrong - ${err.message}`);
  }
  console.log('BUGSNAG: Sourcemap was uploaded successfully.');
}, "https://upload-bugsnag.contactlab.it/");
