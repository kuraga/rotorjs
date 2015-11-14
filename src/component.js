import Freezer from 'freezer-js';

export default class Component extends Freezer {

  constructor(application, parent, name, initialState = {}) {
    let clonedInitialState = Object.assign({}, initialState, {
      application: application,
      parent: parent,
      name: name
    });

    super(clonedInitialState);

    this.__updateBinded = this.update.bind(this);
  }

  activate() {
    this.on('update', this.__updateBinded);
  }

  deactivate() {
    this.off('update', this.__updateBinded);
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
    return this.state.parent;
  }

  get name() {
    return this.state.name;
  }

  render() {
    throw new Error('Not implemented');
  }

  update(currentState = undefined) {
    (this.parent !== null ? this.parent : this.application).update();
  }
};
