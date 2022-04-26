import { rollup } from 'rollup';
import { babel } from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import polyfills from 'rollup-plugin-polyfill-node';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import path from 'path';

const inputPath = path.join('main.mjs'),
  outputPath = path.join('dist', 'main.mjs');

const inputOptions = {
  input: inputPath,
  treeshake: true,
  acorn: {
    ecmaVersion: 2019
  },

  plugins: [
    babel({
      plugins: [
        [ '@babel/transform-react-jsx', { } ]
      ],
      babelHelpers: 'bundled',
      compact: false
    }),

    json(),

    nodeResolve({
      preferBuiltins: false,
      browser: true,
      extensions: [ '.mjs', '.js', '.json' ]
    }),

    commonjs({
      sourceMap: true
    }),

    polyfills()
  ]
};
const outputOptions = {
  format: 'es',
  sourcemap: true,
  file: outputPath
};

async function build() {
  const bundle = await rollup(inputOptions);
  await bundle.write(outputOptions);
}

build();
