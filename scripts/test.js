'use strict';

const globSync = require('glob').sync,
  path = require('path'),
  esm = require('esm'),
  tman = require('tman');

const esmRequire = esm(module);

const testFilesGlob = path.join(process.cwd(), 'test', '**', '*Test.mjs');
const testFiles = globSync(testFilesGlob);

for (const testFile of testFiles) {
  esmRequire(testFile);
}

tman.run();
