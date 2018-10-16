export default function getChildlyComponent(Component) {
  class ChildlyComponent extends Component {
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

    route(...args) {
      if (this.currentComponentName !== undefined && this.currentComponentName !== null) {
        this.currentComponent.deactivate();
        this.removeSubcomponent(this.currentComponentName);
      }
      this.state.set('currentComponentName', null);

      const currentComponent = this.__match(...args);
      if (currentComponent !== null) {
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

    __match(...args) {  // eslint-disable-line no-unused-vars
      throw new Error('Not implemented');
    }
  }

  return ChildlyComponent;
}
