import objectPath from 'object-path';

export default class Component {

  constructor(app, componentPath, initialState = {}) {
    this.app = app;
    this.componentPath = componentPath;
    initialState.component = this; // TODO: i don't like this
  }

  get componentName() {
    return this.componentPath.slice(-1)[0];
  }

  get state() {
    return objectPath.get(this.app.state, this.componentPath);
  }

};
