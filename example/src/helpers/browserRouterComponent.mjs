import RouterComponent from './routerComponent';

export default class BrowserRouterComponent extends RouterComponent {
  // TODO: Add `window` argument
  // TODO: Add `bindingWay` argument
  constructor(application, parent, name, rootPathNode) {
    super(application, parent, name, rootPathNode);

    this.onPopStateBinded = this.onPopState.bind(this);
  }

  activate() {
    super.activate();

    this.__curentPath = null;

    window.addEventListener('popstate', this.onPopStateBinded);
  }

  deactivate() {
    window.removeEventListener('popstate', this.onPopStateBinded);

    this.__curentPath = null;

    super.deactivate();
  }

  get currentPath() {
    return this.__currentPath;
  }

  routeToPath(path, syncLocationHash = true) {
    this.__currentPath = path;

    this.route(this.__currentPath);

    if (syncLocationHash) {
      this.__applyPathToLocationHashPath();
    }
  }

  routeToLocationHashPath() {
    return this.routeToPath(this.__currentLocationHashPath, false);
  }

  onPopState(event) {  // eslint-disable-line no-unused-vars
    return this.routeToLocationHashPath();
  }

  get __currentLocationHashPath() {
    const locationHash = window.location.hash;
    const currentLocationHashPath = locationHash.slice(1);

    return currentLocationHashPath;
  }

  __applyPathToLocationHashPath() {
    const locationHash = '#' + this.currentPath;
    window.history.pushState(this.currentPath, '', locationHash);
  }

  // TODO: Add `.window` property
  // TODO: Add `.bindingWay` property
}
