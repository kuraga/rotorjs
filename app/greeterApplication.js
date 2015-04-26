import Application from '../lib/application';
import RouterComponent from '../lib/routerComponent';
import MainComponent from './mainComponent';
import GreeterComponent from './greeterComponent';

export default class GreeterApplication extends Application {

  constructor(rootElement) {
    super(rootElement);
  }

  start(firstName, lastName) {
    let routerState = new RouterComponent(this, {

      '/': (match, router) => (
        new MainComponent(this, router, 'greeter')
      ),

      '/greeter/:firstName/:lastName': (match, router) => (
        new GreeterComponent(this, router, 'greeter', {
          firstName: match.params.firstName,
          lastName: match.params.lastName
        })
      )

    });

    super.start(routerState);
  }

};
