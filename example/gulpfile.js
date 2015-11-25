'use strict';

var path = require('path');
var gulp = require('gulp');
var runSequence = require('run-sequence');
var vinylSourceStream = require('vinyl-source-stream');
var vinylPaths = require('vinyl-paths');
var del = require('del');
var browserify = require('browserify');
var babelify = require('babelify');

var paths = {
  output: path.join(__dirname, 'dist'),
  system: [path.join(__dirname, 'main.js')],
  systemOutput: path.join(__dirname, 'main.js'),
  html: path.join(__dirname, 'index.html')
};
var babelOptions = {
  global: true,
  ignore: /node_modules\/(?!rotorjs)/,
  presets: ['es2015', 'stage-1'],
  plugins: [
    ['transform-react-jsx', {pragma: 'h'}],
    ['transform-runtime']
  ],
  compact: false
};

gulp.task('clean', function() {
  return gulp.src([paths.output])
    .pipe(vinylPaths(del));
});

gulp.task('build-system', function () {
  return browserify(paths.system)
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
