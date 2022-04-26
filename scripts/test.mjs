import tman from 'tman';

tman.mocha();

import '../test/middlewares/cursorTest.mjs';
import '../test/middlewares/loopTest.mjs';
import '../test/applicationTest.mjs';
import '../test/componentTest.mjs';
import '../test/childlyComponentTest.mjs';

tman.run();
