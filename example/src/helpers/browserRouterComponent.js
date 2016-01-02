import { RouterComponent } from './rotorJsClasses';

export default class BrowserRouterComponent extends RouterComponent {
  constructor(...args) {
    super(...args);

    this.onPopState = function (event) {  // eslint-disable-line no-unused-vars
      return this.routeCurrentPath();
    };
    this.__onPopStateBinded = this.onPopState.bind(this);
  }

  activate() {
    this.onPopState();

    super.activate();

    window.addEventListener('popstate', this.__onPopStateBinded);
  }

  deactivate() {
    window.removeEventListener('popstate', this.__onPopStateBinded);

    super.deactivate();
  }

  get __currentPath() {
    let hash = this.application.ownerDocument.location.hash;
    let path = hash.slice(1);

    return path;
  }

  routeCurrentPath() {
    return this.route(this.__currentPath);
  }
}
