'use strict';

var browserify = require('browserify'),
    babelify = require('babelify'),
    path = require('path');

var babelOptions = {
  presets: ['es2015', 'stage-1'],
  plugins: ['transform-runtime'],
  compact: false
};
var browserifyOptions = {
  standalone: 'rotorjs',
  debug: true
};

browserify(path.join('index.js'), browserifyOptions)
  .transform(babelify, babelOptions)
  .bundle()
  .pipe(process.stdout);
