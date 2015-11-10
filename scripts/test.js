'use strict';

var globSync = require('glob').sync,
    path = require('path');

var babelOptions = {
  ignore: /node_modules\/(?!rotorjs)/,
  presets: ['es2015', 'stage-1'],
  plugins: ['transform-runtime'],
  compact: false
};

var testFilesGlob = path.join(process.cwd(), 'test', '**', '*Test.js');
var testFiles = globSync(testFilesGlob);

require('babel-register')(babelOptions);

testFiles.forEach(function(file) {
  require(file);
});
