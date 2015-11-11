import Freezer from 'freezer-js';

export default class Component extends Freezer {

  constructor(application, parent, name, initialState = {}) {
    initialState.application = application;
    initialState.parent = parent;
    initialState.name = name;

    super(initialState);

    this.on('update', (currentState) => {
      this.application.stateUpdatedHandler(currentState);
    });
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
    return this.get();
  }

  get application() {
    return this.state.application;
  }

  get parent() {
    return this.state.parrent;
  }

  get name() {
    return this.state.name;
  }

};
