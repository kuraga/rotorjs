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
    return this.currentComponentName !== undefined && this.currentComponentName !== null ?
      this.state[this.currentComponentName] : null;
  }

  _getCurrentMatch() {
    let hash = this.application.rootNode.ownerDocument.location.hash;
    let path = hash.slice(1);
    return this.state.trie.match(path);
  }

  onPopStateHandler() {
    if (this.currentComponentName !== undefined && this.currentComponentName !== null) {
      this.currentComponent.deactivate();
      this.state.remove(this.currentComponent.name);
    }
    this.state.remove('currentComponentName');

    let currentMatch = this._getCurrentMatch();
    if (currentMatch !== null) {
      let currentPattern = currentMatch.node._nodeState.pattern;
      let currentRoute = this.state.compiledRoutes[currentPattern];

      let currentComponent = currentRoute.initializer(currentMatch, this);

      this.state.set({
        currentComponentName: currentComponent.name,
        [currentComponent.name]: currentComponent
      });

      this.currentComponent.activate();
    }
  };

  render() {
    if (this.currentComponentName === undefined || this.currentComponentName === null) {
      return new VText('Invalid route!');
    }

    return this.currentComponent.render();
  }

}
