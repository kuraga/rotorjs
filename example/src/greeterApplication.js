import { Application, RouterComponent } from 'rotorjs';

import MainComponent from './mainComponent';
import GreeterComponent from './greeterComponent';

export default class GreeterApplication extends Application {

  constructor(rootNode) {
    super(rootNode);
  }

  start(firstName, lastName) {
    let router = new RouterComponent(this, null, 'router', {

      '': (match, router) => (
        new MainComponent(this, router, 'greeter')
      ),

      'greeter/:firstName/:lastName': (match, router) => (
        new GreeterComponent(this, router, 'greeter', {
          firstName: match.params.firstName,
          lastName: match.params.lastName
        })
      )

    });
    super.start(router);
  }

  stop() {
    alert('Good bye!');

    super.stop();
  }
};
