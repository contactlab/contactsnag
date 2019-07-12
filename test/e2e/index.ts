import * as assert from 'assert';
import * as child_process from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const successesDir = path.join(__dirname, 'successes');
const failuresDir = path.join(__dirname, 'failures');
const successes = fs.readdirSync(successesDir);
const failures = fs.readdirSync(failuresDir);

// --- Test successes
successes
  .map(x => path.join(successesDir, x))
  .forEach(file => {
    assert.doesNotThrow(() => {
      child_process.execFileSync(file);
    }, getTestName(file));
  });

// --- Test failures
failures
  .map(x => path.join(failuresDir, x))
  .forEach(file => {
    assert.throws(() => {
      child_process.execFileSync(file);
    }, getTestName(file));
  });

// --- Helpers
function getTestName(file: string): string {
  return path.basename(file, '.js').replace(/-/g, ' ');
}
