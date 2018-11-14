import { Application } from './helpers/rotorJsClasses.mjs';

import GreeterRouter from './greeterRouter.mjs';

export default class GreeterApplication extends Application {
  start() {
    const router = new GreeterRouter(this, null, 'router');

    super.start(router);

    this.rootComponent.routeToLocationHashPath();
  }

  stop() {
    window.alert('Good bye!');

    super.stop();
  }
}
