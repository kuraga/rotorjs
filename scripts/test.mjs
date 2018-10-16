import tman from 'tman';

tman.mocha();

import '../test/middlewares/cursorTest';
import '../test/middlewares/loopTest';
import '../test/applicationTest';
import '../test/componentTest';
import '../test/childlyComponentTest';

tman.run();
