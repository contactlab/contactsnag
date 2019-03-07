#!/usr/bin/env node

/*eslint no-console: 0*/

const path = require('path');
const root = require('find-root');
const bugsnagSourcemaps = require('bugsnag-sourcemaps');

const ROOT = root(path.join(__dirname, '../..'));
const DEFAULT_BUNDLE = 'app/bundle.js';

const pkg = require(path.join(ROOT, 'package.json'));
const {version, bugsnag} = pkg;
const {apiKey, minifiedUrl, sourceMap, minifiedFile} = bugsnag;

const OPTIONS = {
  apiKey,
  minifiedUrl,
  endpoint: 'https://upload-bugsnag.contactlab.it/',
  appVersion: version,
  sourceMap: sourceMap || path.join(ROOT, `${DEFAULT_BUNDLE}.map`),
  minifiedFile: minifiedFile || path.join(ROOT, DEFAULT_BUNDLE),
  overwrite: 'true'
};

// --- Run command
console.log(`BUGSNAG: uploading sourcemap for v${version}`);

bugsnagSourcemaps
  .upload(OPTIONS)
  .then(() => console.log('BUGSNAG: Sourcemap was uploaded successfully.'))
  .catch(err =>
    console.error(`BUGSNAG: Something went wrong - ${err.message}`)
  );
