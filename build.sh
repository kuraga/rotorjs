#!/bin/sh

./node_modules/.bin/browserify -t unijsxify -t babelify main.js > dist.js
