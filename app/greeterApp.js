import App from '../lib/app';
import Router from '../lib/router';
import MainComponent from './mainComponent'
import GreeterComponent from './greeterComponent'

export default class GreeterApp extends App {

  constructor(rootElement, firstName, lastName) {
    var routerState = new Router(this, {

      '/': (match, routerComponentPath) => {
        return new MainComponent(this, [...routerComponentPath, 'greeterComponent']);
      },

      '/greeter/:firstName/:lastName': (match, routerComponentPath) => {
        return new GreeterComponent(this, [...routerComponentPath, 'greeterComponent'], {
          firstName: match.params.firstName,
          lastName: match.params.lastName
        });
      }

    });

    super(rootElement, routerState);

    this.state.component.onPopStateHandler(); // FIXME: we "initialize" router here. we can't do it before `super` call
  }

};
