import Component from './component';
import Trie from 'route-trie';
import h from 'virtual-dom/h';

export default class RouterComponent extends Component {

  // TODO: what if router isn't a root component
  constructor(application, routes, defaultPath = '/') {
    let trie = new Trie();
    let compiledRoutes = {};
    Object.keys(routes).forEach( (pattern) => {
      compiledRoutes[pattern] = {
        node: trie.define(pattern),
        initializer: routes[pattern]
      };
    });

    let initialState = {
      defaultPath,
      currentComponentName: null,
      trie,
      compiledRoutes
    };
    super(application, null, 'router', initialState);
  }

  activate() {
    this.onPopStateHandler();

    this.state.set('onPopStateHandlerBinded', this.onPopStateHandler.bind(this));
    window.addEventListener('popstate', this.state.onPopStateHandlerBinded);
  }

  deactivate() {
    window.removeEventListener('popstate', this.state.onPopStateHandlerBinded);
    this.state.remove('onPopStateHandlerBinded');
  }

  get currentComponentName() {
    return this.state.currentComponentName;
  }

  get currentComponent() {
    let currentComponentName = this.state.currentComponentName;
    return this.currentComponentName !== undefined && this.currentComponentName !== null ?
      this.state[this.currentComponentName] : null;
  }

  _getCurrentPattern() {
    let hash = this.application.ownerDocument.location.hash;
    let currentPattern = null;
    let currentMatch = this.state.trie.match(hash.slice(1));

    if (currentMatch !== null) {
      for (let pattern in this.state.compiledRoutes) {
        if (this.state.compiledRoutes.hasOwnProperty(pattern) && this.state.compiledRoutes[pattern].node === currentMatch.node) {
          return [ pattern, currentMatch ];
        }
      }
    }

    return [ null, null ];
  }

  onPopStateHandler(event = null) {
    if (this.currentComponent !== undefined && this.currentComponent !== null) {
      this.currentComponent.deactivate();
      this.state.remove(['currentComponentName', this.currentComponent.name]);
    }

    let [ currentPattern, currentMatch ] = this._getCurrentPattern();
    if (currentPattern !== null) {
      let currentRoute = this.state.compiledRoutes[currentPattern];
      let currentComponent = currentRoute.initializer(currentMatch, this);

      this.state.set({
        currentComponentName: currentComponent.name,
        [currentComponent.name]: currentComponent
      });
    }

    if (this.currentComponent !== null) {
      this.currentComponent.activate();
    }
  };

  render(...args) {
    if (this.currentComponent === undefined || this.currentComponent === null) {
      return h('div', 'Invalid route!');
    }

    return this.currentComponent.render(...args);
  }

}
