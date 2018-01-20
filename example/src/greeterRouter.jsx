/** @jsx h */

import BrowserRouterComponent from './helpers/browserRouterComponent';
import MainComponent from './mainComponent.jsx';
import GreeterComponent from './greeterComponent.jsx';

import h from 'virtual-dom/h';  // eslint-disable-line no-unused-vars

export default class GreeterRouter extends BrowserRouterComponent {
  constructor(application, parent, name) {
    let routes = {
      '': (match, router) => (
        new MainComponent(application, router, 'greeter')
      ),
      'greeter/:firstName/:lastName': (match, router) => (
        new GreeterComponent(application, router, 'greeter', {
          firstName: match.params.firstName,
          lastName: match.params.lastName
        })
      )
    };

    super(application, parent, name, routes);
  }

  renderInvalidRoute() {
    return <div>
      Invalid route!
    </div>;
  }
}
