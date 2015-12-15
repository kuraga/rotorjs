import Component from './component';
import Trie from 'route-trie';

export default class RouterComponent extends Component {

  constructor(application, parent, name, routes = {}) {
    let trie = new Trie();
    let compiledRoutes = {};
    for (let pattern of Object.keys(routes)) {
      compiledRoutes[pattern] = {
        node: trie.define(pattern),
        initializer: routes[pattern]
      };
    }

    let initialState = {
      __trie: trie,
      __compiledRoutes: compiledRoutes
    };
    super(application, parent, name, initialState);
  }

  get currentComponentName() {
    return this.state.currentComponentName;
  }

  get currentComponent() {
    return this.currentComponentName === undefined
      ? undefined
      : this.currentComponentName === null
        ? null
        : this.state[this.currentComponentName];
  }

  route(newPath) {
    if (this.currentComponentName !== undefined && this.currentComponentName !== null) {
      this.currentComponent.deactivate();
      this.state.set(this.currentComponentName, null);
    }
    this.state.set('currentComponentName', null);

    let currentMatch = this.state.__trie.match(newPath);
    if (currentMatch !== null) {
      let currentPattern = currentMatch.node._nodeState.pattern;
      let currentRoute = this.state.__compiledRoutes[currentPattern];

      let currentComponent = currentRoute.initializer(currentMatch, this);

      this.state.set({
        currentComponentName: currentComponent.name,
        [currentComponent.name]: currentComponent
      });

      this.currentComponent.activate();
    }
  };

  renderInvalidRoute() {
    throw new Error('Not implemented');
  }

  render() {
    return this.currentComponentName !== undefined && this.currentComponentName !== null
      ? this.currentComponent.render()
      : this.renderInvalidRoute();
  }
}
