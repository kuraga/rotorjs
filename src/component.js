export default function getComponentClass() {
  class Component {
    constructor(application, parent, name, additionalInitialState = {}) {
      this.application = application;
      this.parent = parent;
      this.name = name;

      this.__initialState = Object.assign({}, additionalInitialState, {
        application: this.application,
        parent: this.parent,
        name: this.name,
        component: this
      });
    }

    get initialState() {
      return this.__initialState;
    }

    activate() {
    }

    deactivate() {
    }

    get path() {
      let parentComponentPath = this.parent !== null ? this.parent.path : [];
      return parentComponentPath.concat(this.name);
    }

    get state() {
      return this.application.getComponentState(this.path);
    }

    render() {
      throw new Error('Not implemented');
    }
  }

  return Component;
}
