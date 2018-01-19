export default function getRouterComponent(Component, Trie) {
  class RouterComponent extends Component {
    constructor(application, parent, name, routes = {}) {
      const trie = new Trie();
      const compiledRoutes = {};
      for (const pattern of Object.keys(routes)) {
        compiledRoutes[pattern] = {
          node: trie.define(pattern),
          initializer: routes[pattern]
        };
      }

      const initialState = {
        __trie: trie,
        __compiledRoutes: compiledRoutes
      };
      super(application, parent, name, initialState);
    }

    deactivate() {
      if (this.currentComponentName !== undefined && this.currentComponentName !== null) {
        this.currentComponent.deactivate();
        this.removeSubcomponent(this.currentComponentName);
        this.state.set('currentComponentName', null);
      }
    }

    get currentComponentName() {
      return this.state.currentComponentName;
    }

    get currentComponent() {
      return this.currentComponentName === undefined
        ? undefined
        : this.currentComponentName === null
          ? null
          : this.getSubcomponent(this.currentComponentName);
    }

    route(newPath) {
      if (this.currentComponentName !== undefined && this.currentComponentName !== null) {
        this.currentComponent.deactivate();
        this.removeSubcomponent(this.currentComponentName);
      }
      this.state.set('currentComponentName', null);

      const currentMatch = this.state.__trie.match(newPath);
      if (currentMatch !== null) {
        const currentPattern = currentMatch.node.pattern;
        const currentRoute = this.state.__compiledRoutes[currentPattern];

        const currentComponent = (0, currentRoute.initializer)(currentMatch, this);
        this.state.set('currentComponentName', currentComponent.name)
        this.addSubcomponent(currentComponent);

        this.currentComponent.activate();

        return true;
      }

      return false;
    }

    renderInvalidRoute() {
      throw new Error('Not implemented');
    }

    render() {
      return this.currentComponentName !== undefined && this.currentComponentName !== null
        ? this.currentComponent.render()
        : this.renderInvalidRoute();
    }
  }

  return RouterComponent;
}
