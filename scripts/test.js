'use strict';

const esm = require('esm'),
  tman = require('tman');

const esmRequire = esm(module);

esmRequire('../test/middlewares/cursorTest');
esmRequire('../test/middlewares/loopTest');
esmRequire('../test/applicationTest');
esmRequire('../test/componentTest');
esmRequire('../test/childlyComponentTest');

tman.run();
