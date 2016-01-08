export default function getApplicationClass(Cursor, Loop) {
  class Application {
    constructor() {
      this.__redrawBinded = this.redraw.bind(this);
      this.__cursorUpdatedHandler = () => { this.redraw() };
      this.__renderBinded = this.render.bind(this);
    }

    start(rootComponent) {
      let rootComponentName = rootComponent.name;
      let initialState = {
        rootComponentName,
        __subcomponents: {
          [rootComponentName]: rootComponent.initialState
        }
      };
      this.__cursor = new Cursor(initialState);

      this.rootComponent.activate();

      this.__loop = new Loop(this.__renderBinded);

      this.__cursor.on('update', this.__cursorUpdatedHandler);
    }

    stop() {
      this.rootComponent.deactivate();

      this.__cursor.off('update', this.__cursorUpdatedHandler);
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
      let rootComponentName = this.__state.rootComponentName;
      let rootComponentState = this.__state.__subcomponents[rootComponentName];
      return rootComponentState.component;
    }

    getComponentState(path) {
      let result = this.__state;
      for (let chunk of path) {
        result = result.__subcomponents[chunk];
      }

      return result;
    }
  }

  return Application;
}
