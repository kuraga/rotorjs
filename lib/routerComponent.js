import Component from './component';
import Trie from 'route-trie';
import h from 'virtual-dom/h';

export default class RouterComponent extends Component {

  // TODO: what if router isn't a root component
  constructor(application, routes, defaultPath = '/') {
    let initialState = {
      currentComponentName: null
    };
    super(application, null, 'router', initialState);

    this.defaultPath = defaultPath;

    this.trie = new Trie();
    this.compiledRoutes = [];
    Object.keys(routes).forEach( (pattern) => {
      this.compiledRoutes.push({
        node: this.trie.define(pattern),
        initializer: routes[pattern]
      });
    });

    return initialState;
  }

  activate() {
    this.onPopStateHandler();

    this.onPopStateHandlerBinded = this.onPopStateHandler.bind(this);
    window.addEventListener('popstate', this.onPopStateHandlerBinded);
  }

  deactivate() {
    window.removeEventListener('popstate', this.onPopStateHandlerBinded);
  }

  _getCurrentPattern() {
    let hash = this.application.ownerDocument.location.hash;
    let currentPattern = null;
    let currentMatch = this.trie.match(hash.slice(1));

    if (currentMatch !== null) {
      for (let pattern in this.compiledRoutes) {
        if (this.compiledRoutes[pattern].node === currentMatch.node) {
          currentPattern = pattern;
          break;
        }
      }
    }

    return [ currentPattern, currentMatch ];
  }

  onPopStateHandler(event = null) {
    let toChange = {};

    let oldComponentName = this.state.currentComponentName;
    if (oldComponentName !== null) {
      let oldComponent = this.state[oldComponentName].component;
      oldComponent.deactivate();
      toChange[oldComponentName] = null;
    }

    let currentComponentName;

    let [ currentPattern, currentMatch ] = this._getCurrentPattern();
    if (currentPattern !== null) {
      let currentRoute = this.compiledRoutes[currentPattern];
      let currentComponentState = currentRoute.initializer(currentMatch, this);
      let currentComponent = currentComponentState.component;

      currentComponentName = currentComponent.name;
      toChange[currentComponentName] = currentComponentState;
    } else {
      currentComponentName = null;
    }

    toChange.currentComponentName = currentComponentName;

    this.state.set(toChange);

    if (currentComponentName !== null) {
      this.state[currentComponentName].component.activate();
    }
  };

  render(...args) {
    let currentComponentName = this.state.currentComponentName;
    if (currentComponentName === null) {
      return h('div', 'Invalid route!');
    }

    let currentComponent = this.state[currentComponentName].component;
    return currentComponent.render.apply(currentComponent, args);
  }

}
