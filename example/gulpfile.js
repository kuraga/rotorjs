'use strict';

var path = require('path');
var gulp = require('gulp');
var runSequence = require('run-sequence');
var vinylSourceStream = require('vinyl-source-stream');
var vinylPaths = require('vinyl-paths');
var del = require('del');
var browserify = require('browserify');
var jsxify = require('jsx-transform').browserifyTransform;
var babelify = require('babelify');

var paths = {
  output: path.join(__dirname, 'dist'),
  system: [path.join(__dirname, 'main.js')],
  systemOutput: path.join(__dirname, 'main.js'),
  html: path.join(__dirname, 'index.html')
};
var jsxOptions = {
  factory: 'h'
};
var babelOptions = {
  nonStandard: false,
  compact: false
};

gulp.task('clean', function() {
  return gulp.src([paths.output])
    .pipe(vinylPaths(del));
});

gulp.task('build-system', function () {
  return browserify(paths.system, { debug: true })
    .transform(jsxify, jsxOptions)
    .transform(babelify, babelOptions)
    .bundle()
    .pipe(vinylSourceStream(paths.systemOutput))
    .pipe(gulp.dest(paths.output));
});

gulp.task('build-html', function () {
  return gulp.src(paths.html)
    .pipe(gulp.dest(paths.output));
});

gulp.task('build', function (callback) {
  return runSequence(
    'clean',
    ['build-system', 'build-html'],
    callback
  );
});
