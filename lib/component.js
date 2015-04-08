import objectPath from 'object-path';

export default class Component {

  constructor(app, componentPath, initialState = {}) {
    this.app = app;
    this.componentPath = componentPath;
    initialState.component = this; // TODO: i don't like this
  }

  get state() {
    return objectPath.get(this.app.cursor.get(), this.componentPath);
  }

};
