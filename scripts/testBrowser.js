const rollup = require('rollup');
const json = require('rollup-plugin-json');
const bultins = require('rollup-plugin-node-builtins');
const globals = require('rollup-plugin-node-globals');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const path = require('path');

const inputPath = path.join('scripts', 'test.mjs'),
  outputPath = path.join('test', 'browser', 'testBrowserBundle.js');

const inputOptions = {
  input: inputPath,
  treeshake: false,
  acorn: {
    ecmaVersion: 2018
  },

  plugins: [
    json(),

    resolve({
      preferBuiltins: false,
      extensions: [ '.mjs', '.js', '.json' ]
    }),

    commonjs({
      sourceMap: true
    }),

    globals(),
    bultins()
  ]
};
const outputOptions = {
  format: 'iife',
  sourcemap: false,
  file: outputPath
};

async function build() {
  const bundle = await rollup.rollup(inputOptions);
  await bundle.write(outputOptions);
}

build();
