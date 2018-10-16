'use strict';

const path = require('path');
const gulp = require('gulp');
const del = require('del');
const gulpBabel = require('gulp-babel');
const gulpRollup = require('gulp-rollup');
const revertPath = require('gulp-revert-path');
const json = require('rollup-plugin-json');
const bultins = require('rollup-plugin-node-builtins');
const globals = require('rollup-plugin-node-globals');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');

const babelJsxOptions = {
  plugins: [
    ['transform-react-jsx', { pragma: 'h' }]
  ],
  compact: false
};

function clean() {
  return del(path.join('dist'));
}
clean.displayName = 'clean';

function buildSystem() {
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
      json(),

      resolve({
        extensions: [ '.mjs', '.js', '.json' ]
      }),

      commonjs({
        sourceMap: true
      }),

      globals(),
      bultins()
    ],

    allowRealFiles: true
  }))
  .pipe(gulp.dest('dist'));
}
buildSystem.displayName = 'build:system';

function buildHtml() {
  return gulp.src([
    path.join('index.html')
  ])
  .pipe(gulp.dest(path.join('dist')));
}
buildHtml.displayName = 'build:html';

exports.clean = clean;
exports.build = gulp.series(
  clean,
  gulp.parallel(buildSystem, buildHtml)
);
