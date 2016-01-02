function objectPath(object, chunks) {
  let result = object;
  for (let chunk of chunks) {
    result = result[chunk];
  }

  return result;
}

export default function getApplicationClass(Cursor, Loop) {
  class Application {
    constructor() {
      this.__redrawBinded = this.redraw.bind(this);
      this.__renderBinded = this.render.bind(this);
    }

    start(rootComponent) {
      let rootComponentName = rootComponent.name;
      let initialState = {
        rootComponentName,
        [rootComponentName]: rootComponent.initialState
      };
      this.__cursor = new Cursor(initialState);

      this.rootComponent.activate();

      this.__loop = new Loop(this.__renderBinded);

      this.__cursor.on('update', this.__redrawBinded);
    }

    stop() {
      this.rootComponent.deactivate();

      this.__cursor.off('update', this.__redrawBinded);
    }

    get target() {
      return this.__loop.target;
    }

    render() {
      return this.rootComponent.render();
    }

    redraw() {
      this.__loop.redraw();
    }

    get __state() {
      return this.__cursor.get();
    }

    get rootComponent() {
      return this.__state[this.__state.rootComponentName].component;
    }

    getComponentState(path) {
      return objectPath(this.__state, path);
    }
  }

  return Application;
}
