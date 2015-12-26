import { Application } from './helpers/rotorJsClasses';

import GreeterRouter from './greeterRouter';

export default class GreeterApplication extends Application {
  constructor(rootNode) {
    super(rootNode);
  }

  start() {
    let router = new GreeterRouter(this, null, 'router');

    super.start(router);
  }

  stop() {
    alert('Good bye!');

    super.stop();
  }
}
