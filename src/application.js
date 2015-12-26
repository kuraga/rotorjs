export default function getApplicationClass(Cursor, Loop) {
  class Application {
    constructor(rootNode) {
      this.rootNode = rootNode;
    }

    start(rootComponent) {
      let rootComponentName = rootComponent.name;
      let initialState = {
        rootComponentName,
        [rootComponentName]: rootComponent
      };
      this.__cursor = new Cursor(initialState);

      this.rootComponent.activate();

      this.__loop = new Loop(this.__state, this.render.bind(this));
      this.rootNode.appendChild(this.__loop.target);
    }

    stop() {
      this.rootComponent.deactivate();

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
      return this.__state[this.__state.rootComponentName];
    }
  }

  return Application;
}
