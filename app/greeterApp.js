import App from '../lib/app';
import Router from '../lib/router';
import MainComponent from './mainComponent'
import GreeterComponent from './greeterComponent'

export default class GreeterApp extends App {

  constructor(rootElement) {
    super(rootElement);
  }

  start(firstName, lastName) {
    var routerState = new Router(this, {

      '/': (match, router) => {
        return new MainComponent(this, router, 'greeter');
      },

      '/greeter/:firstName/:lastName': (match, router) => {
        return new GreeterComponent(this, router, 'greeter', {
          firstName: match.params.firstName,
          lastName: match.params.lastName
        });
      }

    });

    super.start(routerState);
  }

};
