import objectPath from 'object-path';

export default class Component {

  constructor(application, parent, name, initialState = {}) {
    this.application = application;
    this.parent = parent;
    this.name = name;
    initialState.component = this; // TODO: i don't like this
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
    return objectPath.get(this.application.state, this.path);
  }

};
