import Component from './component';
import Trie from 'route-trie';
import VText from 'virtual-dom/vnode/vtext';

export default class RouterComponent extends Component {

  constructor(application, parent = null, name = 'router', routes = {}) {
    let trie = new Trie();
    let compiledRoutes = {};
    for (let pattern of Object.keys(routes)) {
      compiledRoutes[pattern] = {
        node: trie.define(pattern),
        initializer: routes[pattern]
      };
    }

    let initialState = {
      currentComponentName: null,
      trie,
      compiledRoutes
    };
    super(application, parent, name, initialState);
  }

  activate() {
    super.activate();

    this.onPopStateHandler();

    this.state.set('onPopStateHandlerBinded', this.onPopStateHandler.bind(this));
    window.addEventListener('popstate', this.state.onPopStateHandlerBinded);
  }

  deactivate() {
    window.removeEventListener('popstate', this.state.onPopStateHandlerBinded);
    this.state.remove('onPopStateHandlerBinded');

    super.deactivate();
  }

  get currentComponentName() {
    return this.state.currentComponentName;
  }

  get currentComponent() {
    let currentComponentName = this.state.currentComponentName;
    return this.currentComponentName !== undefined && this.currentComponentName !== null ?
      this.state[this.currentComponentName] : null;
  }

  _getCurrentMatch() {
    let hash = this.application.ownerDocument.location.hash;
    let currentPattern = null;
    let currentMatch = this.state.trie.match(hash.slice(1));

    if (currentMatch !== null) {
      for (let pattern in this.state.compiledRoutes) {
        if (this.state.compiledRoutes.hasOwnProperty(pattern) && this.state.compiledRoutes[pattern].node === currentMatch.node) {
          return currentMatch;
        }
      }
    }

    return null;
  }

  onPopStateHandler(event = null) {
    if (this.currentComponent !== undefined && this.currentComponent !== null) {
      this.currentComponent.deactivate();
      this.state.remove(['currentComponentName', this.currentComponent.name]);
    }

    let currentMatch = this._getCurrentMatch();
    if (currentMatch !== null) {
      let currentPattern = currentMatch.node._nodeState.pattern;
      let currentRoute = this.state.compiledRoutes[currentPattern];
      let currentComponent = currentRoute.initializer(currentMatch, this);
      let currentComponentName = currentComponent.name;

      this.state.set({
        currentComponentName,
        [currentComponentName]: currentComponent
      });
    }

    if (this.currentComponent !== null) {
      this.currentComponent.activate();
    }
  };

  render(...args) {
    if (this.currentComponent === undefined || this.currentComponent === null) {
      return new VText('Invalid route!');
    }

    return this.currentComponent.render(...args);
  }

}
