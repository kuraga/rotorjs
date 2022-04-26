export default function getComponentClass() {
  class Component {
    constructor(application, parent, name, additionalInitialState = {}) {
      this.__application = application;
      this.__parent = parent;
      this.__name = name;

      this.__initialState = Object.assign({}, additionalInitialState, {
        application: this.application,
        parent: this.parent,
        name: this.name,
        component: this,
        __subcomponents: {}
      });
    }

    get initialState() {
      return this.__initialState;
    }

    get application() {
      return this.__application;
    }

    get parent() {
      return this.__parent;
    }

    get name() {
      return this.__name;
    }

    activate() {
    }

    deactivate() {
    }

    get path() {
      const parentComponentPath = this.parent !== null ? this.parent.path : [];
      return parentComponentPath.concat(this.name);
    }

    get state() {
      return this.application.getComponentState(this.path);
    }

    render() {
      throw new Error('Not implemented');
    }

    get subcomponentNames() {
      return Object.keys(this.state.__subcomponents);
    }

    getSubcomponent(subcomponentName) {
      if (!Object.prototype.hasOwnProperty.call(this.state.__subcomponents, subcomponentName)) {
        throw new Error(`Subcomponent '${subcomponentName}' doesn't exist`);
      }

      const subcomponentState = this.state.__subcomponents[subcomponentName];
      return subcomponentState.component;
    }

    addSubcomponent(subcomponent) {
      if (subcomponent.parent !== this) {
        throw new Error(`Subcomponent has different parent`);
      }

      const subcomponentName = subcomponent.name;

      if (Object.prototype.hasOwnProperty.call(this.state.__subcomponents, subcomponentName)) {
        throw new Error(`Subcomponent '${subcomponentName}' already exists`);
      }

      this.state.__subcomponents.set(subcomponentName, subcomponent.initialState);

      return this;
    }

    removeSubcomponent(subcomponentName) {
      if (!Object.prototype.hasOwnProperty.call(this.state.__subcomponents, subcomponentName)) {
        throw new Error(`Subcomponent '${subcomponentName}' doesn't exist`);
      }

      this.state.__subcomponents.remove(subcomponentName);

      return this;
    }
  }

  return Component;
}
