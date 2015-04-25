import Component from './component';
import Trie from 'route-trie';
import h from 'virtual-dom/h';

export default class Router extends Component {

  constructor(app, routes, defaultPath = '/') {
    var initialState = {};
    super(app, null, 'router', initialState);

    this.defaultPath = defaultPath;

    this.trie = new Trie();
    this.compiledRoutes = [];
    Object.keys(routes).forEach( (pattern) => {
      this.compiledRoutes.push({
        node: this.trie.define(pattern),
        initializer: routes[pattern]
      });
    });

    window.addEventListener('popstate', this.onPopStateHandler.bind(this)); // FIXME: somebody have to turn this off

    return initialState;
  }

  onPopStateHandler(event = null) {
    let oldComponentName = this.state.currentComponentName;
    let toChange = {};

    if (oldComponentName !== undefined) {
      let oldComponent = this.state[oldComponentName].component;
      oldComponent.deactivate();
      toChange[oldComponentName] = undefined;
    }

    let hash = window.location.hash;
    let match = this.trie.match(hash.slice(1));

    let currentPattern;
    if (match !== null) {
      for (let pattern in this.compiledRoutes) {
        if (this.compiledRoutes[pattern].node === match.node) {
          currentPattern = pattern;
          break;
        }
      }
    }

    if (currentPattern !== undefined) {
      let currentRoute = this.compiledRoutes[currentPattern];
      let currentComponentState = currentRoute.initializer(match, this);
      let currentComponent = currentComponentState.component;
      var currentComponentName = currentComponent.componentName;

      toChange.currentComponentName = currentComponentName;
      toChange[currentComponentName] = currentComponentState;
    } else {
      toChange.currentComponentName = undefined;
    }

    this.state.set(toChange);

    if (currentComponentName !== undefined) {
      let currentComponentInState = this.state[currentComponentName].component;
      currentComponentInState.activate();
    }
  };

  render(...args) {
    let currentComponentName = this.state.currentComponentName;
    if (currentComponentName === undefined) {
      return h('div', 'Invalid route!');
    }

    let currentComponent = this.state[currentComponentName].component;
    return currentComponent.render.apply(currentComponent, args);
  }

}
