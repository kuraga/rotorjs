export default function getRouterComponent(Component, PathNode) {  // eslint-disable-line no-unused-vars
  class RouterComponent extends Component {
    constructor(application, parent, name, rootPathNode) {
      const initialState = {
        __rootPathNode: rootPathNode
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

    route(uri) {
      if (this.currentComponentName !== undefined && this.currentComponentName !== null) {
        this.currentComponent.deactivate();
        this.removeSubcomponent(this.currentComponentName);
      }
      this.state.set('currentComponentName', null);

      const routePath = uri.split('/')
        .filter((chunk) => chunk.length > 0);
      const matched = this.state.__rootPathNode.match(routePath);
      if (matched !== null) {
        const [ matchedPathNode, matchedPathArguments ] = matched;

        if (matchedPathNode.data === undefined || !('initializer' in matchedPathNode.data)) {
          return null;
        }

        const currentComponent = (0, matchedPathNode.data.initializer)(matchedPathNode, matchedPathArguments, this);
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

  RouterComponent.__PathNode = PathNode;

  return RouterComponent;
}
