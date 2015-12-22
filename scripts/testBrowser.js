'use strict';

var browserify = require('browserify'),
    babelify = require('babelify'),
    globSync = require('glob').sync,
    path = require('path'),
    tapeRun = require('tape-run');

var babelOptions = {
  presets: ['es2015', 'stage-1'],
  plugins: ['transform-runtime'],
  compact: false
};
var browserifyOptions = {
  debug: true,
  insertGlobals: true
};
var tapeRunOptions = {
  browser: process.env.BROWSER
};

var testFilesGlob = path.join('test', '**', '*Test.js');
var testFiles = globSync(testFilesGlob);

browserify(testFiles, browserifyOptions)
  .transform(babelify, babelOptions)
  .bundle()
  .pipe(tapeRun(tapeRunOptions))
  .pipe(process.stdout);
