import { rollup } from 'rollup';
import json from '@rollup/plugin-json';
import polyfills from 'rollup-plugin-polyfill-node';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import path from 'path';

const inputPath = path.join('scripts', 'test.mjs'),
  outputPath = path.join('test', 'browser', 'testBrowserBundle.js');

const inputOptions = {
  input: inputPath,
  treeshake: false,
  acorn: {
    ecmaVersion: 2019
  },

  plugins: [
    json(),

    nodeResolve({
      preferBuiltins: false,
      browser: true,
      extensions: [ '.mjs', '.js', '.json' ]
    }),

    commonjs({
      sourceMap: false
    }),

    polyfills()
  ]
};
const outputOptions = {
  format: 'iife',
  sourcemap: false,
  file: outputPath
};

async function build() {
  const bundle = await rollup(inputOptions);
  await bundle.write(outputOptions);
}

build();
