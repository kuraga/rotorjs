'use strict';

var path = require('path');
var gulp = require('gulp');
var runSequence = require('run-sequence');
var vinylPaths = require('vinyl-paths');
var del = require('del');
var gulpBabel = require('gulp-babel');
var gulpRollup = require('gulp-rollup');
var revertPath = require('gulp-revert-path');
var resolve = require('rollup-plugin-node-resolve');
var commonjs = require('rollup-plugin-commonjs');

var babelJsxOptions = {
  plugins: [
    ['transform-react-jsx', { pragma: 'h' }]
  ],
  compact: false
};

gulp.task('clean', function() {
  return gulp.src([
    path.join('dist')
  ])
  .pipe(vinylPaths(del));
});

gulp.task('build-system', function () {
  return gulp.src([
    path.join('src', '**', '*.js'),
    path.join('src', '**', '*.mjs'),
    path.join('src', '**', '*.jsx'),
    path.join('main.mjs')
  ], { base: '.' })
  .pipe(gulpBabel(babelJsxOptions))
  .pipe(revertPath())
  .pipe(gulpRollup({
    input: path.join('main.mjs'),
    output: {
      format: 'es',
      sourcemap: true
    },
    treeshake: false,
    acorn: {
      ecmaVersion: 2018
    },

    plugins: [
      resolve({
        extensions: [ '.mjs', '.js', '.json' ]
      }),

      commonjs({
        sourceMap: true
      })
    ],

    allowRealFiles: true
  }))
  .pipe(gulp.dest('dist'));
});

gulp.task('build-html', function () {
  return gulp.src([
    path.join('index.html')
  ])
  .pipe(gulp.dest(path.join('dist')));
});

gulp.task('build', function (callback) {
  return runSequence(
    'clean',
    ['build-system', 'build-html'],
    callback
  );
});
