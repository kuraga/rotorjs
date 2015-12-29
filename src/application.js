function objectPath(object, chunks) {
  let result = object;
  for (let chunk of chunks) {
    result = result[chunk];
  }

  return result;
}

export default function getApplicationClass(Cursor, Loop) {
  class Application {
    constructor(rootNode) {
      this.rootNode = rootNode;

      this.__updateBinded = this.update.bind(this);
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

      this.__loop = new Loop(this.__state, this.__renderBinded);
      this.rootNode.appendChild(this.__loop.target);

      this.__cursor.on('update', this.__updateBinded);
    }

    stop() {
      this.rootComponent.deactivate();

      this.__cursor.off('update', this.__updateBinded);

      this.rootNode.removeChild(this.__loop.target);
    }

    render() {
      return this.rootComponent.render();
    }

    update() {
      this.__loop.update(this.__state);
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
