import tman from 'tman';

tman.mocha();

import '../test/middlewares/cursorTest';
import '../test/middlewares/loopTest';
import '../test/middlewares/pathNodeTest';
import '../test/applicationTest';
import '../test/componentTest';
import '../test/routerComponentTest';

tman.run();
