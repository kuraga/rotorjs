import objectPath from 'object-path';

export default class Component {

  constructor(app, parentComponent, componentName, initialState = {}) {
    this.app = app;
    this.parentComponent = parentComponent;
    this.componentName = componentName;
    initialState.component = this; // TODO: i don't like this
  }

  activate() {
  }

  deactivate() {
  }

  get componentPath() {
    let parentComponentPath = this.parentComponent !== null ? this.parentComponent.componentPath : [];
    return parentComponentPath.concat(this.componentName);
  }

  get state() {
    return objectPath.get(this.app.state, this.componentPath);
  }

};
