import objectPath from 'object-path';

export default class Component {

  constructor(application, parent, name, initialState = {}) {
    this.application = application;
    this.parent = parent;
    this.name = name;
    // TODO: I don't like this, but we should store it in the state.
    // Also, it's mutable. We mutate component to store data such as interval identifiers.
    initialState.component = this;
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
