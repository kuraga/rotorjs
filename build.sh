#!/bin/sh

./node_modules/.bin/browserify -t babelify main.js > dist.js
