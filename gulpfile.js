'use strict';

var path = require('path');
var gulp = require('gulp');
var runSequence = require('run-sequence');
var vinylSourceStream = require('vinyl-source-stream');
var vinylPaths = require('vinyl-paths');
var del = require('del');
var gulpBabel = require('gulp-babel');

var paths = {
  source: path.join(__dirname, 'src', '**', '*.js'),
  destination: path.join(__dirname, 'dist'),
};
var babelOptions = {
  stage: 0,
  nonStandard: false,
  compact: false
};

gulp.task('clean', function() {
  return gulp.src(paths.destination)
    .pipe(vinylPaths(del));
});

gulp.task('build-system', function () {
  return gulp.src(paths.source)
    .pipe(gulpBabel(babelOptions))
    .pipe(gulp.dest(paths.destination));
});

gulp.task('dist', function (callback) {
  return runSequence(
    'clean',
    ['build-system'],
    callback
  );
});
