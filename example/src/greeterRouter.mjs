/** @jsx h */

import BrowserRouterComponent from './helpers/browserRouterComponent.mjs';
import MainComponent from './mainComponent.mjs';
import GreeterComponent from './greeterComponent.mjs';

import h from 'virtual-dom/h';  // eslint-disable-line no-unused-vars

export default class GreeterRouter extends BrowserRouterComponent {
  constructor(application, parent, name) {
    const rootPathNode = new BrowserRouterComponent.__PathNode(null, {
      initializer: function (matchedPathNode, matchedPathArguments, router) {  // eslint-disable-line no-unused-vars
        return new MainComponent(application, router, 'greeter')
      }
    }),
    greeterPathNode = new BrowserRouterComponent.__PathNode('greeter'),
    personPathNode = new BrowserRouterComponent.__PathNode(/^(?<firstName>[^-]+?)-(?<lastName>[^-]+?)$/, {
      initializer: function (matchedPathNode, matchedPathArguments, router) {  // eslint-disable-line no-unused-vars
        return new GreeterComponent(application, router, 'greeter', {
          firstName: matchedPathArguments.firstName,
          lastName: matchedPathArguments.lastName
        });
      }
    });

    rootPathNode.push(greeterPathNode);
    greeterPathNode.push(personPathNode);

    super(application, parent, name, rootPathNode);
  }

  renderInvalidRoute() {
    return <div>
      Invalid route!
    </div>;
  }
}
