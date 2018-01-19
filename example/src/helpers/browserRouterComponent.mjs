import { RouterComponent } from './rotorJsClasses.mjs';

export default class BrowserRouterComponent extends RouterComponent {
  constructor(...args) {
    super(...args);

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
    const hash = this.application.ownerDocument.location.hash;
    const path = hash.slice(1);

    return path;
  }

  routeCurrentPath() {
    return this.route(this.__currentPath);
  }

  onPopState(event) {  // eslint-disable-line no-unused-vars
    return this.routeCurrentPath();
  }
}
