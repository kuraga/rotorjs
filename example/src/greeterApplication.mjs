import { Application } from './helpers/rotorJsClasses.mjs';

import GreeterRouter from './greeterRouter.mjs';

export default class GreeterApplication extends Application {
  constructor(ownerDocument) {
    super();

    this.ownerDocument = ownerDocument;
  }

  start() {
    const router = new GreeterRouter(this, null, 'router');

    super.start(router);
  }

  stop() {
    alert('Good bye!');

    super.stop();
  }
}
