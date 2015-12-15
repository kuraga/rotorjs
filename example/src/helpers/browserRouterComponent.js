import { RouterComponent } from 'rotorjs';
import VText from 'virtual-dom/vnode/vtext';

export default class BrowserRouterComponent extends RouterComponent {

  activate() {
    this.onPopState = function (event = undefined) {
      this.route(this.__currentPath);
    }.bind(this);

    this.onPopState();

    super.activate();

    window.addEventListener('popstate', this.onPopState);
  }

  deactivate() {
    window.removeEventListener('popstate', this.onPopState);
    delete this.onPopState;

    super.deactivate();
  }

  get __currentPath() {
    let hash = this.application.rootNode.ownerDocument.location.hash;
    let path = hash.slice(1);

    return path;
  }

  renderInvalidRoute() {
    return new VText('Invalid route!');
  }
}
