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
  standalone: 'rotorjsMiddlewares',
  debug: true
};

browserify(path.join('middlewares.js'), browserifyOptions)
  .transform(babelify, babelOptions)
  .bundle()
  .pipe(process.stdout);
